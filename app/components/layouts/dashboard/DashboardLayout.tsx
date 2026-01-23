import { Outlet, NavLink, Link, useLocation } from "react-router";
import {
  RiHome5Line,
  RiHome5Fill,
  RiPenNibLine,
  RiPenNibFill,
  RiArticleLine,
  RiArticleFill,
  RiCalendarEventLine,
  RiCalendarEventFill,
  RiAccountCircleLine,
  RiAccountCircleFill,
  RiParentLine,
  RiParentFill,
  RiLogoutBoxRLine,
  RiTimeLine,
  RiTimeFill,
  RiSpeakerLine,
  RiSpeakerFill,
  RiSearchLine,
  RiMore2Fill,
  RiChat1Fill,
} from "react-icons/ri";
import { Coat } from "~/images";
import { useAuth } from "~/contexts/AuthContext";
import { useState, useEffect } from "react";

const navigationLinks = [
  {
    to: "/home_embassy",
    label: "Home",
    icon: RiHome5Line,
    activeIcon: RiHome5Fill,
  },
  {
    to: "/em_my_publications",
    label: "My News",
    icon: RiArticleLine,
    activeIcon: RiArticleFill,
  },
  {
    to: "/em_manage_publications",
    label: "Manage",
    icon: RiPenNibLine,
    activeIcon: RiPenNibFill,
  },
  {
    to: "/information_desk_boards",
    label: "Boards",
    icon: RiSpeakerLine,
    activeIcon: RiSpeakerFill,
  },
  // { to: "/em_community_forum", label: "Messages", icon: RiChat1Fill, activeIcon: RiChat1Fill },
  {
    to: "/events",
    label: "Events",
    icon: RiCalendarEventLine,
    activeIcon: RiCalendarEventFill,
  },
  { to: "/tasks", label: "Tasks", icon: RiTimeLine, activeIcon: RiTimeFill },
  {
    to: "/embassy_staff",
    label: "Staff",
    icon: RiParentLine,
    activeIcon: RiParentFill,
  },
  {
    to: "/user",
    label: "Profile",
    icon: RiAccountCircleLine,
    activeIcon: RiAccountCircleFill,
  },
];

// Mobile bottom nav shows first 4 items + more menu
const mobileNavLinks = navigationLinks.slice(0, 4);
const moreMenuLinks = navigationLinks.slice(4);

export default function DashboardLayout() {
  const location = useLocation();
  const { user, accessToken, updateUserData } = useAuth();
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  // Fetch user profile data on mount if profile_picture is missing
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user?.id || !accessToken || user?.profile_picture) return;

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/users/${user.id}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          },
        );

        if (response.ok) {
          const data = await response.json();
          if (data.profile_picture) {
            updateUserData({ profile_picture: data.profile_picture });
          }
        }
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    fetchUserProfile();
  }, [user?.id, accessToken]);

  const userProfilePicture =
    user?.profile_picture ||
    "https://cdn.pixabay.com/photo/2025/10/07/10/59/parrot-9878922_1280.jpg";

  const isLinkActive = (to: string) => location.pathname.startsWith(to);

  return (
    <div className="bg-white min-h-screen flex flex-col">
      {/* Top Header Bar - LinkedIn Style */}
      <header className="bg-white border-b border-gray-300 sticky top-0 z-50">
        <div className="max-w-2/3 mx-auto px-3 md:px-4">
          <div className="flex items-center justify-between h-14">
            {/* Left: Logo & Search */}
            <div className="flex items-center gap-4 md:gap-3 flex-1">
              <Link to="/home_embassy" className="shrink-0">
                <img
                  src={Coat}
                  alt="Embassy Logo"
                  className="w-9 h-9 md:w-10 md:h-10 object-contain"
                />
              </Link>
              {/* Search Bar */}
              <div className="relative flex-1 max-w-md">
                <div className="flex items-center bg-blue-50 rounded-md px-3 py-2 border border-transparent focus-within:border-blue-500 focus-within:bg-white transition-all">
                  <RiSearchLine className="text-gray-500 w-5 h-5 shrink-0" />
                  <input
                    type="search"
                    placeholder="Search"
                    className="bg-transparent border-none outline-none ml-2 w-full text-sm placeholder-gray-500"
                  />
                  <span className="hidden md:flex items-center gap-1 text-xs text-gray-400">
                    <kbd className="kbd kbd-xs">⌘</kbd>
                    <kbd className="kbd kbd-xs">K</kbd>
                  </span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation - Hidden on mobile */}
            <nav className="hidden lg:flex items-center">
              {navigationLinks.map((link) => {
                const isActive = isLinkActive(link.to);
                const Icon = isActive ? link.activeIcon : link.icon;
                return (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    className="flex flex-col items-center justify-center px-3 xl:px-4 py-2 min-w-20 group relative"
                  >
                    <Icon
                      className={`w-6 h-6 ${
                        isActive
                          ? "text-blue-600"
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                    />
                    <span
                      className={`text-xs mt-0.5 whitespace-nowrap ${
                        isActive
                          ? "text-blue-600 font-medium"
                          : "text-gray-500 group-hover:text-gray-900"
                      }`}
                    >
                      {link.label}
                    </span>
                    {/* Active indicator line */}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-blue-600 rounded" />
                    )}
                  </NavLink>
                );
              })}

              {/* Divider */}
              <div className="h-10 w-px bg-gray-300 mx-2" />

              {/* User dropdown */}
              <div className="dropdown dropdown-end">
                <div
                  tabIndex={0}
                  role="button"
                  className="flex flex-col items-center justify-center px-3 py-1 cursor-pointer group"
                >
                  <img
                    src={userProfilePicture}
                    alt="User Avatar"
                    className="w-6 h-6 rounded-full object-cover ring-2 ring-transparent group-hover:ring-gray-300"
                  />
                  <span className="text-xs mt-0.5 text-gray-500 group-hover:text-gray-900 flex items-center gap-0.5">
                    Me
                    <svg
                      className="w-3 h-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </span>
                </div>
                <ul
                  tabIndex={0}
                  className="dropdown-content menu bg-white rounded-lg shadow-lg border border-gray-200 w-56 mt-2 p-2 z-50"
                >
                  <li className="px-3 py-2 border-b border-gray-100">
                    <Link
                      to="/user"
                      className="flex items-center gap-3 p-0 hover:bg-transparent"
                    >
                      <img
                        src={userProfilePicture}
                        alt="User Avatar"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-semibold text-gray-900">
                          {user?.first_name
                            ? `${user.first_name} ${user.last_name}`
                            : "User"}
                        </p>
                        <p className="text-xs text-gray-500">View Profile</p>
                      </div>
                    </Link>
                  </li>
                  <li className="mt-2">
                    <Link
                      to="/logout"
                      className="text-gray-700 hover:bg-gray-100 rounded-md"
                    >
                      <RiLogoutBoxRLine className="w-5 h-5" />
                      Sign Out
                    </Link>
                  </li>
                </ul>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 pb-16 lg:pb-0">
        <div className="lg:max-w-11/12 max-w-full lg:mx-auto mx-1">
          <Outlet />
        </div>
      </main>

      {/* Mobile Bottom Navigation - LinkedIn Style */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 z-50">
        <div className="flex items-center justify-around h-14">
          {mobileNavLinks.map((link) => {
            const isActive = isLinkActive(link.to);
            const Icon = isActive ? link.activeIcon : link.icon;
            return (
              <NavLink
                key={link.to}
                to={link.to}
                className="flex flex-col items-center justify-center flex-1 py-2 relative"
              >
                {isActive && (
                  <span className="absolute top-0 left-1/4 right-1/4 h-0.5 bg-blue-600 rounded-b-full" />
                )}
                <Icon
                  className={`w-6 h-6 ${
                    isActive ? "text-blue-600" : "text-gray-500"
                  }`}
                />
                <span
                  className={`text-[10px] mt-0.5 ${
                    isActive ? "text-blue-600 font-medium" : "text-gray-500"
                  }`}
                >
                  {link.label}
                </span>
              </NavLink>
            );
          })}

          {/* More menu for additional items */}
          <div className="relative flex-1">
            <button
              onClick={() => setMoreMenuOpen(!moreMenuOpen)}
              className="flex flex-col items-center justify-center w-full py-2"
            >
              <RiMore2Fill
                className={`w-6 h-6 ${moreMenuOpen ? "text-blue-600" : "text-gray-500"}`}
              />
              <span
                className={`text-[10px] mt-0.5 ${moreMenuOpen ? "text-blue-600 font-medium" : "text-gray-500"}`}
              >
                More
              </span>
            </button>

            {/* More dropdown menu */}
            {moreMenuOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setMoreMenuOpen(false)}
                />
                <div className="absolute bottom-full right-0 mb-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 overflow-hidden">
                  {moreMenuLinks.map((link) => {
                    const isActive = isLinkActive(link.to);
                    const Icon = isActive ? link.activeIcon : link.icon;
                    return (
                      <NavLink
                        key={link.to}
                        to={link.to}
                        onClick={() => setMoreMenuOpen(false)}
                        className={`flex items-center gap-3 px-4 py-3 hover:bg-gray-50 ${
                          isActive
                            ? "bg-blue-50 text-blue-600"
                            : "text-gray-700"
                        }`}
                      >
                        <Icon className="w-5 h-5" />
                        <span className="text-sm font-medium">
                          {link.label}
                        </span>
                      </NavLink>
                    );
                  })}
                  <div className="border-t border-gray-100">
                    <Link
                      to="/logout"
                      onClick={() => setMoreMenuOpen(false)}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 text-gray-700"
                    >
                      <RiLogoutBoxRLine className="w-5 h-5" />
                      <span className="text-sm font-medium">Sign Out</span>
                    </Link>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </nav>
      {/* Mobile: User avatar & menu toggle */}
      <div className="flex ml-4 lg:hidden items-center justify-end gap-2">
        <Link to="/user">
          <img
            src={userProfilePicture}
            alt="User Avatar"
            className="w-8 h-8 rounded-full object-cover"
          />
        </Link>
      </div>
    </div>
  );
}
