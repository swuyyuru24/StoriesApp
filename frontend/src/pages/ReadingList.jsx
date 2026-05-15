import { useEffect, useState } from 'react';
import api from '../api';
import StoryCard from '../components/StoryCard';

export default function ReadingList() {
  const [stories, setStories] = useState([]);

  useEffect(() => {
    api.get('/stories/reading-list/').then(r => setStories(r.data.results || r.data));
  }, []);

  return (
    <div className="browse-page">
      <h1>My Reading List</h1>
      <div className="story-grid">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      {stories.length === 0 && <p className="empty-state">Your reading list is empty. Browse stories to add some!</p>}
    </div>
  );
}
