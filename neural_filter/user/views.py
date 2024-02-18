from django.http import JsonResponse
from django.middleware.csrf import get_token

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions

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
@permission_classes((permissions.IsAuthenticatedOrReadOnly,))
def get_csrf(request: Request) -> JsonResponse:
    csrf_token = get_token(request)
    response = JsonResponse({"csrftoken": csrf_token})
    response.set_cookie("csrftoken", csrf_token)
    return response


@api_view(["POST"])
@permission_classes((permissions.IsAuthenticated,))
def change_password(request: Request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        return user
