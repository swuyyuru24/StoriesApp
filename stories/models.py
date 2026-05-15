from django.db import models
from django.conf import settings


class Story(models.Model):
    GENRE_CHOICES = [
        ('fantasy', 'Fantasy'),
        ('romance', 'Romance'),
        ('scifi', 'Science Fiction'),
        ('mystery', 'Mystery'),
        ('thriller', 'Thriller'),
        ('horror', 'Horror'),
        ('adventure', 'Adventure'),
        ('humor', 'Humor'),
        ('drama', 'Drama'),
        ('poetry', 'Poetry'),
        ('nonfiction', 'Non-Fiction'),
        ('fanfiction', 'Fan Fiction'),
        ('other', 'Other'),
    ]
    STATUS_CHOICES = [
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
    ]

    title = models.CharField(max_length=200)
    description = models.TextField()
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='stories')
    genre = models.CharField(max_length=20, choices=GENRE_CHOICES, default='other')
    tags = models.CharField(max_length=500, blank=True, default='')
    cover = models.ImageField(upload_to='covers/', blank=True, null=True)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='ongoing')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-updated_at']
        verbose_name_plural = 'stories'

    def __str__(self):
        return self.title

    @property
    def reads_count(self):
        return sum(ch.reads for ch in self.chapters.all())

    @property
    def recommendations_count(self):
        return self.recommendations.count()

    @property
    def chapter_count(self):
        return self.chapters.count()


class Chapter(models.Model):
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='chapters')
    title = models.CharField(max_length=200)
    content = models.TextField()
    chapter_number = models.PositiveIntegerField()
    reads = models.PositiveIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['chapter_number']
        unique_together = ('story', 'chapter_number')

    def __str__(self):
        return f'{self.story.title} - Ch.{self.chapter_number}: {self.title}'


class Recommendation(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='recommendations')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='recommendations')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'story')

    def __str__(self):
        return f'{self.user} recommends {self.story}'


class ReadingList(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reading_list')
    story = models.ForeignKey(Story, on_delete=models.CASCADE, related_name='in_reading_lists')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'story')

    def __str__(self):
        return f'{self.user} saved {self.story}'


class Comment(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='comments')
    chapter = models.ForeignKey(Chapter, on_delete=models.CASCADE, related_name='comments')
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f'{self.user} on {self.chapter}: {self.content[:50]}'
