import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
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

export default function EditStory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/stories/${id}/`).then(r => {
      const { title, description, genre, tags, status } = r.data;
      setForm({ title, description, genre, tags, status });
    });
  }, [id]);

  if (!form) return <div className="loading">Loading...</div>;

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.patch(`/stories/${id}/`, form);
      navigate(`/story/${id}`);
    } catch {
      setError('Failed to update story.');
    }
  };

  return (
    <div className="write-page">
      <h1>Edit Story</h1>
      <form onSubmit={handleSubmit} className="write-form">
        {error && <div className="error-msg">{error}</div>}
        <label>Title</label>
        <input type="text" value={form.title} onChange={update('title')} required />
        <label>Description</label>
        <textarea value={form.description} onChange={update('description')} required rows={4} />
        <label>Genre</label>
        <select value={form.genre} onChange={update('genre')}>
          {GENRES.map(g => <option key={g.value} value={g.value}>{g.label}</option>)}
        </select>
        <label>Tags (comma-separated)</label>
        <input type="text" value={form.tags} onChange={update('tags')} />
        <label>Status</label>
        <select value={form.status} onChange={update('status')}>
          <option value="ongoing">Ongoing</option>
          <option value="completed">Completed</option>
        </select>
        <button type="submit" className="btn btn-primary">Save Changes</button>
      </form>
    </div>
  );
}
