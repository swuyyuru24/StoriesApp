from rest_framework import serializers
from .models import Story, Chapter, Recommendation, ReadingList, Comment


class ChapterListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Chapter
        fields = ('id', 'title', 'chapter_number', 'reads', 'created_at', 'updated_at')


class ChapterDetailSerializer(serializers.ModelSerializer):
    comments_count = serializers.SerializerMethodField()

    class Meta:
        model = Chapter
        fields = ('id', 'story', 'title', 'content', 'chapter_number', 'reads',
                  'created_at', 'updated_at', 'comments_count')
        read_only_fields = ('id', 'story', 'chapter_number', 'reads', 'created_at', 'updated_at')

    def get_comments_count(self, obj):
        return obj.comments.count()


class StoryListSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    chapter_count = serializers.ReadOnlyField()
    reads_count = serializers.ReadOnlyField()
    recommendations_count = serializers.ReadOnlyField()

    class Meta:
        model = Story
        fields = ('id', 'title', 'description', 'author', 'author_name', 'genre',
                  'tags', 'cover', 'status', 'chapter_count', 'reads_count',
                  'recommendations_count', 'created_at', 'updated_at')
        read_only_fields = ('id', 'author', 'created_at', 'updated_at')


class StoryDetailSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source='author.username', read_only=True)
    chapters = ChapterListSerializer(many=True, read_only=True)
    chapter_count = serializers.ReadOnlyField()
    reads_count = serializers.ReadOnlyField()
    recommendations_count = serializers.ReadOnlyField()
    is_recommended = serializers.SerializerMethodField()
    in_reading_list = serializers.SerializerMethodField()

    class Meta:
        model = Story
        fields = ('id', 'title', 'description', 'author', 'author_name', 'genre',
                  'tags', 'cover', 'status', 'chapters', 'chapter_count', 'reads_count',
                  'recommendations_count', 'is_recommended', 'in_reading_list',
                  'created_at', 'updated_at')
        read_only_fields = ('id', 'author', 'created_at', 'updated_at')

    def get_is_recommended(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.recommendations.filter(user=request.user).exists()
        return False

    def get_in_reading_list(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.in_reading_lists.filter(user=request.user).exists()
        return False


class CommentSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)

    class Meta:
        model = Comment
        fields = ('id', 'user', 'username', 'chapter', 'content', 'created_at')
        read_only_fields = ('id', 'user', 'created_at')
