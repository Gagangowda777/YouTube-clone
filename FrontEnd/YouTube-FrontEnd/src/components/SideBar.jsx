import { TiHome } from "react-icons/ti";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { LuHistory } from "react-icons/lu";
import { FiShoppingBag } from "react-icons/fi";
import { IoMusicalNoteOutline } from "react-icons/io5";
import { BiMovie } from "react-icons/bi";
import { TfiYoutube } from "react-icons/tfi";
import { MdOutlineOutlinedFlag } from "react-icons/md";
import { SiYoutubemusic } from "react-icons/si";
import { SiYoutubekids } from "react-icons/si";


function SideBar({ isOpen }) {
  const sidebarWidth = isOpen ? "w-60" : "w-20";

  return (
    <div className={`fixed left-0 top-16 h-full bg-white overflow-y-auto ${sidebarWidth}`}>
      <div className="py-4">

        <div className="px-2 mb-4">
          {/* Home */}
          <button className={`flex w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors ${isOpen ? 'items-center gap-6 justify-start' : 'flex-col items-center gap-1 justify-center'}`}>
            <TiHome className="text-2xl" />
            <span className={`text-xs font-medium text-center ${isOpen ? '' : 'leading-tight'}`}>Home</span>
          </button>

          {/* Shorts */}
          <button className={`flex w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors ${isOpen ? 'items-center gap-6 justify-start' : 'flex-col items-center gap-1 justify-center'}`}>
            <SiYoutubeshorts className="text-2xl" />
            <span className={`text-xs font-medium text-center ${isOpen ? '' : 'leading-tight'}`}>Shorts</span>
          </button>

          {/* Subscriptions */}
          <button className={`flex w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors ${isOpen ? 'items-center gap-6 justify-start' : 'flex-col items-center gap-1 justify-center'}`}>
            <MdOutlineSubscriptions className="text-2xl" />
            <span className={`text-xs font-medium text-center ${isOpen ? '' : 'leading-tight'}`}>Subscriptions</span>
          </button>

          {/* You */}
          <button className={`flex w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors ${isOpen ? 'items-center gap-6 justify-start' : 'flex-col items-center gap-1 justify-center'}`}>
            <CgProfile className="text-2xl" />
            <span className={`text-xs font-medium text-center ${isOpen ? '' : 'leading-tight'}`}>You</span>
          </button>
        </div>

        {/* Everything below only shows when open */}
        {isOpen && (
          <>
            {/* History */}
            <div className="px-2 mb-4">
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <LuHistory className="text-2xl" />
                <span className="text-sm font-medium">History</span>
              </button>
            </div>

            {/* Sign in */}
            <div className="px-2 border-t border-gray-300 pt-3">
              <p className="text-sm text-gray-600 mb-2 pl-2 pr-2 m-2">Sign in to like videos, comment, and subscribe.</p>
              <button className="flex items-center gap-2 px-3 py-1.5 bg-gray-200 hover:bg-gray-300 rounded-full ml-4">
                <CgProfile className="text-xl text-gray-700" />
                <span className="text-sm font-medium">Sign In</span>
              </button>
            </div>

            {/* Explore */}
            <div className="px-2 pt-2 border-t border-gray-300 mt-6">
              <p className="text-xl font-bold p-2">Explore</p>
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <FiShoppingBag className="text-2xl" />
                <span className="text-xs font-medium">Shopping</span>
              </button>
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <IoMusicalNoteOutline className="text-2xl" />
                <span className="text-xs font-medium">Music</span>
              </button>
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <BiMovie className="text-2xl" />
                <span className="text-xs font-medium">Movies</span>
              </button>
            </div>

            {/* More */}
            <div className="px-2 pt-2 border-t border-gray-300 mt-6">
              <p className="text-xl font-bold p-2">More</p>
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <TfiYoutube className="text-2xl" />
                <span className="text-xs font-medium">Youtube Premium</span>
              </button>
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <SiYoutubemusic className="text-2xl" />
                <span className="text-xs font-medium">Youtube Music</span>
              </button>
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <SiYoutubekids className="text-2xl" />
                <span className="text-xs font-medium">Youtube Kids</span>
              </button>
            </div>

            {/* Report */}
            <div className="px-2 pt-2 border-t border-gray-300 mt-6">
              <button className="flex items-center gap-6 w-full px-3 py-3 hover:bg-gray-100 rounded-lg transition-colors justify-start">
                <MdOutlineOutlinedFlag className="text-2xl" />
                <span className="text-xs font-medium">Report</span>
              </button>
            </div>

            {/* Footer */}
            <div className="px-2 pt-2 border-t border-gray-300 mt-6 pb-10">
              <p className="p-4 font-light text-sm">About press copyright contact us creators advertise developers</p>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default SideBar;