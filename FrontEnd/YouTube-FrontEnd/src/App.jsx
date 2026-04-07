import { useState } from "react";
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"
import CreateVideoModal from "./components/CreateVideoModal"
import VideoModal from "./components/VideoModal"
import { AuthProvider } from "./context/AuthContext"

function App() {
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
    <AuthProvider>
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
    </AuthProvider>
  )
}

export default App