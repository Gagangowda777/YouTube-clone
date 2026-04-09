import { useState, useEffect, useRef } from "react"; // importing useState, useEffect, and useRef hooks 
import { useNavigate } from "react-router-dom";      // importing useNavigate for navigation

// importing icons from react-icons 
import { CiSearch } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoEllipsisVertical } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";
// importing AuthContext to manage user authentication 
import { useAuth } from "../context/AuthContext";

// function for the header of the application which includes logo, search bar, and user profile
function Header({ onMenuClick, onCreateVideo, onSearch }) {
  const navigate = useNavigate();     // Hook for navigation
  const { user, logout } = useAuth(); // Get user info and logout function from AuthContext
  const [searchInput, setSearchInput] = useState(''); // State for managing search input
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for managing dropdown 
  const dropdownRef = useRef(null); // Ref for dropdown 

  // function to get user initials for profile icon
  const getUserInitials = (name) => {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 2);
  };
  // Effect to handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  // function to handle sign in and navigate to login page
  const handleSignInClick = () => {
    navigate('/login');
  };
  // function to handle create video, checks if user is logged in before allowing access to create video modal
  const handleCreateVideo = () => {
    if (user) {
      onCreateVideo();
    } 
    else {
      navigate('/login');
    }
  };
  // function to handle logout 
  const handleLogout = () => {
    logout();
  };
  // function to navigate to user's channel page
  const handleViewChannel = () => {
    navigate('/channel');
    setIsDropdownOpen(false);
  };

  return (
    <>
      {/* header which is sticky position */}
      <div className="sticky top-0 z-50">
        <div className="flex justify-between items-center px-2 sm:px-4 py-2.5 gap-2 sm:gap-6">

          {/* Logo and Menu */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <RxHamburgerMenu className="text-2xl" />
            </button>
            <div className="flex items-center gap-1 cursor-pointer" onClick={() => navigate('/')}>
              <img src="./src/assets/yt.png" alt="yt-logo" className="w-20 sm:w-26 h-5 sm:h-7" />
            </div>
          </div>

          {/* search Bar with search icon and record icon*/}
          <form onSubmit={(e) => { e.preventDefault(); onSearch(searchInput); }} className="flex flex-1 items-center gap-1 sm:gap-2 max-w-2xl sm:w-full mx-2 sm:mx-0">
            <div className="w-full flex items-center border border-gray-300 rounded-full px-3 sm:px-5 py-1.5 sm:py-2">
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

          {/* icons and profile */}
          <div className="flex items-center gap-2 shrink-0">
            {user ? (
              <>
                {/* create Video Button */}
                <button
                  onClick={handleCreateVideo}
                  className="px-3 py-1.5 sm:px-4 sm:py-2 hover:bg-gray-300 rounded-full transition-colors bg-gray-200 mr-1 sm:mr-2 flex items-center justify-center font-medium" 
                  title="Create video">
                  <span className="hidden sm:inline">+ Create</span>
                  <span className="sm:hidden text-lg leading-none">+</span>
                </button>
                {/* profile Dropdown */}
                <div className="relative" ref={dropdownRef}>
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-medium text-sm cursor-pointer hover:bg-blue-900">
                    {getUserInitials(user.name)}
                  </button>
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg z-50">
                      <button
                        onClick={handleViewChannel}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        View Channel
                      </button>
                      <button
                        onClick={() => { logout(); setIsDropdownOpen(false); }}
                        className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors">
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              // contional rendering for sign in button if user is not logged in
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