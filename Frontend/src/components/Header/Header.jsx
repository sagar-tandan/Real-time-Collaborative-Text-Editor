import React, { useState, useEffect, useContext } from "react";
import { Code2, Menu, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import MyContext from "../../Context/MyContext";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { user, setUser } = useContext(MyContext);

  const navigate = useNavigate();
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > window.innerHeight / 2);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed w-full top-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "backdrop-blur-sm bg-white/70 shadow-md shadow-black/10"
          : "bg-gradient-to-r from-[#212746] to-[#212645]"
      }`}
    >
      <div className="w-[95%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Code2
              className={`w-8 h-8 ${
                isScrolled ? "text-blue-900" : "text-white"
              }`}
            />
            <span
              className={`font-bold text-xl ${
                isScrolled ? "text-blue-900" : "text-white"
              }`}
            >
              2D Metaverse
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {["Home", "Testimonials", "Projects"].map((item) => (
              <a
                key={item}
                // href={`#${item.toLowerCase()}`}
                className={`${
                  isScrolled
                    ? "text-gray-700 hover:text-blue-900"
                    : "text-gray-100 hover:text-white"
                } transition-colors duration-200 font-medium`}
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
                  className={`px-6 py-[6px] rounded-md font-semibold transition-colors duration-200 ${
                    isScrolled
                      ? "text-blue-900 bg-blue-100"
                      : "text-blue-900 bg-white"
                  }`}
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
              <X
                className={`w-6 h-6 ${
                  isScrolled ? "text-blue-900" : "text-white"
                }`}
              />
            ) : (
              <Menu
                className={`w-6 h-6 ${
                  isScrolled ? "text-blue-900" : "text-white"
                }`}
              />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div
              className={`px-2 pt-2 pb-3 space-y-1 ${
                isScrolled ? "bg-white" : "bg-blue-900"
              }`}
            >
              {["Home", "Testimonials", "Projects"].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isScrolled
                      ? "text-gray-700 hover:text-blue-900 hover:bg-blue-50"
                      : "text-gray-100 hover:text-white hover:bg-blue-800"
                  }`}
                >
                  {item}
                </a>
              ))}
              <div className="space-y-2 pt-4">
                <button
                  className={`w-full px-3 py-2 rounded-md text-base font-medium ${
                    isScrolled
                      ? "text-blue-900 hover:bg-blue-50"
                      : "text-white hover:bg-blue-800"
                  }`}
                >
                  Login
                </button>
                <button
                  className={`w-full px-3 py-2 rounded-md text-base font-medium ${
                    isScrolled
                      ? "bg-blue-900 text-white hover:bg-blue-800"
                      : "bg-white text-blue-900 hover:bg-gray-100"
                  }`}
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
