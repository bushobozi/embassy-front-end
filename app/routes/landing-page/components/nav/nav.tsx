import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { Link } from "react-router";
import { Coat } from "~/images";

const navItems = [
  { name: "Home", href: "/" },
  { name: "Information Boards", href: "#boards-heading" },
  { name: "Government Links", href: "#links-heading" },
  { name: "Explore Uganda", href: "#explore-heading" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
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
             <a
              href="/"
              target="_self"
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors"
            >
             Home
            </a>
            <a
              href="#boards-heading"
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors"
            >
              Information Boards
            </a>
            <a
              href="#links-heading"
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors"
            >
              Government Links
            </a>
            <a
              href="#explore-heading"
              className="text-white border-b-2 border-white hover:text-gray-50 font-medium transition-colors"
            >
              Explore Uganda
            </a>
          </div>

          <div>
            <button
              className="cursor-pointer  flex gap-4 items-center px-3 py-3.5 text-xl font-medium hover:bg-gray-700 hover:text-white"
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
              <Link
                key={item.name}
                to={item.href}
                className="text-gray-50 hover:underline text-lg font-medium"
              >
                {item.name}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
