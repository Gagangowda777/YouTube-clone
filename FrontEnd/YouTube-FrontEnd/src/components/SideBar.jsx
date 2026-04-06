import { TiHome } from "react-icons/ti";
import { SiYoutubeshorts } from "react-icons/si";
import { MdOutlineSubscriptions } from "react-icons/md";
import { CgProfile } from "react-icons/cg";

function SideBar({ isOpen }) {
  // width 60 when open, 20 when closed
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
      </div>
    </div>
  )
}

export default SideBar;