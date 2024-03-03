import json
import os.path
import uuid

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request
from .serializers import FileHandlerSerializer, MultipleSerializer
from .models import FileHandlerModel, DatasetModel
from rest_framework import permissions
from scapy.all import PcapReader


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
            dataset_title = serializer.validated_data.get('dataset_title')

            # File list where each file into FileHandlerModel structure
            file_list = []

            # List with packages into json format
            packages_data = []

            # UUID for dataset and files
            group_file_id = uuid.uuid4()

            # Dataset Model
            dataset_model = DatasetModel(dataset_title=dataset_title, group_file_id=group_file_id)

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
                            "protocol": packet['IP'].proto,
                            "length": len(packet)
                        }
                        self.id_packages += 1
                        packages_data.append(data)

                file_list.append(FileHandlerModel(
                    file_data=packages_data,
                    file_name=file_name,
                    group_file_id=group_file_id,
                    dataset=dataset_model
                ))

                # Try to use serializer right
                serializer_model = FileHandlerModel(
                    file_data=packages_data,
                    file_name=file_name,
                    group_file_id=group_file_id,
                    dataset=dataset_model
                )
                result = FileHandlerSerializer(serializer_model)
                print(result.data)

            if file_list:
                print('ok')
                # dataset_model.save()
                # FileHandlerModel.objects.bulk_create(file_list)

            return Response(
                'ok',
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

    @staticmethod
    def get(*args, **kwargs) -> Response:
        queryset = DatasetModel.objects.all()
        print(queryset)

        datasets = []

        for dataset in queryset:
            datasets.append({
                "dataset_title": dataset.dataset_title,
                "group_file_id": dataset.group_file_id
            })

        return Response({"datasets": datasets}, status=status.HTTP_200_OK)
