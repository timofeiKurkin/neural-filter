from django.urls import re_path
from . import consumers

network_anomalies_websocket_urlpatterns = [
    re_path(r'ws/network_anomalies/$', consumers.NetworkAnomalyConsumer.as_asgi()),
    re_path(r'ws/get_network_status/$', consumers.NeuralNetworkStatusConsumer.as_asgi())
]
