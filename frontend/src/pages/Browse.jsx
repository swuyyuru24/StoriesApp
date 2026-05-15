import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../api';
import StoryCard from '../components/StoryCard';

const GENRES = [
  { value: '', label: 'All Genres' },
  { value: 'fantasy', label: 'Fantasy' },
  { value: 'romance', label: 'Romance' },
  { value: 'scifi', label: 'Science Fiction' },
  { value: 'mystery', label: 'Mystery' },
  { value: 'thriller', label: 'Thriller' },
  { value: 'horror', label: 'Horror' },
  { value: 'adventure', label: 'Adventure' },
  { value: 'humor', label: 'Humor' },
  { value: 'drama', label: 'Drama' },
  { value: 'poetry', label: 'Poetry' },
  { value: 'nonfiction', label: 'Non-Fiction' },
  { value: 'fanfiction', label: 'Fan Fiction' },
  { value: 'other', label: 'Other' },
];

export default function Browse() {
  const [stories, setStories] = useState([]);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const genre = searchParams.get('genre') || '';

  useEffect(() => {
    const params = {};
    if (genre) params.genre = genre;
    const q = searchParams.get('search');
    if (q) params.search = q;
    api.get('/stories/', { params }).then(r => setStories(r.data.results || r.data));
  }, [searchParams, genre]);

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) params.set('search', search);
    else params.delete('search');
    setSearchParams(params);
  };

  const setGenre = (g) => {
    const params = new URLSearchParams(searchParams);
    if (g) params.set('genre', g);
    else params.delete('genre');
    setSearchParams(params);
  };

  return (
    <div className="browse-page">
      <h1>Browse Stories</h1>
      <form onSubmit={handleSearch} className="search-bar">
        <input
          type="text"
          placeholder="Search stories..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button type="submit" className="btn btn-primary">Search</button>
      </form>
      <div className="genre-tags">
        {GENRES.map(g => (
          <button
            key={g.value}
            className={`genre-tag ${genre === g.value ? 'active' : ''}`}
            onClick={() => setGenre(g.value)}
          >
            {g.label}
          </button>
        ))}
      </div>
      <div className="story-grid">
        {stories.map(story => (
          <StoryCard key={story.id} story={story} />
        ))}
      </div>
      {stories.length === 0 && <p className="empty-state">No stories found.</p>}
    </div>
  );
}
