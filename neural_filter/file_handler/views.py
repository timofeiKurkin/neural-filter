import json
import os.path
import uuid

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request
from .serializers import FileHandlerSerializer, MultipleSerializer, DatasetSerializer
from .models import FileHandlerModel, DatasetModel
from rest_framework import permissions
from scapy.all import PcapReader


class FileHandlerView(APIView):
    queryset = FileHandlerModel.objects.all()

    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FileHandlerSerializer
    dataset_serializer = DatasetSerializer

    multiple_serializer_class = MultipleSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def __init__(self):
        super().__init__()
        self.id_packages = 0

    def post(self, request: Request, *args, **kwargs) -> Response:
        multiple_serializer = self.multiple_serializer_class(data=request.data)

        if multiple_serializer.is_valid():

            # File name for saving
            uploaded_file = multiple_serializer.validated_data.get('file')
            dataset_title: str = multiple_serializer.validated_data.get('dataset_title')

            print(len(uploaded_file))
            print(f"{dataset_title:$}")

            # UUID for dataset and files
            group_file_id = uuid.uuid4()

            dataset_serializer = self.dataset_serializer(data={
                "dataset_title": dataset_title,
                "group_file_id": group_file_id,
                "count_files": len(uploaded_file),
                "loss": 0,
                "accuracy": 0
            })

            if dataset_serializer.is_valid():
                dataset_serializer.save()

                print(dataset_serializer)

                # List with packages into json format
                packages_data = []

                response_data = []

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

                    file_serializer = self.serializer_class(data={
                        "file_data": packages_data,
                        "file_name": file_name,
                        "group_file_id": group_file_id,
                        "dataset": dataset_serializer.instance.id
                    })

                    if file_serializer.is_valid():
                        file_serializer.save()
                        response_data.append({
                            "file_name": file_serializer.data["file_name"],
                            "group_file_id": file_serializer.data["group_file_id"]
                        })

                    else:
                        return Response(
                            file_serializer.errors,
                            status=status.HTTP_400_BAD_REQUEST
                        )

                return Response(
                    response_data,
                    status=status.HTTP_201_CREATED
                )

            else:
                return Response(
                    dataset_serializer.errors,
                    status=status.HTTP_400_BAD_REQUEST
                )

        return Response(
            multiple_serializer.errors,
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
