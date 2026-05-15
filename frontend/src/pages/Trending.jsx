import { useEffect, useState } from 'react';
import api from '../api';
import StoryCard from '../components/StoryCard';

export default function Trending() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get('/stories/trending/').then(r => setStories(r.data.results || r.data));
  }, []);

  return (
    <div className="browse-page">
      <h1>Trending Stories</h1>
      <div className="story-grid">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      {stories.length === 0 && <p className="empty-state">No trending stories yet.</p>}
    </div>
  );
}
