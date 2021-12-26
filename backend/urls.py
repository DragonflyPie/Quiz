from django.contrib import admin
from django.urls import path, include
from django.views.generic import TemplateView


urlpatterns = [
    path('admin/', admin.site.urls),
    # redirect all api/ calls to urls.py in api folder
    path('api/', include ('quiz.api.urls')),
    path('', TemplateView.as_view(template_name="index.html")) 
]
