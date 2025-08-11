import React, { useState } from "react";
import LogoBrand from "./Logo/LogoBrand";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";


export default function Headder() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border border-gray-200 dark:bg-gray-900 rounded-xl shadow-xl">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto px-4">
        
        {/* Logo - ẩn khi mobile */}
        <div className="hidden md:block">
          <LogoBrand />
        </div>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-200"
        >
       <FontAwesomeIcon icon={faBars}  />
    
        </button>

        {/* Menu */}
        <div
          className={`${isOpen ? "block" : "hidden"} w-full md:block md:w-auto transition-all duration-300`}
        >
          <ul className="font-medium flex flex-col p-4 md:p-0 mt-4 border border-gray-100 rounded-lg bg-gray-50 
          md:flex-row md:space-x-8 md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            
            <li>
              <NavLink
                to="/Home/Trang-Chu"
                className="block py-2 px-3 text-white bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 dark:text-white md:dark:text-blue-500"
              >
                Trang Chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/Home/Movie"
                className="block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:text-blue-700 dark:text-white md:dark:hover:text-blue-500"
              >
                Movie
              </NavLink>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 hover:text-blue-700">Services</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 hover:text-blue-700">Pricing</a>
            </li>
            <li>
              <a href="#" className="block py-2 px-3 hover:text-blue-700">Contact</a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
