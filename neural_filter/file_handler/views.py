from rest_framework import status
from rest_framework.parsers import FormParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.request import Request
from .serializers import FileHandlerSerializer
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions


# Create your views here.


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
class FileHandlerView(APIView):
    parser_classes = (MultiPartParser, FormParser)
    serializer_class = FileHandlerSerializer

    def post(self, request: Request, *args, **kwargs) -> Response:
        serializer = self.serializer_class(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                serializer.data,
                status=status.HTTP_201_CREATED
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )
