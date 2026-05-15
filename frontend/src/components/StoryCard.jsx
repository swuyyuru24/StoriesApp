import { Link } from 'react-router-dom';

export default function StoryCard({ story }) {
  return (
    <div className="story-card">
      <div className="story-card-cover">
        {story.cover ? (
          <img src={story.cover} alt={story.title} />
        ) : (
          <div className="story-card-placeholder">
            <span>{story.title[0]}</span>
          </div>
        )}
      </div>
      <div className="story-card-body">
        <Link to={`/story/${story.id}`} className="story-card-title">{story.title}</Link>
        <Link to={`/user/${story.author_name}`} className="story-card-author">
          by {story.author_name}
        </Link>
        <p className="story-card-desc">{story.description?.slice(0, 120)}...</p>
        <div className="story-card-meta">
          <span>{story.chapter_count} chapters</span>
          <span>{story.reads_count} reads</span>
          <span>{story.recommendations_count} recs</span>
        </div>
        <span className="story-card-genre">{story.genre}</span>
      </div>
    </div>
  );
}
