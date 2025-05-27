import os
import shutil
import uuid

import network_anomalies.directories as directories
from django.conf import settings
from network_anomalies.neural_network.split_sessions import split_sessions
from rest_framework import permissions, status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView
from scapy.all import PcapReader

from .models import DatasetModel
from .serializers import DatasetSerializer, MultipleSerializer


class FileHandlerView(APIView):
    queryset = DatasetModel.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    # authentication_classes = [authentication.TokenAuthentication]
    permissions_classes = [permissions.IsAuthenticated]

    def __init__(self):
        super().__init__()
        self.id_packages = 0
        self.multiple_serializer_class = MultipleSerializer
        self.dataset_serializer = DatasetSerializer
        # self.serializer_class = FileHandlerSerializer
        self.all_dataset = DatasetModel.objects.all()

    # Method for get dataset by group_file_id
    @staticmethod
    def get_dataset(*, pk):
        try:
            return DatasetModel.objects.get(modelID=pk)
        except DatasetModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request: Request, *args, **kwargs) -> Response:

        if len(self.all_dataset) >= 6:
            return Response(
                {"message": "You cannot have more than 6 datasets"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        multiple_serializer = self.multiple_serializer_class(data=request.data)

        if not os.path.exists(settings.MODELS_DIR):
            os.makedirs(settings.MODELS_DIR)

        if multiple_serializer.is_valid():
            # File name for saving
            uploaded_files = multiple_serializer.validated_data.get("file")
            dataset_title: str = multiple_serializer.validated_data.get("dataset_title")

            # UUID for dataset and files
            modelID = uuid.uuid4()
            model_directory = os.path.join(settings.MODELS_DIR, str(modelID))
            os.mkdir(model_directory)

            sessions_directory = os.path.join(
                model_directory, directories.sessions_directory
            )
            os.mkdir(sessions_directory)

            directories_to_create = [
                directories.dataset_directory,
                directories.model_directory,
                directories.helpful_directory,
                directories.graph_directory,
            ]

            for directory_name in directories_to_create:
                directory_path = os.path.join(model_directory, directory_name)
                os.mkdir(directory_path)

            # Array for write all pcap data from files
            packets_from_files = []

            for file in uploaded_files:
                packages: PcapReader = PcapReader(file)
                packets_from_files.extend(packages)
                del packages

            sessions_count = split_sessions(
                pcap_files=packets_from_files, output_directory=sessions_directory
            )

            dataset_serializer = self.dataset_serializer(
                data={
                    "dataset_title": dataset_title,
                    "modelID": modelID,
                    "count_files": len(uploaded_files),
                    "sessions_count": int(sessions_count),
                }
            )

            if dataset_serializer.is_valid():
                dataset_serializer.save()

                del packets_from_files
                del sessions_count

                return Response(
                    {
                        "dataset": {
                            "dataset_title": dataset_serializer.data["dataset_title"],
                            "modelID": dataset_serializer.data["modelID"],
                            "sessions_count": dataset_serializer.data["sessions_count"],
                            "loss": dataset_serializer.data["loss"],
                            # "val_loss": dataset_serializer.data["val_loss"],
                            # "accuracy": dataset_serializer.data["accuracy"],
                            # "val_accuracy": dataset_serializer.data["val_accuracy"]
                        }
                    },
                    status=status.HTTP_201_CREATED,
                )

            return Response(
                dataset_serializer.errors, status=status.HTTP_400_BAD_REQUEST
            )

        return Response(multiple_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # @staticmethod
    def delete(self, request: Request, pk) -> Response:
        dataset = self.get_dataset(pk=pk)

        if dataset is not Response:
            dataset.delete()

            try:
                delete_directory = os.path.join(settings.MODELS_DIR, str(pk))
                shutil.rmtree(delete_directory)
                print(f"Directory {delete_directory} removed successfully")
            except OSError as e:
                print(f"Error: {e.strerror}")

            return Response(
                {"message": "delete was well"}, status=status.HTTP_204_NO_CONTENT
            )

        return Response(
            {"message": "No dataset found"}, status=status.HTTP_404_NOT_FOUND
        )

    @staticmethod
    def get(*args, **kwargs) -> Response:
        queryset = DatasetModel.objects.all()
        datasets = []

        for dataset in queryset:
            datasets.append(
                {
                    "dataset_title": dataset.dataset_title,
                    "modelID": dataset.modelID,
                    "loss": dataset.loss,
                    "sessions_count": dataset.sessions_count,
                }
            )

        return Response({"datasets": datasets}, status=status.HTTP_200_OK)
