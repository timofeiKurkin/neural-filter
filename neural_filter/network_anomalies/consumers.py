import json
import time
import asyncio

from scapy.all import AsyncSniffer
from channels.generic.websocket import AsyncWebsocketConsumer

disconnection_status = {"status": "disconnection", "statusCode": 0}
connection_status = {"status": "connection", "statusCode": 1}
no_work_status = {"status": "no work", "statusCode": 2}
is_studying_status = {"status": "is_studying", "statusCode": 3}
working_status = {"status": "working", "statusCode": 4}


class NeuralNetworkStatusConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.current_work_status = no_work_status

    async def connect(self):
        await self.accept()
        await self.send_work_status(work_status=self.current_work_status)

    async def disconnect(self, code):
        pass

    # async def receive(self, text_data=None, bytes_data=None):
    #     pass

    async def send_work_status(self, *, work_status: dict):
        await self.send(text_data=json.dumps(work_status))


class NetworkAnomalyConsumer(AsyncWebsocketConsumer):

    def __init__(self, *args, **kwargs):
        super(NetworkAnomalyConsumer).__init__(*args, **kwargs)
        self.current_work_status = no_work_status
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
