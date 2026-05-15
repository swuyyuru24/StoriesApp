from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from . import views

urlpatterns = [
    path('register/', views.RegisterView.as_view(), name='register'),
    path('login/', TokenObtainPairView.as_view(), name='login'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', views.MeView.as_view(), name='me'),
    path('users/<str:username>/', views.UserProfileView.as_view(), name='user_profile'),
    path('users/<str:username>/follow/', views.follow_user, name='follow_user'),
    path('users/<str:username>/unfollow/', views.unfollow_user, name='unfollow_user'),
]
