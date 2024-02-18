from django.urls import path
from . import views

urlpatterns = [
    path('get-interface/', views.get_network_interfaces, name='get-network-interfaces')
]
