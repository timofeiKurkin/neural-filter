from django.conf.urls.static import static
from django.conf import settings
from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('all-traffic/', include('all_traffic.urls'), name='all_traffic'),
    path('user/', include('user.urls'), name='user'),

    # Убрать загрузку фалов в обучении. Удалить приложение
    path('education_ai/', include('education_ai.urls'), name='education_ai'),

    path('file_handler/', include('file_handler.urls'), name='file_handler'),
]

# urlpatterns += static(settings.PACKETS_URL, document_root=settings.PACKETS_ROOT)
