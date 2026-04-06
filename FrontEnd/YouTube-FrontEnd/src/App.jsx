import { useState } from "react";
import Header from "./components/Header"
import SideBar from "./components/SideBar"
import MainContent from "./components/MainContent"

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen bg-white">
      <Header onMenuClick={toggleSidebar} />
      <div className="flex">
        <SideBar isOpen={isSidebarOpen} />
        <MainContent isSidebarOpen={isSidebarOpen} />
      </div>
    </div>
  )
}

export default App