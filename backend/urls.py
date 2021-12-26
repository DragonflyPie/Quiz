from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView, RedirectView
from django.contrib.staticfiles.storage import staticfiles_storage

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include ('quiz.api.urls')),
    path('', TemplateView.as_view(template_name="index.html")) 
]
