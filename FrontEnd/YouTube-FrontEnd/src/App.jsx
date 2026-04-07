import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"
import CreateVideoModal from "./components/CreateVideoModal"
import VideoModal from "./components/VideoModal"
import LoginPage from "./pages/LoginPage"
import RegisterPage from "./pages/RegisterPage"
import { AuthProvider } from "./context/AuthContext"

function AppContent() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showCreateVideoModal, setShowCreateVideoModal] = useState(false);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [refreshVideosKey, setRefreshVideosKey] = useState(0);

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
    <div className="min-h-screen bg-white">
      <Header onMenuClick={toggleSidebar} onCreateVideo={handleOpenCreateVideo} />
      <div className="flex">
        <SideBar isOpen={isSidebarOpen} />
        <MainContent
          isSidebarOpen={isSidebarOpen}
          refreshKey={refreshVideosKey}
          onVideoClick={handleVideoClick}
        />
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
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/*" element={<AppContent />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;