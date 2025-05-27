import io
import os
from typing import Optional

from django.conf import settings
from django.http import FileResponse
from file_handler.models import DatasetModel
from PIL import Image
from rest_framework import permissions, status
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.views import APIView

from . import directories


class ModelMetricsView(APIView):
    queryset = DatasetModel.objects.all()
    # authentication_classes = [authentication.TokenAuthentication]
    permissions_classes = [permissions.IsAuthenticated]

    @staticmethod
    def get(request: Request) -> Response:
        dataset_id = request.query_params.get("dataset_id", None)

        if not dataset_id:
            return Response(
                data={"message": "dataset_id is empty"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        dataset_info = list(DatasetModel.objects.filter(modelID=dataset_id).values())[0]

        if dataset_info:
            image_metric = f"{directories.graph_directory}.webp"
            image_metric_path = os.path.join(
                settings.MODELS_DIR,
                dataset_id,
                directories.graph_directory,
                image_metric,
            )
            dataset_info["image_metric_exist"] = os.path.exists(image_metric_path)

            return Response(data={"metric": dataset_info}, status=status.HTTP_200_OK)

        else:
            return Response(
                data={"message": f"No find dataset with id {dataset_id}"},
                status=status.HTTP_400_BAD_REQUEST,
            )


class ImageMetricsView(APIView):
    queryset = DatasetModel.objects.all()
    permissions_classes = [permissions.AllowAny]

    @staticmethod
    def get(request: Request, dataset_id: Optional[str]):
        if not dataset_id:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        image_metric = f"{directories.graph_directory}.webp"
        image_metric_path = os.path.join(
            settings.MODELS_DIR, dataset_id, directories.graph_directory, image_metric
        )

        print(f"{image_metric_path=}")

        try:
            if os.path.exists(image_metric_path):
                image_metric_file = Image.open(image_metric_path, "r")

                image_metric_buffer = io.BytesIO()
                image_metric_file.save(image_metric_buffer, format="webp")
                image_metric_buffer.seek(0)

                return FileResponse(image_metric_buffer, content_type="image/webp")

        except Exception as e:
            print("Error:", e)
            return Response(status=status.HTTP_500_INTERNAL_SERVER_ERROR)
