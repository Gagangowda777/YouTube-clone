import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"
import CreateVideoModal from "./components/CreateVideoModal"
import VideoModal from "./components/VideoModal"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import ChannelPage from "./pages/ChannelPage"
import VideoPlayerPage from "./pages/VideoPlayerPage"
import NotFoundPage from "./pages/NotFoundPage"
import { AuthProvider } from "./context/AuthContext"
import { ThemeProvider } from "./context/ThemeContext"

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth >= 768);
  const [showCreateVideoModal, setShowCreateVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [refreshVideosKey, setRefreshVideosKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleOpenCreateVideo = () => {
    setShowCreateVideoModal(true);
  };

  const handleCloseCreateVideo = () => {
    setShowCreateVideoModal(false);
  };

  const handleVideoCreated = () => {
    setRefreshVideosKey((prev) => prev + 1);
  };

  const handleVideoClick = (video) => {
    setSelectedVideo(video);
  };

  const handleCloseVideoModal = () => {
    setSelectedVideo(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0f0f0f] transition-colors duration-300">
      <Header onMenuClick={toggleSidebar} onCreateVideo={handleOpenCreateVideo} onSearch={setSearchQuery} />
      <div className="flex">
        <SideBar isOpen={isSidebarOpen} />
        <Routes>
          <Route
            path="/"
            element={
              <MainContent
                isSidebarOpen={isSidebarOpen}
                refreshKey={refreshVideosKey}
                onVideoClick={handleVideoClick}
                searchQuery={searchQuery}
              />
            }
          />
          <Route
            path="channel"
            element={<ChannelPage isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="video/:videoId"
            element={<VideoPlayerPage isSidebarOpen={isSidebarOpen} />}
          />
          <Route
            path="*"
            element={<NotFoundPage />}
          />
        </Routes>
      </div>
      {showCreateVideoModal && (
        <CreateVideoModal
          onClose={handleCloseCreateVideo}
          onVideoCreated={() => {
            handleVideoCreated();
            handleCloseCreateVideo();
          }}
        />
      )}
      {selectedVideo && (
        <VideoModal video={selectedVideo} onClose={handleCloseVideoModal} />
      )}
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/*" element={<AppContent />} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;