from rest_framework import generics, permissions, status, filters
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.db.models import Count, Sum, Q
from .models import Story, Chapter, Recommendation, ReadingList, Comment
from .serializers import (
    StoryListSerializer, StoryDetailSerializer,
    ChapterDetailSerializer, CommentSerializer,
)


class IsAuthorOrReadOnly(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.author == request.user


class StoryListCreateView(generics.ListCreateAPIView):
    serializer_class = StoryListSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description', 'tags']
    ordering_fields = ['created_at', 'updated_at']

    def get_queryset(self):
        qs = Story.objects.select_related('author')
        genre = self.request.query_params.get('genre')
        if genre:
            qs = qs.filter(genre=genre)
        status_filter = self.request.query_params.get('status')
        if status_filter:
            qs = qs.filter(status=status_filter)
        author = self.request.query_params.get('author')
        if author:
            qs = qs.filter(author__username=author)
        return qs

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class StoryDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Story.objects.select_related('author').prefetch_related('chapters')
    serializer_class = StoryDetailSerializer
    permission_classes = [IsAuthorOrReadOnly]


class ChapterCreateView(generics.CreateAPIView):
    serializer_class = ChapterDetailSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        story = Story.objects.get(pk=self.kwargs['story_id'])
        if story.author != self.request.user:
            from rest_framework.exceptions import PermissionDenied
            raise PermissionDenied('Only the author can add chapters.')
        next_num = (story.chapters.count()) + 1
        serializer.save(story=story, chapter_number=next_num)


class ChapterDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ChapterDetailSerializer

    def get_queryset(self):
        return Chapter.objects.filter(story_id=self.kwargs['story_id'])

    def get_permissions(self):
        if self.request.method in permissions.SAFE_METHODS:
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        Chapter.objects.filter(pk=instance.pk).update(reads=instance.reads + 1)
        instance.refresh_from_db()
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def check_object_permissions(self, request, obj):
        super().check_object_permissions(request, obj)
        if request.method not in permissions.SAFE_METHODS and obj.story.author != request.user:
            self.permission_denied(request)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def recommend_story(request, pk):
    try:
        story = Story.objects.get(pk=pk)
    except Story.DoesNotExist:
        return Response({'error': 'Story not found'}, status=status.HTTP_404_NOT_FOUND)

    _, created = Recommendation.objects.get_or_create(user=request.user, story=story)
    if created:
        return Response({'status': 'recommended'})
    return Response({'status': 'already recommended'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def unrecommend_story(request, pk):
    deleted, _ = Recommendation.objects.filter(user=request.user, story_id=pk).delete()
    if deleted:
        return Response({'status': 'unrecommended'})
    return Response({'status': 'was not recommended'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def add_to_reading_list(request, pk):
    try:
        story = Story.objects.get(pk=pk)
    except Story.DoesNotExist:
        return Response({'error': 'Story not found'}, status=status.HTTP_404_NOT_FOUND)

    _, created = ReadingList.objects.get_or_create(user=request.user, story=story)
    if created:
        return Response({'status': 'added'})
    return Response({'status': 'already in reading list'})


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def remove_from_reading_list(request, pk):
    deleted, _ = ReadingList.objects.filter(user=request.user, story_id=pk).delete()
    if deleted:
        return Response({'status': 'removed'})
    return Response({'status': 'was not in reading list'})


class ReadingListView(generics.ListAPIView):
    serializer_class = StoryListSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Story.objects.filter(
            in_reading_lists__user=self.request.user
        ).select_related('author')


class CommentListCreateView(generics.ListCreateAPIView):
    serializer_class = CommentSerializer

    def get_queryset(self):
        return Comment.objects.filter(
            chapter_id=self.kwargs['chapter_id'],
            chapter__story_id=self.kwargs['story_id'],
        ).select_related('user')

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        chapter = Chapter.objects.get(
            pk=self.kwargs['chapter_id'],
            story_id=self.kwargs['story_id'],
        )
        serializer.save(user=self.request.user, chapter=chapter)


class TrendingStoriesView(generics.ListAPIView):
    serializer_class = StoryListSerializer
    permission_classes = [permissions.AllowAny]

    def get_queryset(self):
        return Story.objects.select_related('author').annotate(
            total_recs=Count('recommendations')
        ).order_by('-total_recs')[:20]
