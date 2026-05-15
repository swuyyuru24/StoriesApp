from django.urls import path
from . import views

urlpatterns = [
    path('', views.StoryListCreateView.as_view(), name='story_list'),
    path('trending/', views.TrendingStoriesView.as_view(), name='trending'),
    path('reading-list/', views.ReadingListView.as_view(), name='reading_list'),
    path('<int:pk>/', views.StoryDetailView.as_view(), name='story_detail'),
    path('<int:pk>/recommend/', views.recommend_story, name='recommend'),
    path('<int:pk>/unrecommend/', views.unrecommend_story, name='unrecommend'),
    path('<int:pk>/add-to-list/', views.add_to_reading_list, name='add_to_list'),
    path('<int:pk>/remove-from-list/', views.remove_from_reading_list, name='remove_from_list'),
    path('<int:story_id>/chapters/', views.ChapterCreateView.as_view(), name='chapter_create'),
    path('<int:story_id>/chapters/<int:pk>/', views.ChapterDetailView.as_view(), name='chapter_detail'),
    path('<int:story_id>/chapters/<int:chapter_id>/comments/', views.CommentListCreateView.as_view(), name='comments'),
]
