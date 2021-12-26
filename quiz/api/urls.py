from django.urls import path
from . import views
from .views import MyTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenRefreshView,
)

urlpatterns = [
    path('', views.getRoutes),
    path('game_questions/', views.getGameQuestions, name='game'),
    path('my_questions/', views.getMyQuestions, name="my_questions"),
    path('results/', views.getGameResults, name="results"),
    path('create/', views.createQuestion, name="create"),
    path('rankings/', views.getRankings, name="rankings"),
    path('profile/<int:id>', views.getProfile, name="profile"),
    path('token/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', views.registerUser, name='register'),
]
