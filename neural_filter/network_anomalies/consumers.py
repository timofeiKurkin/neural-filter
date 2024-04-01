import json
import itertools
import os
import asyncio
import time

from asgiref.sync import sync_to_async
from scapy.sendrecv import AsyncSniffer

from file_handler.models import FileHandlerModel, DatasetModel
from file_handler.serializers import FileHandlerSerializer
from file_handler.pcap_package_to_json import pcap_package_to_json

from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer

from django.conf import settings

from . import statuses

from .neural_network.format_packages import format_packages
from .neural_network.neural_network_structure import neural_network_structure
from .neural_network.neural_network_fit import neural_network_fit
from .neural_network.save_model import save_model
from .neural_network.save_figure_of_learning import save_figure_of_learning
from .neural_network.train_data_split import train_data_split


class NeuralNetworkConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.current_work_status = statuses.disconnection_status
        self.datasets_files = None
        self.asyncSniffer = None
        self.package_id = 0
        self.anomaly_packages = []

    # Get dataset from database
    @database_sync_to_async
    def get_dataset_from_db(self, selected_dataset_id):
        try:
            return list(DatasetModel.objects.filter(group_file_id=selected_dataset_id))
        except DatasetModel.DoesNotExist:
            raise DenyConnection("No dataset found")

    @database_sync_to_async
    def get_files_from_db(self, selected_dataset_id):
        try:
            return list(FileHandlerModel.objects.filter(group_file_id=selected_dataset_id).values())
        except FileHandlerModel.DoesNotExist:
            raise DenyConnection("No file found")

    # Connect with user
    async def connect(self):
        await self.accept()
        self.current_work_status = statuses.no_work_status
        await self.send_work_status(work_status=self.current_work_status)

    async def disconnect(self, code):
        self.current_work_status = statuses.disconnection_status
        self.asyncSniffer.stop()

    # Get any massages from user
    async def receive(self, text_data=None, bytes_data=None):
        packet = json.loads(text_data)
        packet_type = packet["send_type"]

        if packet_type == "echo":
            await self.send(text_data="Hello, this is echo")

        if packet_type == "start_education":
            dataset_id = packet["data"]
            if dataset_id:
                await self.start_education(dataset_id=dataset_id)

        if packet_type == "start_scanning":
            interface = packet["interface"]
            await self.start_scanning(interface)

        if packet_type == "stop_scanning":
            await self.stop_scanning()

    async def stop_scanning(self):
        if self.asyncSniffer:
            self.asyncSniffer.stop()
            print("==== Sniffer stopped ====")

    def packet_callback(self, packet):
        # protocols = ["IP"]
        if "IP" in packet:
            package = pcap_package_to_json(
                pcap_package=packet,
                package_id=self.package_id
            )
            self.package_id += 1
            time.sleep(0.5)
            print(f"{package=}")
            features = asyncio.run(format_packages(packages=[package]))
            print("formatted_package", features)

    async def start_scanning(self, interface: str = None):
        self.asyncSniffer = AsyncSniffer(
            prn=self.packet_callback,
            iface=interface,
            store=1
        )
        self.asyncSniffer.start()
        print("==== Sniffer started ====")

    async def start_sniffing(self):
        pass

    async def get_files(self, selected_dataset_id):
        all_files = []

        files = await self.get_files_from_db(selected_dataset_id)

        for file in files:
            file_serializer = FileHandlerSerializer(file)
            all_files.append(file_serializer.data["file_data"])

        self.datasets_files = list(itertools.chain.from_iterable(all_files)) or []

    async def start_education(self, *, dataset_id):
        self.current_work_status = statuses.is_studying_status
        await self.send_work_status(work_status=self.current_work_status)

        # Directory for savings datasets and figure
        dataset_directory = os.path.join(settings.MODELS_DIR, dataset_id)

        # If dataset_directory isn't exist - create
        if not os.path.exists(dataset_directory):
            os.makedirs(dataset_directory)

        # Searching models
        files_from_dataset_directory = os.listdir(str(dataset_directory))
        file_extensions = [".".join(file.split(".")[1:]) for file in files_from_dataset_directory]

        starting_education = True if 'weights.h5' in file_extensions and "webp" in file_extensions else False

        # If current dataset_id models isn't exit - start education
        if not starting_education:
            await self.get_files(dataset_id)

            if self.datasets_files:
                # Dataset
                features = await format_packages(packages=self.datasets_files)
                x_train, x_test = await train_data_split(
                    features=features,
                    test_size=0.2,
                    train_size=0.8,
                    random_state=42
                )

                model = await neural_network_structure(x_train=x_train)

                epochs = 5
                history = await neural_network_fit(
                    neural_model=model,
                    x_train=x_train,
                    x_test=x_train,
                    epochs=epochs,
                    batch_size=32,
                    shuffle=True,
                    validation_data=(x_test, x_test)
                )

                average_loss = sum(history.history["loss"]) / len(history.history["loss"])
                average_val_loss = sum(history.history["val_loss"]) / len(history.history["val_loss"])

                average_accuracy = sum(history.history["accuracy"]) / len(history.history["accuracy"])
                average_val_accuracy = sum(history.history["val_accuracy"]) / len(history.history["val_accuracy"])

                average_loss_round = round(average_loss, 3)
                average_val_loss_round = round(average_val_loss, 3)
                average_accuracy_round = round(average_accuracy, 3)
                average_val_accuracy_round = round(average_val_accuracy, 3)

                dataset = await self.get_dataset_from_db(dataset_id)
                dataset[0].loss = average_loss_round
                dataset[0].val_loss = average_val_loss_round
                dataset[0].accuracy = average_accuracy_round
                dataset[0].val_accuracy = average_val_accuracy_round

                await sync_to_async(dataset[0].save)()

                model_file_name = f"{dataset_id}.weights.h5"

                await save_model(
                    file_name=model_file_name,
                    model=model,
                    path_to_save=dataset_directory
                )

                await save_figure_of_learning(
                    history=history,
                    epochs=epochs,
                    file_name=dataset_id,
                    path_to_save=dataset_directory
                )

                await self.send(text_data=json.dumps({
                    "status": "success",
                    "type": "start_education",
                    "data": {
                        "dataset_id": dataset_id,
                        "loss": dataset[0].loss,
                        "accuracy": dataset[0].accuracy,
                    }
                }))
        else:
            model_weights_file = list(filter(lambda file: "weights.h5" in file, files_from_dataset_directory))[0]

    async def send_work_status(self, *, work_status: dict):
        await self.send(text_data=json.dumps(work_status))
