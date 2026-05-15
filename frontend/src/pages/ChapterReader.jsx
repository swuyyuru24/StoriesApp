import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';

export default function ChapterReader() {
  const { id, chapterId } = useParams();
  const { user } = useAuth();
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

  useEffect(() => {
    api.get(`/stories/${id}/chapters/${chapterId}/`).then(r => setChapter(r.data));
    api.get(`/stories/${id}/`).then(r => setChapters(r.data.chapters || []));
    api.get(`/stories/${id}/chapters/${chapterId}/comments/`).then(r => setComments(r.data.results || r.data));
  }, [id, chapterId]);

  if (!chapter) return <div className="loading">Loading...</div>;

  const currentIdx = chapters.findIndex(c => c.id === parseInt(chapterId));
  const prev = currentIdx > 0 ? chapters[currentIdx - 1] : null;
  const next = currentIdx < chapters.length - 1 ? chapters[currentIdx + 1] : null;

  const handleComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    await api.post(`/stories/${id}/chapters/${chapterId}/comments/`, { content: commentText });
    setCommentText('');
    const { data } = await api.get(`/stories/${id}/chapters/${chapterId}/comments/`);
    setComments(data.results || data);
  };

  return (
    <div className="reader">
      <div className="reader-header">
        <Link to={`/story/${id}`} className="back-link">Back to story</Link>
        <h1>{chapter.title}</h1>
        <span className="chapter-label">Chapter {chapter.chapter_number}</span>
      </div>

      <article className="reader-content">
        {chapter.content.split('\n').map((p, i) => (
          p.trim() ? <p key={i}>{p}</p> : <br key={i} />
        ))}
      </article>

      <div className="reader-nav">
        {prev ? (
          <Link to={`/story/${id}/chapter/${prev.id}`} className="btn btn-outline">Previous Chapter</Link>
        ) : <span />}
        {next ? (
          <Link to={`/story/${id}/chapter/${next.id}`} className="btn btn-primary">Next Chapter</Link>
        ) : (
          <span className="end-msg">You've reached the end!</span>
        )}
      </div>

      <section className="comments-section">
        <h3>Comments ({comments.length})</h3>
        {user && (
          <form onSubmit={handleComment} className="comment-form">
            <textarea
              placeholder="Share your thoughts..."
              value={commentText}
              onChange={e => setCommentText(e.target.value)}
              rows={3}
            />
            <button type="submit" className="btn btn-primary btn-sm">Post Comment</button>
          </form>
        )}
        <div className="comments-list">
          {comments.map(c => (
            <div key={c.id} className="comment">
              <strong>{c.username}</strong>
              <p>{c.content}</p>
              <span className="comment-date">{new Date(c.created_at).toLocaleDateString()}</span>
            </div>
          ))}
          {comments.length === 0 && <p className="empty-state">No comments yet. Be the first!</p>}
        </div>
      </section>
    </div>
  );
}
