import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function StoryDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [story, setStory] = useState(null);

  useEffect(() => {
    api.get(`/stories/${id}/`).then(r => setStory(r.data));
  }, [id]);

  if (!story) return <div className="loading">Loading...</div>;

  const isAuthor = user && user.id === story.author;

  const handleRecommend = async () => {
    if (story.is_recommended) {
      await api.post(`/stories/${id}/unrecommend/`);
    } else {
      await api.post(`/stories/${id}/recommend/`);
    }
    const { data } = await api.get(`/stories/${id}/`);
    setStory(data);
  };

  const handleReadingList = async () => {
    if (story.in_reading_list) {
      await api.post(`/stories/${id}/remove-from-list/`);
    } else {
      await api.post(`/stories/${id}/add-to-list/`);
    }
    const { data } = await api.get(`/stories/${id}/`);
    setStory(data);
  };

  const handleDelete = async () => {
    if (window.confirm('Delete this story? This cannot be undone.')) {
      await api.delete(`/stories/${id}/`);
      navigate('/my-stories');
    }
  };

  return (
    <div className="story-detail">
      <div className="story-header">
        <div className="story-cover-large">
          {story.cover ? (
            <img src={story.cover} alt={story.title} />
          ) : (
            <div className="story-card-placeholder large">
              <span>{story.title[0]}</span>
            </div>
          )}
        </div>
        <div className="story-info">
          <h1>{story.title}</h1>
          <Link to={`/user/${story.author_name}`} className="story-author">
            by {story.author_name}
          </Link>
          <p className="story-description">{story.description}</p>
          <div className="story-meta">
            <span className="story-card-genre">{story.genre}</span>
            <span>{story.status}</span>
            <span>{story.chapter_count} chapters</span>
            <span>{story.reads_count} reads</span>
            <span>{story.recommendations_count} recommendations</span>
          </div>
          {story.tags && (
            <div className="story-tags">
              {story.tags.split(',').map(t => t.trim()).filter(Boolean).map(tag => (
                <span key={tag} className="tag">{tag}</span>
              ))}
            </div>
          )}
          <div className="story-actions">
            {story.chapters?.length > 0 && (
              <Link to={`/story/${id}/chapter/${story.chapters[0].id}`} className="btn btn-primary">
                Start Reading
              </Link>
            )}
            {user && !isAuthor && (
              <>
                <button onClick={handleRecommend} className={`btn ${story.is_recommended ? 'btn-active' : 'btn-outline'}`}>
                  {story.is_recommended ? 'Recommended' : 'Recommend'}
                </button>
                <button onClick={handleReadingList} className={`btn ${story.in_reading_list ? 'btn-active' : 'btn-outline'}`}>
                  {story.in_reading_list ? 'In Reading List' : 'Add to List'}
                </button>
              </>
            )}
            {isAuthor && (
              <>
                <Link to={`/story/${id}/edit`} className="btn btn-outline">Edit Story</Link>
                <Link to={`/story/${id}/new-chapter`} className="btn btn-outline">Add Chapter</Link>
                <button onClick={handleDelete} className="btn btn-danger">Delete</button>
              </>
            )}
          </div>
        </div>
      </div>

      <section className="chapters-list">
        <h2>Chapters</h2>
        {story.chapters?.length === 0 && <p className="empty-state">No chapters yet.</p>}
        {story.chapters?.map(ch => (
          <Link key={ch.id} to={`/story/${id}/chapter/${ch.id}`} className="chapter-item">
            <span className="chapter-num">Ch. {ch.chapter_number}</span>
            <span className="chapter-title">{ch.title}</span>
            <span className="chapter-reads">{ch.reads} reads</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
