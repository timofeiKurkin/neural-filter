import asyncio
import json
from channels.generic.websocket import AsyncWebsocketConsumer
from scapy.sendrecv import AsyncSniffer
from scapy.all import get_if_list


def ip_proto_convert(pkt):
    proto_field = pkt.get_field('proto')
    if pkt.proto in [6, 17]:
        return proto_field.i2s[pkt.proto].upper()
    else:
        return pkt.proto


def write_to_json(data, filename):
    try:
        with open(filename, 'w') as file:
            json.dump(data, file)
            # file.close()
            print(f"Data successfully written to {filename}")
    except Exception as e:
        print(f"Error writing to {filename}: {e}")


class PacketConsumer(AsyncWebsocketConsumer):
    def __init__(self, *args, **kwargs):
        super(PacketConsumer, self).__init__(*args, **kwargs)
        self.traffic = None
        self.packages = []
        self.id_packages = 0

    # Соединение связи с клиентом
    async def connect(self):
        await self.accept()

    # Разрыв связи с клиентом
    async def disconnect(self, close_code):
        if self.traffic:
            # print(self.packages)
            write_to_json(self.packages, 'traffic-clean.json')
            self.traffic.stop()

    def packet_callback(self, packet):
        if "IP" in packet:
            data = {
                "id": self.id_packages,
                "time": packet.time,
                "source": packet["IP"].src,
                "destination": packet["IP"].dst,
                # "protocol": ip_proto_convert(packet['IP']),
                "protocol": packet['IP'].proto,
                "length": len(packet)
            }
            self.id_packages += 1
            self.packages.append(data)
            asyncio.sleep(0.01)
            asyncio.run(self.send_packet())

    # Ответное сообщение пользователю
    async def receive(self, text_data):
        # После подключения отправляю на сервер сообщение с выбранным интерфейсом для сканирования сети
        data = json.loads(text_data)
        interface = data["interface"]
        # Этот код чинит ошибку
        # WARNING: Unable to guess datalink type (interface=Ethernet linktype=1).
        # Using <member 'name' of 'Packet' objects>
        # if_list = get_if_list()
        # print(if_list)
        if interface:
            self.traffic = AsyncSniffer(prn=self.packet_callback, iface=interface, store=0)
            await self.start_sniffing()

    async def start_sniffing(self):
        await self.send(text_data=json.dumps("Starting sniffing"))
        self.traffic.start()

    async def send_packet(self):
        if len(self.packages) > 0 and self.traffic:
            await self.send(text_data=json.dumps(self.packages[-1]))
            # self.packages = []
