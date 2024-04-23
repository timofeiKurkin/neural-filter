import uuid
import shutil
import os

from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework import permissions

from django.conf import settings

from .serializers import MultipleSerializer, DatasetSerializer
from .models import DatasetModel

from network_anomalies.new_neural_network.split_sessions import split_sessions

from scapy.all import PcapReader


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
            return DatasetModel.objects.get(group_file_id=pk)
        except DatasetModel.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)

    def post(self, request: Request, *args, **kwargs) -> Response:

        if len(self.all_dataset) >= 6:
            return Response(
                {"message": "You cannot have more than 6 datasets"},
                status=status.HTTP_400_BAD_REQUEST
            )

        multiple_serializer = self.multiple_serializer_class(data=request.data)

        if multiple_serializer.is_valid():
            # File name for saving
            uploaded_files = multiple_serializer.validated_data.get('file')
            dataset_title: str = multiple_serializer.validated_data.get('dataset_title')

            # UUID for dataset and files
            group_file_id = uuid.uuid4()
            dataset_directory = os.path.join(settings.MODELS_DIR, str(group_file_id))
            os.mkdir(dataset_directory)

            # Array for write all pcap data from files
            packets_from_files = []

            for file in uploaded_files:
                packages = PcapReader(file)
                packets_from_files.extend(packages)

                # List with packages into json format. And list for response
                # packages_data = []
                # file_name = file.name
                # for packet in packages:
                #     if "IP" in packet or "TCP" in packet:
                #         data = pcap_package_to_json(
                #             pcap_package=packet,
                #             package_id=self.id_packages,
                #             time_format='%.30f' % packet.time
                #         )
                #         self.id_packages += 1
                #         packages_data.append(data)

                # file_serializer = self.serializer_class(data={
                #     "file_name": file_name,
                #     "group_file_id": group_file_id,
                #     "dataset_id": dataset_serializer.instance.id
                # })

                # if file_serializer.is_valid():
                #     file_serializer.save()
                #
                #     response_data.append({
                #         "file_name": file_serializer.data["file_name"],
                #         "group_file_id": file_serializer.data["group_file_id"]
                #     })
                # else:
                #     return Response(
                #         file_serializer.errors,
                #         status=status.HTTP_400_BAD_REQUEST
                #     )

            output_directory = os.path.join(dataset_directory, "pcap-sessions")
            os.mkdir(output_directory)

            sessions_count = split_sessions(
                pcap_file=packets_from_files,
                output_directory=output_directory
            )

            dataset_serializer = self.dataset_serializer(data={
                "dataset_title": dataset_title,
                "group_file_id": group_file_id,
                "count_files": len(uploaded_files),
                "sessions_count": int(sessions_count)
            })

            if dataset_serializer.is_valid():
                dataset_serializer.save()

                return Response(
                    {
                        "dataset": {
                            "dataset_title": dataset_serializer.data["dataset_title"],
                            "group_file_id": dataset_serializer.data["group_file_id"],
                            "loss": dataset_serializer.data["loss"],
                            "val_loss": dataset_serializer.data["val_loss"],
                            "accuracy": dataset_serializer.data["accuracy"],
                            "val_accuracy": dataset_serializer.data["val_accuracy"]
                        }
                    },
                    status=status.HTTP_201_CREATED
                )

            return Response(
                dataset_serializer.errors,
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            multiple_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )

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

            return Response({"message": "delete was well"}, status=status.HTTP_204_NO_CONTENT)

        return Response({"message": "No dataset found"}, status=status.HTTP_404_NOT_FOUND)

    @staticmethod
    def get(*args, **kwargs) -> Response:
        queryset = DatasetModel.objects.all()
        datasets = []

        for dataset in queryset:
            datasets.append({
                "dataset_title": dataset.dataset_title,
                "group_file_id": dataset.group_file_id,
                "loss": dataset.loss,
                "accuracy": dataset.accuracy
            })

        return Response({"datasets": datasets}, status=status.HTTP_200_OK)
