import asyncio
import json
import os
import time
from typing import Any

import joblib
import keras
import numpy as np
from asgiref.sync import sync_to_async
from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection, StopConsumer
from channels.generic.websocket import AsyncWebsocketConsumer
from django.conf import settings
from file_handler.models import DatasetModel
from scapy.sendrecv import AsyncSniffer
from sklearn.preprocessing import MinMaxScaler
from tqdm import tqdm

from . import directories, statuses
from .neural_network.model import classification_traffic_nn
from .neural_network.pcap_to_dataset_v2 import (
    expand_dimension,
    format_packet,
    format_packets,
    image_of_package_size,
    read_pcap,
    split_dataset,
)

# from .neural_network.pcap_to_dataset import (
#     array_split,
#     pcap_file_to_dataset,
#     formatted_package,
#     encoded_embedding_model,
#     expand_dimension
# )
from .neural_network.training_graph import training_graph


class NeuralNetworkConsumer(AsyncWebsocketConsumer):
    def __init__(self):
        super().__init__()
        self.current_work_status = statuses.disconnection_status
        # Async Sniffer for scanning traffic in the interface
        self.asyncSniffer = None
        # Package id for all the sessions in traffic-sniffing
        self.package_id = 0

        # Current model in Web-Socket session
        self.model: Any

        self.anomaly_packages_for_send_client = {}

        # All sessions in traffic-sniffing
        self.sessions = {}
        # The same sessions, only they have encoded format
        self.sessions_encoded = {}
        # Sessions of mms model
        self.sessions_mms = {}

        # Mean traffic predicted separate for sessions
        self.mean_traffic_predict_sessions = {}

        # Current model-id in Web-Socket session
        self.current_model_id: str
        self.current_model_path: str

        # Dataset packages for education model. They aren't separated for X_train, X_test.
        self.dataset_packages: np.ndarray
        # Dataset labels for education model. They aren't separated for y_train, y_test.
        self.dataset_labels: np.ndarray

    async def clear_state(self):
        self.current_work_status = statuses.disconnection_status
        self.asyncSniffer = None
        self.package_id = 0

        self.model

        self.anomaly_packages_for_send_client = {}

        self.sessions = {}
        self.sessions_encoded = {}
        self.sessions_mms = {}

        self.mean_traffic_predict_sessions = {}

        self.current_model_id = ""
        self.current_model_path = ""

        self.dataset_packages = np.array([], dtype=np.float64)
        self.dataset_labels = np.array([], dtype=np.int64)

    # Get dataset from database
    @database_sync_to_async
    def get_dataset_from_db(self, selected_dataset_id):
        try:
            return list(DatasetModel.objects.filter(modelID=selected_dataset_id))
        except DatasetModel.DoesNotExist:
            raise DenyConnection("No dataset found")

    # Connect with user
    async def connect(self):
        await self.accept()
        if self.current_work_status == statuses.disconnection_status:
            await self.send_work_status(new_status=statuses.no_work_status)
        else:
            await self.send_work_status(new_status=self.current_work_status)

    async def disconnect(self, code):
        await self.send_work_status(new_status=statuses.disconnection_status)
        self.model = None
        self.sessions_mms = {}
        if self.asyncSniffer is not None:
            self.asyncSniffer.stop()
            self.asyncSniffer = None
        raise StopConsumer()

    # Get any massages from user
    async def receive(self, text_data=None, bytes_data=None):
        if text_data is None:
            await self.send("Text data couldn't be None value")
            return

        message = json.loads(text_data)
        send_type = message["send_type"]

        if send_type == "start_education":
            dataset_id = message["data"]
            if dataset_id:
                self.current_model_id = dataset_id
                self.current_model_path = str(
                    os.path.join(settings.MODELS_DIR, dataset_id)
                )
                await self.start_education()

        if send_type == "stop_education":
            await self.stop_education()

        if send_type == "start_scanning":
            interface = message["interface"]

            self.anomaly_packages_for_send_client = {}
            self.sessions = {}
            self.sessions_encoded = {}
            self.mean_traffic_predict_sessions = {}

            await self.start_scanning(interface=interface)

        if send_type == "stop_scanning":
            await self.stop_scanning()

    async def stop_scanning(self):
        if self.asyncSniffer is not None:
            self.asyncSniffer.stop()
            self.asyncSniffer = None
            print("")
            print("==== Sniffer stopped ====")

    async def stop_education(self):
        await self.send_work_status(new_status=statuses.no_work_status)
        await self.send_work_data(
            send_type="no_work",
            data={
                "status": "success",
                "model_id": self.current_model_id,
            },
        )
        await self.clear_state()
        print("")
        print("==== Education or working stopped ====")
        # raise StopConsumer()

    def packet_callback(self, packet):
        if packet.haslayer("IP") and packet.haslayer("TCP"):
            # Header
            mac_src = packet.fields["src"]
            mac_dst = packet.fields["dst"]

            # IP layer
            ip_src = packet["IP"].src
            ip_dst = packet["IP"].dst
            ip_len = packet["IP"].len
            ip_proto = packet["IP"].proto

            # TCP layer
            tcp_sport = packet["TCP"].sport
            tcp_dport = packet["TCP"].dport

            src_key = f"{'-'.join(packet['IP'].src.split('.'))}_{tcp_sport}"
            dst_key = f"{'-'.join(packet['IP'].dst.split('.'))}_{tcp_dport}"
            session_key = f"{src_key}_{dst_key}"

            keys_with_sessions = [
                key for key in self.sessions.keys() if src_key in key and dst_key in key
            ]
            if len(keys_with_sessions) == 1:
                session_key = keys_with_sessions[0]

            normal_package = {
                "time": float(packet.time),
                "source": ip_src,
                "MACSrc": mac_src,
                "portSrc": tcp_sport,
                "destination": ip_dst,
                "MACDst": mac_dst,
                "portDst": tcp_dport,
                "protocol": ip_proto,
                "length": ip_len,
            }

            (ip_src, ip_dst), (mac_dst, mac_src) = asyncio.run(
                format_packet(
                    ip_addresses=[ip_src, ip_dst], mac_addresses=[mac_dst, mac_src]
                )
            )
            package_array = np.array(
                [
                    mac_dst,
                    mac_src,
                    ip_src,
                    ip_dst,
                    tcp_sport,
                    tcp_dport,
                    ip_len,
                    ip_proto,
                ]
            )

            session_mms_key = [
                key
                for key in self.sessions_mms.keys()
                if src_key in key and dst_key in key
            ]

            if len(package_array) == 8:
                if len(session_mms_key) == 1:
                    session_mms = self.sessions_mms[session_mms_key[0]]
                    package_array = session_mms.transform(package_array.reshape(-1, 1))
                else:
                    mms = asyncio.run(
                        self.mms_layer(
                            fit_data=package_array.reshape(-1, 1),
                            session_key=session_key,
                        )
                    )
                    package_array = mms.transform(package_array.reshape(-1, 1))

                # package_len = 1
                # if len(self.sessions_encoded) and session_key in self.sessions_encoded:
                #     package_len = len(self.sessions_encoded[session_key])
                #
                # encoded_model = asyncio.run(encoded_embedding_model(
                #     input_length=package_len * 8
                # ))
                # encoded_packages = encoded_model.predict(package_array, verbose=0)
                # new_encoded_packages_dimension = asyncio.run(expand_dimension(encoded_packages=[encoded_packages]))

                if session_key not in self.sessions:
                    self.sessions[session_key] = []
                if session_key not in self.sessions_encoded:
                    self.sessions_encoded[session_key] = []

                exist_package_in_object = (
                    True
                    if {
                        "source": ip_src,
                        "MACSrc": mac_src,
                        "portSrc": tcp_sport,
                        "destination": ip_dst,
                        "MACDst": mac_dst,
                        "portDst": tcp_dport,
                        "protocol": ip_proto,
                        "length": ip_len,
                    }
                    in self.sessions[session_key]
                    else False
                )

                if not exist_package_in_object:
                    if len(self.sessions[session_key]) >= 16:

                        self.sessions[session_key].append(normal_package)
                        self.sessions_encoded[session_key].append(package_array)

                        if self.model is not None:
                            session_for_predict = np.array(
                                [self.sessions_encoded[session_key]]
                            )

                            session_for_predict, _ = asyncio.run(
                                format_packets(packages=session_for_predict)
                            )

                            #
                            session_for_predict[session_for_predict == 0] = np.mean(
                                session_for_predict, axis=(0, 1, 2, 3)
                            )

                            session_predict = self.model.predict(
                                session_for_predict, verbose="0"
                            )
                            session_predict = session_predict[0][0]
                            print(f"{session_predict=}")

                            if 0.09 < session_predict < 0.11:
                                if (
                                    session_key
                                    not in self.anomaly_packages_for_send_client
                                ):
                                    self.anomaly_packages_for_send_client[
                                        session_key
                                    ] = []
                                self.anomaly_packages_for_send_client[
                                    session_key
                                ].append(normal_package)
                                asyncio.run(
                                    self.send_work_data(
                                        send_type="found_anomaly_traffic",
                                        data={
                                            "status": "success",
                                            "session": session_key,
                                            "anomaly_package": normal_package,
                                        },
                                    )
                                )
                    else:
                        self.sessions[session_key].append(normal_package)
                        self.sessions_encoded[session_key].append(package_array)
                time.sleep(0.1)

            #     if session_key in self.mean_traffic_predict_sessions:
            #         last_predict_package = session_predict[-1][0]
            #
            #         # mean_predict_max = (self.mean_traffic_predict_sessions[session_key] +
            #         #                     self.mean_traffic_predict_sessions[session_key] * 0.05)
            #
            #         mean_predict_min = (self.mean_traffic_predict_sessions[session_key] -
            #                             self.mean_traffic_predict_sessions[session_key] * 0.2)
            #
            #         print(mean_predict_min, last_predict_package)
            #
            #         anomaly_traffic = False if mean_predict_min < last_predict_package else True
            #
            #         if anomaly_traffic:
            #             if session_key not in self.anomaly_packages_for_send_client:
            #                 self.anomaly_packages_for_send_client[session_key] = []
            #             self.anomaly_packages_for_send_client[session_key].append(normal_package)
            #             asyncio.run(self.send_work_data(
            #                 send_type="found_anomaly_traffic",
            #                 data={
            #                     "status": "success",
            #                     "session": session_key,
            #                     "anomaly_package": normal_package
            #                 }
            #             ))
            #         else:
            #             self.mean_traffic_predict_sessions[session_key] = session_predict_mean
            #     else:
            #         self.mean_traffic_predict_sessions[session_key] = session_predict_mean

    #
    # Start scanning traffic
    async def start_scanning(self, *, interface: str = ""):
        if self.model is None:
            model_path = str(
                os.path.join(
                    self.current_model_path, directories.model_directory, "model.keras"
                )
            )
            model = keras.saving.load_model(model_path)

            if model:
                self.model = model

        self.asyncSniffer = AsyncSniffer(
            prn=self.packet_callback, iface=interface, store=1
        )
        self.asyncSniffer.start()
        print("")
        print("==== Sniffer started ====")

    #
    # Pcap files to dataset V2
    async def pcap_files_to_dataset_v2(self):
        if self.current_model_id:
            sessions_path = str(
                os.path.join(self.current_model_path, directories.sessions_directory)
            )

            # All files from sessions directory
            pcap_files_path = [
                os.path.join(sessions_path, package_file)
                for package_file in os.listdir(sessions_path)
            ]

            dataset_packages = []
            dataset_labels = np.array([])

            for pcap_file in tqdm(pcap_files_path):
                array, label = await read_pcap(
                    pcap_path=pcap_file,
                )

                mms = await self.mms_layer(
                    fit_data=array.reshape(-1, image_of_package_size), session_key=label
                )
                array = mms.transform(array)

                if len(array) != 0:
                    dataset_packages.append(array)
                    dataset_labels = np.append(dataset_labels, label)

            data_train_max_length = max(len(lst) for lst in dataset_packages)

            dataset_packages = np.array(
                [
                    np.concatenate(
                        (
                            lst,
                            np.zeros(
                                [
                                    int(data_train_max_length - len(lst)),
                                    image_of_package_size,
                                ]
                            ),
                        )
                    )
                    for lst in dataset_packages
                ]
            )

            # Change 0 to mean value
            dataset_packages[dataset_packages == 0] = np.mean(
                dataset_packages, axis=(0, 1, 2)
            )

            dataset_packages = await expand_dimension(encoded_packages=dataset_packages)

            dataset_packages, dataset_labels = await format_packets(
                packages=dataset_packages, labels=dataset_labels
            )
            self.dataset_packages = dataset_packages
            self.dataset_labels = dataset_labels

    # #
    # # Pcap files to dataset V1
    # async def pcap_files_to_dataset(self):
    #     # Directory for savings datasets and figure
    #     if self.current_model_id:
    #         sessions_path = str(os.path.join(
    #             self.current_model_path,
    #             directories.sessions_directory
    #         ))
    #
    #         # All files from sessions directory
    #         pcap_files_path = [
    #             os.path.join(sessions_path, package_file)
    #             for package_file in os.listdir(sessions_path)
    #         ]
    #
    #         dataset_packages = []
    #         dataset_labels = []
    #
    #         for pcap_file in pcap_files_path:
    #             packages, label = await pcap_file_to_dataset(
    #                 pcap_file_path=pcap_file,
    #                 pcap_files_count=len(pcap_files_path)
    #             )
    #
    #             if len(packages) != 0 and len(label) != 0:
    #                 dataset_packages.append(packages)
    #                 dataset_labels.append(label)
    #
    #         self.dataset_packages = dataset_packages
    #         self.dataset_labels = dataset_labels
    #         print("==== Datasets successfully loaded ====")

    #
    # MinMaxLayer for encoded packages
    async def mms_layer(self, *, fit_data, session_key):
        mms = MinMaxScaler(feature_range=(0, 1))
        mms.fit(fit_data)
        self.sessions_mms[session_key] = mms
        return mms

    # Start education model or run saved model
    async def start_education(self):
        model_path = os.path.join(
            self.current_model_path, directories.model_directory, "model.keras"
        )
        helpful_files = str(
            os.path.join(
                self.current_model_path,
                directories.helpful_directory,
                "min_max_sessions_scaler.pkl",
            )
        )

        if os.path.exists(model_path) and os.path.exists(helpful_files):
            self.model = keras.saving.load_model(model_path)

            if len(self.sessions_mms.keys()):
                self.sessions_mms = {}
            self.sessions_mms = joblib.load(helpful_files)

            await self.send_work_status(new_status=statuses.working_status)
            await self.send_work_data(
                send_type="model_work",
                data={
                    "status": "success",
                    "modelID": self.current_model_id,
                },
            )
            print("")
            print(self.current_model_id)
            print("==== Model already is exist and loaded ====")

        else:
            print("==== Start encoded files ====")
            await self.send_work_status(new_status=statuses.preprocessing_status)
            await self.send_work_data(
                send_type="model_study",
                data={
                    "status": "success",
                    "modelID": self.current_model_id,
                },
            )
            await asyncio.sleep(1)
            await self.pcap_files_to_dataset_v2()

            if len(self.dataset_packages) and len(self.dataset_labels):

                # Directory for saving dataset
                dataset_path = str(
                    os.path.join(self.current_model_path, directories.dataset_directory)
                )
                dataset_file_npz = str(os.path.join(dataset_path, "dataset.npz"))

                (X_train, y_train), (X_test, y_test) = await split_dataset(
                    data=self.dataset_packages,
                    labels=self.dataset_labels,
                    test_size=0.2,
                )

                dataset_for_save = {
                    "X_train": X_train,
                    "y_train": y_train,
                    "X_test": X_test,
                    "y_test": y_test,
                }

                np.savez(dataset_file_npz, **dataset_for_save)
                if len(self.sessions_mms.keys()):
                    joblib.dump(self.sessions_mms, helpful_files)
                if os.path.exists(dataset_file_npz) and os.path.exists(helpful_files):
                    print("")
                    print("==== Start education model ====")
                    await self.send_work_status(new_status=statuses.is_studying_status)
                    await asyncio.sleep(1)
                    model, history, epochs = await classification_traffic_nn(
                        X_train=X_train,
                        y_train=y_train,
                        X_test=X_test,
                        y_test=y_test,
                        save_model_path=model_path,
                    )

                    self.model = model
                    graph_path = str(
                        os.path.join(
                            self.current_model_path, directories.graph_directory
                        )
                    )
                    await training_graph(
                        history=history,
                        epochs=epochs,
                        file_name="graph",
                        path_to_save=graph_path,
                    )
                    dataset_db = await self.get_dataset_from_db(self.current_model_id)
                    dataset_db[0].loss = history.history["loss"][-1]
                    await sync_to_async(dataset_db[0].save)()
                    await self.send_work_data(
                        send_type="finish_education",
                        data={
                            "modelID": self.current_model_id,
                            "status": "success",
                            "loss": dataset_db[0].loss,
                        },
                    )
                    await self.send_work_status(new_status=statuses.working_status)
                    await self.send_work_data(
                        send_type="model_work",
                        data={
                            "status": "success",
                            "modelID": self.current_model_id,
                            "loss": dataset_db[0].loss,
                        },
                    )
                    print("")
                    print("==== Model has been trained and is ready to work ====")

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

    async def send_work_data(self, *, send_type: str, data: dict):
        send_data = {"send_type": send_type, "data": data}
        await self.send(text_data=json.dumps(send_data))

    async def send_work_status(self, *, new_status: dict):
        self.current_work_status = new_status
        # print(f"Sending work status is {self.current_work_status}")
        await self.send(text_data=json.dumps(self.current_work_status))
