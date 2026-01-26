import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { Link, useLocation, useNavigate } from "react-router";
import { Coat } from "~/images";

const navItems = [
  { name: "Home", href: "/", isAnchor: false },
  { name: "Information Boards", href: "#information-boards", isAnchor: true },
  { name: "Government Links", href: "#government-links", isAnchor: true },
  { name: "Latest News", href: "/publications", isAnchor: false },
  { name: "Explore Uganda", href: "#explore-uganda", isAnchor: true },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleAnchorClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    const targetId = href.replace("#", "");

    // If we're not on the homepage, navigate there first
    if (location.pathname !== "/") {
      navigate("/");
      // Wait for navigation to complete, then scroll
      setTimeout(() => {
        const element = document.getElementById(targetId);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    } else {
      // We're already on homepage, just scroll
      const element = document.getElementById(targetId);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }

    setIsOpen(false);
  };

  return (
    <nav className="w-full pb-12 pt-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-gray-800 text-lg font-bold">
              <img
                src={Coat}
                alt="Coat of Arms"
                className="h-15 w-15 inline mr-2"
              />
            </Link>
          </div>

          {/* Inline navigation links - visible on larger screens */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              to="/"
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors"
            >
              Home
            </Link>
            <a
              href="#information-boards"
              onClick={(e) => handleAnchorClick(e, "#information-boards")}
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors cursor-pointer"
            >
              Information Boards
            </a>
            <a
              href="#government-links"
              onClick={(e) => handleAnchorClick(e, "#government-links")}
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors cursor-pointer"
            >
              Government Links
            </a>
            <Link to="/publications" className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors">
              Latest News
            </Link>
            <a
              href="#explore-uganda"
              onClick={(e) => handleAnchorClick(e, "#explore-uganda")}
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors cursor-pointer"
            >
              Explore Uganda
            </a>
          </div>

          <div>
            <button
              className="cursor-pointer flex gap-4 items-center px-3 py-3.5 text-xl font-medium hover:bg-gray-700 hover:text-white"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <FaChevronUp /> : <FaChevronDown />} Menu
            </button>
          </div>
        </div>
      </div>
      {isOpen && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4 bg-gray-900 rounded-2xl mt-8">
          <div className="flex flex-col space-y-2 p-6">
            {navItems.map((item) => (
              item.isAnchor ? (
                <a
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleAnchorClick(e, item.href)}
                  className="text-gray-50 hover:underline text-lg font-medium cursor-pointer"
                >
                  {item.name}
                </a>
              ) : (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setIsOpen(false)}
                  className="text-gray-50 hover:underline text-lg font-medium"
                >
                  {item.name}
                </Link>
              )
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
