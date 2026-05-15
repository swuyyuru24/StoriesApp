import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';

export default function NewChapter() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await api.post(`/stories/${id}/chapters/`, { title, content });
      navigate(`/story/${id}`);
    } catch {
      setError('Failed to add chapter.');
    }
  };

  return (
    <div className="write-page">
      <h1>Add New Chapter</h1>
      <form onSubmit={handleSubmit} className="write-form">
        {error && <div className="error-msg">{error}</div>}
        <label>Chapter Title</label>
        <input type="text" value={title} onChange={e => setTitle(e.target.value)} required placeholder="Chapter title" />
        <label>Content</label>
        <textarea
          value={content}
          onChange={e => setContent(e.target.value)}
          required
          rows={20}
          placeholder="Write your chapter here..."
          className="chapter-editor"
        />
        <button type="submit" className="btn btn-primary">Publish Chapter</button>
      </form>
    </div>
  );
}
