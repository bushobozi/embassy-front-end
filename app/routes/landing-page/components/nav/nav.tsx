import { useState } from "react";
import { FaChevronUp, FaChevronDown } from "react-icons/fa6";
import { Link } from "react-router";
import { Coat } from "~/images";

const navItems = [
  { name: "Home", href: "/landing-gov-services" },
  { name: "Information Boards", href: "/landing-page#information-boards" },
  { name: "Services", href: "/landing-gov-services#services" },
  { name: "About Us", href: "/landing-gov-services#about" },
  { name: "Contact", href: "/landing-gov-services#contact" },
];

export default function Nav() {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <nav className="w-full pb-12">
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
          <div>
            <button
              className="cursor-pointer border-gray-50 border-b-2 flex gap-4 items-center px-3 py-3.5 text-xl font-medium hover:bg-gray-700 hover:text-white"
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
