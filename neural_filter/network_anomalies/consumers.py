import json
import itertools

from asgiref.sync import sync_to_async

from file_handler.models import FileHandlerModel, DatasetModel
from file_handler.serializers import FileHandlerSerializer

from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer

from . import statuses
from network_anomalies.neural_network.format_packages import format_packages
from network_anomalies.neural_network.neural_network_structure import neural_network_structure
from network_anomalies.neural_network.neural_network_fit import neural_network_fit
from network_anomalies.neural_network.save_model import save_model


class NeuralNetworkConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.current_work_status = statuses.disconnection_status
        self.selected_dataset_id = None
        self.datasets_files = None

    async def get_files(self):
        all_files = []

        files = await self.get_files_from_db()

        for file in files:
            file_serializer = FileHandlerSerializer(file)
            all_files.append(file_serializer.data["file_data"])

        self.datasets_files = list(itertools.chain.from_iterable(all_files)) or []

    @database_sync_to_async
    def get_files_from_db(self):
        try:
            return list(FileHandlerModel.objects.filter(group_file_id=self.selected_dataset_id).values())
        except FileHandlerModel.DoesNotExist:
            raise DenyConnection("No file found")

    @database_sync_to_async
    def get_dataset_from_db(self):
        try:
            return list(DatasetModel.objects.filter(group_file_id=self.selected_dataset_id))
        except DatasetModel.DoesNotExist:
            raise DenyConnection("No dataset found")

    async def connect(self):
        await self.accept()
        self.current_work_status = statuses.no_work_status
        await self.send_work_status(work_status=self.current_work_status)

    async def disconnect(self, code):
        self.current_work_status = statuses.disconnection_status

    async def receive(self, text_data=None, bytes_data=None):
        packet = json.loads(text_data)
        packet_type = packet["send_type"]

        if packet_type == "start_education":
            dataset_id = packet["data"]
            await self.start_education(dataset_id=dataset_id)

        if packet_type == "stop_work":
            pass

    async def scanning_interface(self):
        pass

    async def start_education(self, *, dataset_id):
        if dataset_id:
            self.current_work_status = statuses.is_studying_status
            await self.send_work_status(work_status=self.current_work_status)

            self.selected_dataset_id = dataset_id
            await self.get_files()

            if self.datasets_files:
                # Dataset
                x_train, x_test, features = await format_packages(packages=self.datasets_files)

                model = await neural_network_structure(x_train=x_train)
                history = await neural_network_fit(
                    neural_model=model,
                    x_train=x_train,
                    x_test=x_train,
                    epochs=5,
                    batch_size=32,
                    shuffle=True,
                    validation_data=(x_test, x_test)
                )

                average_loss = sum(history.history["loss"]) / len(history.history["loss"])
                average_accuracy = sum(history.history["accuracy"]) / len(history.history["accuracy"])

                average_loss_round = round(average_loss, 3)
                average_accuracy_round = round(average_accuracy, 3)

                dataset = await self.get_dataset_from_db()
                dataset[0].loss = average_loss_round
                dataset[0].accuracy = average_accuracy_round
                await sync_to_async(dataset[0].save)()

                await save_model(file_name=dataset_id, model=model)

    async def send_work_status(self, *, work_status: dict):
        await self.send(text_data=json.dumps(work_status))
