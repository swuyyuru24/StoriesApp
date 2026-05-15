import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Browse from './pages/Browse';
import Trending from './pages/Trending';
import StoryDetail from './pages/StoryDetail';
import ChapterReader from './pages/ChapterReader';
import WriteStory from './pages/WriteStory';
import EditStory from './pages/EditStory';
import NewChapter from './pages/NewChapter';
import MyStories from './pages/MyStories';
import ReadingList from './pages/ReadingList';
import UserProfile from './pages/UserProfile';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/browse" element={<Browse />} />
            <Route path="/trending" element={<Trending />} />
            <Route path="/story/:id" element={<StoryDetail />} />
            <Route path="/story/:id/chapter/:chapterId" element={<ChapterReader />} />
            <Route path="/story/:id/edit" element={<EditStory />} />
            <Route path="/story/:id/new-chapter" element={<NewChapter />} />
            <Route path="/write" element={<WriteStory />} />
            <Route path="/my-stories" element={<MyStories />} />
            <Route path="/reading-list" element={<ReadingList />} />
            <Route path="/user/:username" element={<UserProfile />} />
          </Routes>
        </main>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
