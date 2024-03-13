from django.urls import path
from . import views

urlpatterns = [
    path('start_education/', views.start_education, name='start_education'),
]
