import React, { useState, useEffect, useContext } from "react";
import { Code2, Menu, Trophy, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyContext from "../../Context/MyContext";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, setUser } = useContext(MyContext);

  const navigate = useNavigate();

  return (
    <header
      className={`fixed w-full mx-auto top-0 z-50 transition-all duration-300 bg-white/30 backdrop-blur-md shadow-md text-blue-600`}
    >
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="w-full flex justify-between items-center h-[72px] max-w-screen-2xl ">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Trophy className="w-6 h-6 text-blue-600" />
            <span className={`font-bold text-xl`}>CodeTracker</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {[""].map((item) => (
              <a
                key={item}
                // href={`#${item.toLowerCase()}`}
                className={`
                   transition-colors duration-200 font-medium`}
              >
                {item}
              </a>
            ))}
            {user && (
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => {
                    localStorage.removeItem("token");
                    setUser(null);
                    navigate("/");
                  }}
                  className={`px-6 py-[6px] rounded-md font-semibold transition-colors duration-200 `}
                >
                  Logout
                </button>
              </div>
              // ) : (
              //   <div className="flex items-center space-x-4">
              //     <button
              //       onClick={() => {}}
              //       className={`px-6 py-[6px] rounded-md font-semibold transition-colors duration-200 ${
              //         isScrolled
              //           ? "text-blue-900 bg-blue-100"
              //           : "text-blue-900 bg-white"
              //       }`}
              //     >
              //       Login
              //     </button>
              //   </div>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className={`w-6 h-6 `} />
            ) : (
              <Menu className={`w-6 h-6 `} />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className={`px-2 pt-2 pb-3 space-y-1 `}>
              {["Home", "Testimonials", "Projects"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium `}
                >
                  {item}
                </a>
              ))}
              <div className="space-y-2 pt-4">
                <button
                  className={`w-full px-3 py-2 rounded-md text-base font-medium `}
                >
                  Login
                </button>
                <button
                  className={`w-full px-3 py-2 rounded-md text-base font-medium `}
                >
                  Sign Up
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
