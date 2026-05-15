import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar">
      <div className="nav-content">
        <Link to="/" className="nav-logo">StoriesApp</Link>
        <div className="nav-links">
          <Link to="/browse">Browse</Link>
          <Link to="/trending">Trending</Link>
          {user ? (
            <>
              <Link to="/my-stories">My Stories</Link>
              <Link to="/reading-list">Reading List</Link>
              <Link to="/write" className="btn btn-primary btn-sm">Write</Link>
              <div className="nav-user">
                <Link to={`/user/${user.username}`}>{user.username}</Link>
                <button onClick={handleLogout} className="btn btn-ghost btn-sm">Logout</button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Log In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
