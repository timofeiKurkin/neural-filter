from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('all-traffic/', include('all_traffic.urls'), name='all_traffic'),
    path('user/', include('user.urls'), name='user'),
    path('education_ai/', include('education_ai.urls'), name='education_ai')
]
