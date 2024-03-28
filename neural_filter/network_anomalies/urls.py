from django.urls import path
from .views import ModelMetricsView, ImageMetricsView

urlpatterns = [
    path('get_model_metrics/', ModelMetricsView.as_view(), name='get_model_metrics'),
    path('get_metric_image/<str:filename>/', ImageMetricsView.as_view(), name='get_metric_image'),
]
