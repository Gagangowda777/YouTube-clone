import { useState, useEffect, useRef } from "react";
import { CiSearch } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoEllipsisVertical } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
import { IoMdNotificationsOutline } from "react-icons/io";
import { RiVideoAddLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";
import Login from "./Login";
import Register from "./Register";

function Header({ onMenuClick }) {
  const { user, logout } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const userMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };

  const handleSignInClick = () => {
    setIsLogin(true);
    setShowAuthModal(true);
  };

  const handleSwitchToRegister = () => {
    setIsLogin(false);
  };

  const handleSwitchToLogin = () => {
    setIsLogin(true);
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
  };

  const handleCreateVideo = () => {
    // TODO: Implement create video functionality
    alert('Create video functionality will be implemented');
  };

  const handleUserMenuClick = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
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
            <div className="flex items-center gap-1">
              <img src="./src/assets/yt.png" alt="yt-logo" className="w-26 h-7" />
            </div>
          </div>

          {/* Search Bar with search icon and record icon*/}
          <form className="flex items-center gap-2 max-w-2xl w-full">
            <div className="w-full flex items-center border border-gray-300 rounded-full px-5 py-2">
              <input
                type="text"
                name="searchbar"
                placeholder="Search"
                id="searchbar"
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
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  title="Create video"
                >
                  <RiVideoAddLine className="text-xl text-gray-700" />
                </button>

                {/* Notification Bell */}
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <IoMdNotificationsOutline className="text-xl text-gray-700" />
                </button>

                {/* User Initials with Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button
                    onClick={handleUserMenuClick}
                    className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:bg-blue-700 transition-colors"
                  >
                    {getUserInitials(user.name)}
                  </button>

                  {/* User Menu Dropdown */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                      <div className="px-4 py-2 text-sm text-gray-700 border-b border-gray-200">
                        <div className="font-medium">{user.name}</div>
                        <div className="text-gray-500">{user.email}</div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      >
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                  <IoEllipsisVertical className="text-lg text-gray-700" />
                </button>
                <button
                  onClick={handleSignInClick}
                  className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                >
                  <CgProfile className="text-xl text-gray-700" />
                  <span className="text-sm hidden md:inline font-medium p-1">Sign In</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Auth Modal */}
      {showAuthModal && (
        isLogin ? (
          <Login
            onSwitchToRegister={handleSwitchToRegister}
            onClose={handleCloseModal}
          />
        ) : (
          <Register
            onSwitchToLogin={handleSwitchToLogin}
            onClose={handleCloseModal}
          />
        )
      )}
    </>
  );
}

export default Header;