from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('all-traffic/', include('all_traffic.urls'), name='all_traffic'),
    path('user/', include('user.urls'), name='user'),

    path('file_handler/', include('file_handler.urls'), name='file_handler'),
]

# urlpatterns += static(settings.PACKETS_URL, document_root=settings.PACKETS_ROOT)
