import json

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
        pass

    async def connect(self):
        pass

    async def disconnect(self, code):
        pass

    async def receive(self, text_data=None, bytes_data=None):
        pass

