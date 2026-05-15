import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';

export default function MyStories() {
  const { user } = useAuth();
  const [stories, setStories] = useState([]);

  useEffect(() => {
    if (user) {
      api.get('/stories/', { params: { author: user.username } })
        .then(r => setStories(r.data.results || r.data));
    }
  }, [user]);

  return (
    <div className="browse-page">
      <div className="section-header">
        <h1>My Stories</h1>
        <Link to="/write" className="btn btn-primary">Write New Story</Link>
      </div>
      <div className="story-grid">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      {stories.length === 0 && (
        <div className="empty-state">
          <p>You haven't written any stories yet.</p>
          <Link to="/write" className="btn btn-primary">Start Writing</Link>
        </div>
      )}
    </div>
  );
}
