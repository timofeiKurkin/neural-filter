import psutil

from django.http import JsonResponse

from rest_framework.response import Response
from rest_framework.request import Request
from rest_framework.decorators import api_view, permission_classes
from rest_framework import permissions


@api_view(['GET'])
@permission_classes((permissions.IsAuthenticatedOrReadOnly,))
def index(request: Request) -> Response:
    return Response("This is the all-traffic page")


# Представление для получения доступных интерфейсов сети
@api_view(['GET'])
@permission_classes((permissions.IsAuthenticatedOrReadOnly,))
def get_network_interfaces(request: Request) -> JsonResponse:
    all_interfaces = psutil.net_if_stats().keys()
    eth_interfaces = [interface for interface in all_interfaces]  # if interface.startswith('Ethernet')
    result_interfaces = [{"id": i, "title": interface} for i, interface in enumerate(eth_interfaces)]
    return JsonResponse({'network_interfaces': result_interfaces})
