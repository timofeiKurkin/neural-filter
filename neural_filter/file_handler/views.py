import os.path
import uuid

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request
from .serializers import FileHandlerSerializer, MultipleSerializer
from .models import FileHandlerModel
from rest_framework import permissions
from scapy.sendrecv import PcapReader
from django.conf import settings


class FileHandlerView(APIView):
    queryset = FileHandlerModel.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FileHandlerSerializer
    multiple_serializer_class = MultipleSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def __init__(self):
        super().__init__()
        self.id_packages = 0

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.multiple_serializer_class(data=request.data)

        if serializer.is_valid():
            # File name for saving
            uploaded_file = serializer.validated_data.get('file')

            file_list = []
            packages_data = []

            for file in uploaded_file:
                packages = PcapReader(file)
                file_name = file.name

                for packet in packages:
                    if "IP" in packet:
                        data = {
                            "id": self.id_packages,
                            "time": '%.30f' % packet.time,
                            "source": packet["IP"].src,
                            "destination": packet["IP"].dst,
                            # "protocol": ip_proto_convert(packet['IP']),
                            "protocol": packet['IP'].proto,
                            "length": len(packet)
                        }
                        self.id_packages += 1
                        packages_data.append(data)

                file_list.append(FileHandlerModel(file=file, file_json=packages_data, file_name=file_name))
            if file_list:
                FileHandlerModel.objects.bulk_create(file_list)

            # print(packages_data)

            # for file_in_uploaded in uploaded_file:
            #     upload_path = os.path.join(settings.PACKETS_ROOT, file_in_uploaded.name)
            #
            #     with open(upload_path, "wb") as file:
            #         for chunk in file_in_uploaded.chunks():
            #             file.write(chunk)

            # serializer.save()

            return Response(
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @staticmethod
    def get(request: Request, *args, **kwargs) -> Response:
        file_object = {"files": list}
        return Response(file_object, status=status.HTTP_200_OK)
