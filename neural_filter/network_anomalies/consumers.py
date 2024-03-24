import json
import time
import itertools
import asyncio

from asgiref.sync import sync_to_async
from scapy.all import AsyncSniffer
from pandas import DataFrame

from file_handler.models import FileHandlerModel
from file_handler.serializers import FileHandlerSerializer

from channels.db import database_sync_to_async
from channels.exceptions import DenyConnection
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.layers import get_channel_layer

from .serializers import NetworkAnomalySerializer
from .models import NetworkAnomaliesModel
from . import statuses
from . import format_packages


@sync_to_async
def get_status_from_db():
    return NetworkAnomaliesModel.objects.get(key=0)


@sync_to_async
def serialize_network_anomalies():
    return NetworkAnomalySerializer


@sync_to_async
def update_status_in_bd(*, new_status: dict):
    status_from_db = NetworkAnomaliesModel.objects.get(key=0)

    new_status = NetworkAnomalySerializer(instance=status_from_db, data={
        "current_work_state": new_status
    })

    if new_status.is_valid():
        new_status.save()
        # return new_status.data['current_work_state']


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

    async def connect(self):
        await self.accept()
        self.current_work_status = statuses.no_work_status
        await self.send_work_status(work_status=self.current_work_status)

        await self.channel_layer.send(
            "neural_network_status",
            {
                "type": "neural_network.status",
                "current_work_state": self.current_work_status
            }
        )
        # print(get_channel_layer())

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
        self.current_work_status = statuses.is_studying_status

        await self.channel_layer.send(
            "neural_network_status",
            {
                "current_work_state": self.current_work_status
            }
        )

        self.selected_dataset_id = dataset_id
        await self.get_files()

        # Датасет
        df_encoded: DataFrame = await format_packages.format_packages(packages=self.datasets_files)

        await self.send_work_status(work_status=self.current_work_status)

    async def send_work_status(self, *, work_status: dict):
        await self.send(text_data=json.dumps(work_status))
