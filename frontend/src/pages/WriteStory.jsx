import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const GENRES = [
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

export default function WriteStory() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', genre: 'fantasy', tags: '', status: 'ongoing',
  });
  const [error, setError] = useState('');

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const { data } = await api.post('/stories/', form);
      navigate(`/story/${data.id}`);
    } catch (err) {
      setError('Failed to create story. Make sure all fields are filled in.');
    }
  };

  return (
    <div className="write-page">
      <h1>Create a New Story</h1>
      <form onSubmit={handleSubmit} className="write-form">
        {error && <div className="error-msg">{error}</div>}
        <label>Title</label>
        <input type="text" value={form.title} onChange={update('title')} required placeholder="Your story title" />

        <label>Description</label>
        <textarea value={form.description} onChange={update('description')} required rows={4} placeholder="What's your story about?" />

        <label>Genre</label>
        <select value={form.genre} onChange={update('genre')}>
          {GENRES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>

        <label>Tags (comma-separated)</label>
        <input type="text" value={form.tags} onChange={update('tags')} placeholder="e.g. magic, coming-of-age, dragons" />

        <label>Status</label>
        <select value={form.status} onChange={update('status')}>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>

        <button type="submit" className="btn btn-primary">Create Story</button>
      </form>
    </div>
  );
}
