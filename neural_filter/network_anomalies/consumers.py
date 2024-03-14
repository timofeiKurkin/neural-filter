import json
import time
import asyncio

from asgiref.sync import sync_to_async
from scapy.all import AsyncSniffer
from channels.generic.websocket import AsyncWebsocketConsumer, WebsocketConsumer
from .serializers import NetworkAnomalySerializer
from .models import NetworkAnomaliesModel
from . import statuses


# def create_wights_model(*, dataset_id):
#     pass


class NeuralNetworkStatusConsumer(WebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.serializer = NetworkAnomalySerializer
        # self.model = NetworkAnomaliesModel()
        self.current_work_status = statuses.disconnection_status
        self.status = NetworkAnomaliesModel.objects.all()

    def change_status(self, *, new_status):
        self.current_work_status = new_status
        self.send_work_status(work_status=self.current_work_status)

    def connect(self):
        self.accept()

        # status = NetworkAnomaliesModel.objects.all()

        if len(self.status.values()):
            self.status.delete()

        status = self.serializer(data={
            "current_work_state": statuses.no_work_status
        })

        if status.is_valid():
            status.save()

            self.current_work_status = status.data['current_work_state']
            self.send_work_status(work_status=self.current_work_status)

    def disconnect(self, code):
        self.current_work_status = statuses.disconnection_status
        self.send_work_status(work_status=self.current_work_status)
        self.status.delete()

    def receive(self, text_data=None, bytes_data=None):
        # print(text_data)
        pass
        # data_json = json.loads(text_data)

    def send_work_status(self, *, work_status: dict):
        self.send(text_data=json.dumps(work_status))


class NetworkAnomalyConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_work_status = statuses.no_work_status
        self.current_packet = None
        self.traffic = None
        pass

    async def connect(self):
        await self.accept()

    async def disconnect(self, code):
        if self.traffic:
            self.traffic.stop()

    def packet_callback(self, packet):
        if "IP" in packet:
            data = {
                "time": packet.time,
                "source": packet["IP"].src,
                "destination": packet["IP"].dst,
                # "protocol": ip_proto_convert(packet['IP']),
                "protocol": packet['IP'].proto,
                "length": len(packet)
            }
            time.sleep(0.2)
            self.current_packet = data
            asyncio.run(self.predict_neural_network())

    async def receive(self, text_data=None, bytes_data=None):
        # После подключения отправляю на сервер сообщение с выбранным интерфейсом для сканирования сети
        data = json.loads(text_data)
        interface = data["interface"]

        # Этот код чинит ошибку
        # WARNING: Unable to guess datalink type (interface=Ethernet linktype=1).
        # Using <member 'name' of 'Packet' objects>
        # if_list = get_if_list()
        # print(if_list)

        if interface:
            self.traffic = AsyncSniffer(prn=self.packet_callback, iface=interface, store=1)
            await self.start_sniffing()

    async def start_sniffing(self):
        await self.send(text_data=json.dumps("Starting sniffing"))
        self.traffic.start()

    async def predict_neural_network(self):
        # Here I will read .keras file with neural-network and make predict by one packet
        # model = keras.saving.load_model("neural-network-for-work.keras")
        # packet_for_predict = ...reformatted current_packet
        # predict = model.predict(packet)

        # mse = np.mean(np.square(packet_for_predict - predictions), axis=1)
        # threshold = np.mean(mse) + 2 * np.std(mse)

        # anomaly = packet_for_predict[mse > threshold]
        # print(len(anomalies))

        # if anomaly:
        #   self.send(text_data=json.dumps(self.current_packet))
        pass


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
        # self.serializer = sync_to_async(NetworkAnomalySerializer)
        # self.satus_from_db = NetworkAnomaliesModel.objects.get(key=0)
        self.current_work_status = statuses.disconnection_status

    async def connect(self):
        await self.accept()
        self.current_work_status = statuses.no_work_status
        await self.send_work_status(work_status=self.current_work_status)

        # instance = await get_status_from_db()
        #
        # print("instance", instance)
        #
        # # serializer = await serialize_network_anomalies()
        # connect_status = await self.serializer(instance=instance, data={
        #     "current_work_state": statuses.no_work_status
        # })
        #
        # if connect_status.is_valid():
        #     await connect_status.save()
        #
        #     print("connect_status", connect_status)
        #
        #     self.current_work_status = connect_status.data['current_work_state']
        #     await self.send_work_status(work_status=self.current_work_status)

    async def disconnect(self, code):
        self.current_work_status = statuses.disconnection_status

    async def receive(self, text_data=None, bytes_data=None):
        packet = json.loads(text_data)

        if packet["send_type"] == "start_education":
            self.current_work_status = statuses.is_studying_status
            await self.send_work_status(work_status=self.current_work_status)

        await self.send(text_data=json.dumps("OK"))
        # pass

    async def send_work_status(self, *, work_status: dict):
        await self.send(text_data=json.dumps(work_status))
