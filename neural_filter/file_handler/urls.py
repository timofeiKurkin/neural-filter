from django.urls import path
from .views import FileHandlerView

urlpatterns = [
    path('upload_files/', FileHandlerView.as_view(), name='upload-files')
]
