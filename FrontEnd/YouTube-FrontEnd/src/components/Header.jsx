import { CiSearch } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";
import { IoEllipsisVertical } from "react-icons/io5";
import { RxHamburgerMenu } from "react-icons/rx";

function Header({ onMenuClick }) {
  return (
    // Header which is sticky 
    <div className="sticky top-0 z-50">
      <div className="flex justify-between items-center px-4 py-2.5 gap-6">
        
        {/* Logo and Menu */}
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={onMenuClick} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <RxHamburgerMenu  className="text-2xl " />
          </button>
          <div className="flex items-center gap-1">
            <img src="./src/assets/yt.png" alt="yt-logo" className="w-26 h-7" />
          </div>
        </div>

        {/* Search Bar with search icon and reacord icon*/}
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
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <IoEllipsisVertical className="text-lg text-gray-700" />
          </button>
          <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-full transition-colors">
            <CgProfile className="text-xl text-gray-700" />
            <span className="text-sm hidden md:inline font-medium p-1">Sign In</span>
          </button>
        </div>
      </div>
    </div>
  )
}

export default Header;