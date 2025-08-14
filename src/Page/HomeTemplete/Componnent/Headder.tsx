import React, { useState } from "react";
import LogoBrand from "./LogoBrand";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars } from "@fortawesome/free-solid-svg-icons";

export default function Headder() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-black via-gray-900 to-black shadow-lg rounded-xl border border-gray-800">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">          
          <h1 className="text-white font-bold text-2xl md:text-3xl tracking-widest">
            PANDA
          </h1>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="inline-flex items-center justify-center w-10 h-10 text-gray-400 rounded-lg md:hidden hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <FontAwesomeIcon icon={faBars} size="lg" />
          </button>
          <ul className="hidden md:flex items-center gap-8 font-medium">
            <li>
              <NavLink
                to="Trang-Chu"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold transition-colors"
                    : "text-white hover:text-blue-400 transition-colors"
                }
              >
                Trang Chủ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="Movie"
                className={({ isActive }) =>
                  isActive
                    ? "text-blue-400 font-semibold transition-colors"
                    : "text-white hover:text-blue-400 transition-colors"
                }
              >
                Movie
              </NavLink>
            </li>
            <li>
              <NavLink
              to=""
                className="text-white hover:text-blue-400 transition-colors"
              >
                Đăng Nhập
              </NavLink>
            </li>
            <li>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Pricing
              </a>
            </li>
            <li>
              <a
                href="#"
                className="text-white hover:text-blue-400 transition-colors"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        {isOpen && (
          <div className="md:hidden">
            <ul className="flex flex-col items-start gap-4 py-4 font-medium">
              <li>
                <NavLink
                  to="/Home/Trang-Chu"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-400 font-semibold transition-colors"
                      : "text-white hover:text-blue-400 transition-colors"
                  }
                >
                  Trang Chủ
                </NavLink>
              </li>
              <li>
                <NavLink
                  to="/Home/Movie"
                  className={({ isActive }) =>
                    isActive
                      ? "text-blue-400 font-semibold transition-colors"
                      : "text-white hover:text-blue-400 transition-colors"
                  }
                >
                  Movie
                </NavLink>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  Services
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  Pricing
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-white hover:text-blue-400 transition-colors"
                >
                  Contact
                </a>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
}
