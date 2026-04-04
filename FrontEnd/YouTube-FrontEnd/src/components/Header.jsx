import { CiMenuBurger } from "react-icons/ci";
import { FaRegBell } from "react-icons/fa";
import { CiSearch } from "react-icons/ci";
import { FaMicrophone } from "react-icons/fa";
import { CgProfile } from "react-icons/cg";



function Header() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center p-4 ">

        <div className="flex flex-row gap-4 ml-2">
            <button className="text-2xl"><CiMenuBurger /></button>
            <h1 className="text-2xl">YouTube</h1>
        </div>

        <div className="flex flex-row max-w-2xl w-full">
            <input type="text" placeholder="search" id="searchbar" className="p-2 rounded-3xl w-full border-2"/>
            <label htmlFor="searchbar" className="p-2 text-2xl"> <CiSearch /> </label>
            <button><FaMicrophone /> </button>
        </div>

        <div className="">
            <button className="flex flex-row text-xl rounded-2xl p-1">
                <div className="text-2xl pt-1 pr-1"><CgProfile /></div>
                <div className="">Sign In</div> 
            </button>
        </div>
    </div>
  )
}

export default Header