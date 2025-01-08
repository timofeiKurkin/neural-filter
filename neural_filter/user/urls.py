from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView

from . import views
from .serializers import MyTokenObtainPairView
from .views import ChangePasswordView

urlpatterns = [
    path("", views.get_routers, name="get_routers"),
    path("health-check/", views.health_check, name=""),
    path("token/", MyTokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("change-password/", ChangePasswordView.as_view(), name="change_password"),
    path("get-csrf-token/", views.get_csrf, name="get_token"),
]

# http://localhost:8010/user/change-password/
