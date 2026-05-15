import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';
import StoryCard from '../components/StoryCard';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [trending, setTrending] = useState([]);
  const [recent, setRecent] = useState([]);

  useEffect(() => {
    api.get('/stories/trending/').then(r => setTrending(r.data.results || r.data));
    api.get('/stories/').then(r => setRecent(r.data.results || r.data));
  }, []);

  return (
    <div className="home">
      <section className="hero">
        <h1>Discover stories that move you</h1>
        <p>Read, write, and share stories with millions of readers.</p>
        <div className="hero-actions">
          <Link to="/browse" className="btn btn-primary btn-lg">Start Reading</Link>
          {!user && <Link to="/register" className="btn btn-outline btn-lg">Join Now</Link>}
          {user && <Link to="/write" className="btn btn-outline btn-lg">Start Writing</Link>}
        </div>
      </section>

      {trending.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Trending Stories</h2>
            <Link to="/trending">See all</Link>
          </div>
          <div className="story-grid">
            {trending.slice(0, 6).map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}

      {recent.length > 0 && (
        <section className="section">
          <div className="section-header">
            <h2>Recently Updated</h2>
            <Link to="/browse">See all</Link>
          </div>
          <div className="story-grid">
            {recent.slice(0, 6).map(story => (
              <StoryCard key={story.id} story={story} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
