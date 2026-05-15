import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api';
import { useAuth } from '../context/AuthContext';
import StoryCard from '../components/StoryCard';

export default function UserProfile() {
  const { username } = useParams();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [stories, setStories] = useState([]);

  const fetchProfile = () => {
    api.get(`/auth/users/${username}/`).then(r => setProfile(r.data));
  };

  useEffect(() => {
    fetchProfile();
    api.get('/stories/', { params: { author: username } })
      .then(r => setStories(r.data.results || r.data));
  }, [username]);

  if (!profile) return <div className="loading">Loading...</div>;

  const isOwn = user && user.username === username;

  const handleFollow = async () => {
    if (profile.is_following) {
      await api.post(`/auth/users/${username}/unfollow/`);
    } else {
      await api.post(`/auth/users/${username}/follow/`);
    }
    fetchProfile();
  };

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">
          {profile.avatar ? (
            <img src={profile.avatar} alt={profile.username} />
          ) : (
            <div className="avatar-placeholder">{profile.username[0].toUpperCase()}</div>
          )}
        </div>
        <div className="profile-info">
          <h1>{profile.username}</h1>
          {profile.bio && <p className="profile-bio">{profile.bio}</p>}
          <div className="profile-stats">
            <span><strong>{profile.stories_count}</strong> stories</span>
            <span><strong>{profile.followers_count}</strong> followers</span>
            <span><strong>{profile.following_count}</strong> following</span>
          </div>
          {user && !isOwn && (
            <button onClick={handleFollow} className={`btn ${profile.is_following ? 'btn-outline' : 'btn-primary'}`}>
              {profile.is_following ? 'Unfollow' : 'Follow'}
            </button>
          )}
        </div>
      </div>
      <section className="section">
        <h2>Stories by {profile.username}</h2>
        <div className="story-grid">
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </div>
        {stories.length === 0 && <p className="empty-state">No stories yet.</p>}
      </section>
    </div>
  );
}
