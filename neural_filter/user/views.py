from django.http import JsonResponse
from django.middleware.csrf import get_token
from django.contrib.auth.models import User

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.generics import UpdateAPIView
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions, status

from .serializers import ChangePasswordSerializer


@api_view(["GET"])
@permission_classes((permissions.IsAuthenticatedOrReadOnly,))
def get_routers(request: Request) -> Response:
    routes = [
        "/user/token",
        "/user/refresh",
        "/user/login",
        "/user/logout",
    ]
    return Response(routes)


@api_view(["GET"])
@permission_classes((permissions.AllowAny,))
def get_csrf(request: Request) -> JsonResponse:
    csrf_token = get_token(request)
    response = JsonResponse({"csrftoken": csrf_token})
    response.set_cookie("csrftoken", csrf_token)
    return response


class ChangePasswordView(UpdateAPIView):
    queryset = User.objects.all()
    serializer_class = ChangePasswordSerializer
    permissions_classes = [permissions.IsAuthenticated]

    def update(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({"success": True}, status=status.HTTP_200_OK)


@api_view(["POST"])
@permission_classes((permissions.IsAuthenticated,))
def change_password(request: Request) -> Response:
    print(f"{request.data}")
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        print(f"{serializer.validated_data}")
        # user = request.user
        # print(f"{user=}")

    return Response(request.data)
    # serializer = ChangePasswordSerializer(data=request.data)
    # if serializer.is_valid():
    #     user = request.user
    #     return user
