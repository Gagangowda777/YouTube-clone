import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CiSearch } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoEllipsisVertical } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { useAuth } from "../context/AuthContext";

function Header({ onMenuClick, onCreateVideo, onSearch }) {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchInput, setSearchInput] = useState('');

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleSignInClick = () => {
    navigate('/login');
  };

  const handleCreateVideo = () => {
    if (user) {
      onCreateVideo();
    } else {
      navigate('/login');
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <>
      {/* Header which is sticky */}
      <div className="sticky top-0 z-50">
        <div className="flex justify-between items-center px-4 py-2.5 gap-6">

          {/* Logo and Menu */}
          <div className="flex items-center gap-4 shrink-0">
            <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <RxHamburgerMenu className="text-2xl" />
            </button>
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
              <img src="./src/assets/yt.png" alt="yt-logo" className="w-26 h-7" />
            </div>
          </div>

          {/* Search Bar with search icon and record icon*/}
          <form onSubmit={(e) => { e.preventDefault(); onSearch(searchInput); }} className="flex items-center gap-2 max-w-2xl w-full">
            <div className="w-full flex items-center border border-gray-300 rounded-full px-5 py-2">
              <input
                type="text"
                name="searchbar"
                placeholder="Search"
                id="searchbar"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="bg-transparent w-full outline-none text-sm placeholder-gray-500 p-0.5"/>

              <button type="submit" className="cursor-pointer">
                <CiSearch className="text-xl" />
              </button>
            </div>
            <button type="button" className="p-2.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors hidden sm:flex items-center justify-center">
              <FaMicrophone className="text-lg text-gray-800" />
            </button>
          </form>

          {/* Icons and Profile */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                {/* Create Video Button */}
                <button
                  onClick={handleCreateVideo}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors bg-gray-200 mr-2"
                  title="Create video"
                >
                  + Create
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => navigate('/channel')}
                    className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:bg-blue-900">
                    {getUserInitials(user.name)}
                  </button>
                  <button
                    onClick={logout}
                    className="px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded-full text-sm text-gray-700 transition-colors">
                    Sign Out
                  </button>
                </div>
              </>
            ) : (
              <>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <IoEllipsisVertical className="text-lg text-gray-700" />
                </button>
                <button
                  onClick={handleSignInClick}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors">
                  <CgProfile className="text-xl text-gray-700" />
                  <span className="text-sm hidden md:inline font-medium p-1">Sign In</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default Header;