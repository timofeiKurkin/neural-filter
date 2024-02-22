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
from django.conf import settings


class FileHandlerView(APIView):
    queryset = FileHandlerModel.objects.all()
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FileHandlerSerializer
    multiple_serializer_class = MultipleSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.multiple_serializer_class(data=request.data)

        if serializer.is_valid():
            # File name for saving
            uploaded_file = serializer.validated_data.get('file')

            file_list = []
            for file in uploaded_file:
                file_list.append(FileHandlerModel(file=file))
            if file_list:
                FileHandlerModel.objects.bulk_create(file_list)

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
