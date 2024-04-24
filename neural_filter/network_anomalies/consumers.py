import asyncio
# import itertools
import json
import os
import time

import keras.saving
import numpy as np

# from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from scapy.sendrecv import AsyncSniffer

from sklearn.preprocessing import LabelEncoder, MinMaxScaler

from file_handler.models import DatasetModel
from file_handler.pcap_package_to_json import pcap_package_to_json
from . import statuses
from .neural_network.format_packages import format_packages

from .new_neural_network.pcap_to_dataset import (array_split,
                                                 pcap_file_to_dataset,
                                                 formated_packages,
                                                 encoded_embedding_model,
                                                 expand_dimension)
from .new_neural_network.model import classification_traffic_nn


# from .neural_network.neural_network_fit import neural_network_fit
# from .neural_network.neural_network_structure import neural_network_structure
# from .neural_network.save_figure_of_learning import save_figure_of_learning
# from .neural_network.save_model import save_model
# from .neural_network.train_data_split import train_data_split


class NeuralNetworkConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.current_work_status = statuses.disconnection_status
        # self.datasets_files = None
        self.asyncSniffer = None
        self.package_id = 0

        self.model = None
        self.anomaly_packages = []

        self.sessions = {}
        self.sessions_encoded = {}

        self.mms = None
        self.label_encoder = None

        self.mean_traffic_predict = 0.0
        self.mean_traffic_predict_list = []

        self.current_dataset_id = None
        self.dataset_packages = None
        self.dataset_labels = None

    # Get dataset from database
    @database_sync_to_async
    def get_dataset_from_db(self, selected_dataset_id):
        try:
            return list(DatasetModel.objects.filter(group_file_id=selected_dataset_id))
        except DatasetModel.DoesNotExist:
            raise DenyConnection("No dataset found")

    # @database_sync_to_async
    # def get_files_from_db(self, selected_dataset_id):
    #     try:
    #         return list(FileHandlerModel.objects.filter(group_file_id=selected_dataset_id).values())
    #     except FileHandlerModel.DoesNotExist:
    #         raise DenyConnection("No file found")

    # Connect with user
    async def connect(self):
        await self.accept()
        await self.send_work_status(new_status=statuses.no_work_status)

    async def disconnect(self, code):
        await self.send_work_status(new_status=statuses.disconnection_status)
        self.model = None
        if self.asyncSniffer:
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
                self.current_dataset_id = dataset_id
                await self.start_education()

        if packet_type == "start_scanning":
            interface = packet["interface"]
            dataset_id = packet["dataset_id"]
            self.current_dataset_id = dataset_id
            await self.start_scanning(interface=interface)

        if packet_type == "stop_scanning":
            await self.stop_scanning()

    async def stop_scanning(self):
        if self.asyncSniffer:
            self.asyncSniffer.stop()
            print("==== Sniffer stopped ====")

    def packet_callback(self, packet):
        # protocols = ["IP"]

        # if len(self.sessions) == 3:
        #     asyncio.run(self.stop_scanning())

        if (packet.haslayer("IP") and
                (packet.haslayer("TCP") or packet.haslayer("UDP"))):
            src_ip = packet["IP"].src
            dst_ip = packet["IP"].dst
            packet_proto = packet['IP'].proto
            packet_len = packet['IP'].len

            src_port = ""
            dst_port = ""

            if packet.haslayer("TCP"):
                src_port = packet["TCP"].sport
                dst_port = packet["TCP"].dport
            elif packet.haslayer("UDP"):
                src_port = packet["UDP"].sport
                dst_port = packet["UDP"].dport

            session_key = f"{'-'.join(src_ip.split('.'))}_{src_port}_{'-'.join(dst_ip.split('.'))}_{dst_port}"

            normal_package = np.array([
                {
                    "id": self.package_id,
                    "time": packet.time,
                    "source": src_ip,
                    "destination": dst_ip,
                    "protocol": packet_proto,
                    "length": packet_len
                }
            ])

            if session_key not in self.sessions:
                self.sessions[session_key] = []
            self.sessions[session_key].append(normal_package)

            package_array = [
                src_ip,
                src_port,
                dst_ip,
                dst_port,
                packet_proto,
                packet_len
            ]

            transformed_packages = asyncio.run(formated_packages(
                package=np.array([package_array])
            ))
            encoded_model = asyncio.run(encoded_embedding_model(input_length=1))
            encoded_packages = encoded_model.predict(transformed_packages)

            new_encoded_packages_dimension = asyncio.run(expand_dimension(encoded_packages=encoded_packages))

            # print(f"{new_encoded_packages_dimension=}")
            # print(f"{new_encoded_packages_dimension.shape=}")

            if session_key not in self.sessions_encoded:
                self.sessions_encoded[session_key] = []
            self.sessions_encoded[session_key].append(new_encoded_packages_dimension)

            if self.model is not None:
                session_for_predict = np.array(self.sessions_encoded[session_key])
                session_predict = self.model.predict(session_for_predict)
                print()
                print("==== Predict ====")
                print(f"{session_predict=}")
                print(f"{session_predict.shape=}")
                print("==== Predict ====")
                print()
        # if "IP" in packet:
        #     package = pcap_package_to_json(
        #         pcap_package=packet,
        #         package_id=self.package_id
        #     )
        #     self.package_id += 1
        #     time.sleep(0.5)
        #     print(f"{package=}")
        #     features = asyncio.run(format_packages(packages=[package]))
        #     print("formatted_package", features)

    async def start_scanning(self, *, interface: str = None):
        if self.model is None:
            model_path = str(os.path.join(
                settings.MODELS_DIR,
                self.current_dataset_id,
                "model",
                "model.keras"
            ))
            self.model = keras.saving.load_model(model_path)

        self.asyncSniffer = AsyncSniffer(
            prn=self.packet_callback,
            iface=interface,
            store=1
        )
        self.asyncSniffer.start()
        print("==== Sniffer started ====")

    async def start_sniffing(self):
        pass

    # async def get_files(self, selected_dataset_id):
    #     all_files = []
    #     # files = await self.get_files_from_db(selected_dataset_id)
    #     # for file in files:
    #     #     file_serializer = FileHandlerSerializer(file)
    #     #     all_files.append(file_serializer.data["file_data"])
    #     self.datasets_files = list(itertools.chain.from_iterable(all_files)) or []

    async def pcap_files_to_dataset(self):
        # Directory for savings datasets and figure
        if self.current_dataset_id:
            models_directory = str(os.path.join(settings.MODELS_DIR, self.current_dataset_id))
            pcap_sessions_path = str(os.path.join(models_directory, "pcap-sessions"))

            # All files from sessions directory
            pcap_files_path = [
                os.path.join(pcap_sessions_path, package_file)
                for package_file in os.listdir(pcap_sessions_path)
            ]

            dataset_packages = []
            dataset_labels = []

            for pcap_file in pcap_files_path:
                packages, label = await pcap_file_to_dataset(pcap_file_path=pcap_file)

                if len(packages) != 0 and len(label) != 0:
                    dataset_packages.append(packages)
                    dataset_labels.append(label)

            self.dataset_packages = dataset_packages
            self.dataset_labels = dataset_labels

    async def mms_layer(self, *, fit_data):
        mms = MinMaxScaler(feature_range=(0, 1))
        mms.fit(fit_data)
        self.mms = mms

    async def label_encoder_layer(self, *, fit_data):
        encoder = LabelEncoder()
        encoder.fit(fit_data)
        self.label_encoder = encoder

    async def start_education(self):

        current_model_path = str(os.path.join(
            settings.MODELS_DIR,
            self.current_dataset_id
        ))

        model_path = os.path.join(
            current_model_path,
            "model",
            "model.keras"
        )

        if os.path.exists(model_path):
            self.model = keras.saving.load_model(model_path)
            print("==== Model already is exist and loaded ====")
        else:
            await self.send_work_status(new_status=statuses.preprocessing_status)
            await asyncio.sleep(1)
            await self.pcap_files_to_dataset()

            if self.dataset_packages and self.dataset_labels:

                # Directory for saving dataset
                dataset_path = str(os.path.join(
                    current_model_path,
                    "dataset"
                ))
                os.mkdir(dataset_path)
                dataset_file_npz = str(os.path.join(dataset_path, "dataset.npz"))

                if len(self.dataset_packages) != 0 and len(self.dataset_labels) != 0:
                    (X_train, y_train), (X_test, y_test) = await array_split(
                        data=self.dataset_packages,
                        labels=self.dataset_labels,
                        train_size=0.8
                    )

                    await self.label_encoder_layer(
                        fit_data=np.concatenate([y_train, y_test])
                    )

                    if self.label_encoder:
                        y_train = self.label_encoder.transform(y_train)
                        y_test = self.label_encoder.transform(y_test)

                        # encoded_train = encoded_data(input_length=len(y_train))
                        # y_train = encoded_train.predict(tf.constant(y_train))
                        # encoded_test = encoded_data(input_length=len(y_test))
                        # y_test = encoded_test.predict(tf.constant(y_test))

                        await self.mms_layer(
                            fit_data=np.concatenate([y_train, y_test]).reshape(-1, 1)
                        )

                        if self.mms:
                            encoded_y_train = self.mms.transform(y_train.reshape(-1, 1))
                            y_train = encoded_y_train.reshape(1, -1)[0]

                            encoded_y_test = self.mms.transform(y_test.reshape(-1, 1))
                            y_test = encoded_y_test.reshape(1, -1)[0]

                            print(f"{y_train}")
                            print(f"{y_test}")

                            dataset_for_save = {
                                "X_train": X_train,
                                "y_train": y_train,
                                "X_test": X_test,
                                "y_test": y_test
                            }

                            np.savez(dataset_file_npz, **dataset_for_save)

                if os.path.exists(dataset_file_npz):
                    await self.send_work_status(new_status=statuses.is_studying_status)
                    await asyncio.sleep(1)

                    dataset = np.load(dataset_file_npz)
                    os.mkdir(os.path.join(
                        current_model_path,
                        "model",
                    ))
                    model = await classification_traffic_nn(
                        dataset=dataset,
                        save_model_path=model_path
                    )

                    self.model = model["model"]

                    await self.send_work_status(new_status=statuses.working_status)

        # # Searching models
        # files_from_dataset_directory = os.listdir(str(dataset_directory))
        # file_extensions = [".".join(file.split(".")[1:]) for file in files_from_dataset_directory]
        # starting_education = True if 'weights.h5' in file_extensions and "webp" in file_extensions else False

        # # If current dataset_id models isn't exit - start education
        # if not starting_education:
        #     # await self.get_files(dataset_id)
        #
        #     if self.datasets_files:
        #         # Dataset
        #         features = await format_packages(packages=self.datasets_files)
        #         x_train, x_test = await train_data_split(
        #             features=features,
        #             test_size=0.2,
        #             train_size=0.8,
        #             random_state=42
        #         )
        #
        #         model = await neural_network_structure(x_train=x_train)
        #
        #         epochs = 5
        #         history = await neural_network_fit(
        #             neural_model=model,
        #             x_train=x_train,
        #             x_test=x_train,
        #             epochs=epochs,
        #             batch_size=32,
        #             shuffle=True,
        #             validation_data=(x_test, x_test)
        #         )
        #
        #         average_loss = sum(history.history["loss"]) / len(history.history["loss"])
        #         average_val_loss = sum(history.history["val_loss"]) / len(history.history["val_loss"])
        #
        #         average_accuracy = sum(history.history["accuracy"]) / len(history.history["accuracy"])
        #         average_val_accuracy = sum(history.history["val_accuracy"]) / len(history.history["val_accuracy"])
        #
        #         average_loss_round = round(average_loss, 3)
        #         average_val_loss_round = round(average_val_loss, 3)
        #         average_accuracy_round = round(average_accuracy, 3)
        #         average_val_accuracy_round = round(average_val_accuracy, 3)
        #
        #         dataset = await self.get_dataset_from_db(dataset_id)
        #         dataset[0].loss = average_loss_round
        #         dataset[0].val_loss = average_val_loss_round
        #         dataset[0].accuracy = average_accuracy_round
        #         dataset[0].val_accuracy = average_val_accuracy_round
        #
        #         await sync_to_async(dataset[0].save)()
        #
        #         model_file_name = f"{dataset_id}.weights.h5"
        #
        #         await save_model(
        #             file_name=model_file_name,
        #             model=model,
        #             path_to_save=dataset_directory
        #         )
        #
        #         await save_figure_of_learning(
        #             history=history,
        #             epochs=epochs,
        #             file_name=dataset_id,
        #             path_to_save=dataset_directory
        #         )
        #
        #         await self.send(text_data=json.dumps({
        #             "status": "success",
        #             "type": "start_education",
        #             "data": {
        #                 "dataset_id": dataset_id,
        #                 "loss": dataset[0].loss,
        #                 "accuracy": dataset[0].accuracy,
        #             }
        #         }))
        # else:
        #     model_weights_file = list(filter(lambda file: "weights.h5" in file, files_from_dataset_directory))[0]

    async def send_work_status(self, *, new_status: dict):
        self.current_work_status = new_status
        # print(f"Sending work status is {self.current_work_status}")
        await self.send(text_data=json.dumps(self.current_work_status))
