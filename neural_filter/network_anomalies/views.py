import asyncio
import itertools

from rest_framework import status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions

from file_handler.models import FileHandlerModel
from file_handler.serializers import FileHandlerSerializer
from .serializers import NetworkAnomalySerializer
from .models import NetworkAnomaliesModel

from . import consumers
from . import statuses


@api_view(["POST"])
@permission_classes((permissions.IsAuthenticatedOrReadOnly,))
def start_education(request: Request) -> Response:
    dataset_id = request.data.get("dataset_ID")

    if not dataset_id:
        return Response("Dataset_ID hasn't set or empty", status=status.HTTP_400_BAD_REQUEST)

    files_from_model = FileHandlerModel.objects.filter(group_file_id=dataset_id).values()

    all_files = []

    for file in files_from_model:
        file_serializer = FileHandlerSerializer(file)
        all_files.append(file_serializer.data["file_data"])

    flat_list = list(itertools.chain.from_iterable(all_files))

    network_serializer = NetworkAnomalySerializer
    current_network_status = NetworkAnomaliesModel.objects.all()

    # if not current_network_status:
    #     create_status = network_serializer(data=statuses.no_work_status)
    #     if create_status.is_valid():
    #         create_status.save()

    print(current_network_status)

    # network_serializer.update()

    return Response(data=f"I get dataset {dataset_id}", status=status.HTTP_200_OK)
