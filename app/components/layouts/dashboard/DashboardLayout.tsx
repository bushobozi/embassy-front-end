import { Outlet, NavLink, Link, useLocation } from "react-router";
import {
  RiHome5Line,
  RiPenNibLine,
  RiInbox2Line,
  RiSettings3Line,
  RiArticleLine,
  RiCalendarEventLine,
  RiAccountCircleLine,
  RiSidebarUnfoldLine,
  RiParentLine,
  RiLogoutBoxRLine,
  RiTimeLine,
  RiSpeakerLine
} from "react-icons/ri";
import { Coat } from "~/images";
// import FooterBottom from "./FooterBottom";
import { useAuth } from "~/contexts/AuthContext";

const navigationLinks = [
  { to: "/home_embassy", label: "Home", icon: RiHome5Line },
  { to: "/em_my_publications", label: "My News Updates", icon: RiArticleLine },
  { to: "/em_manage_publications", label: "Manage News Updates", icon: RiPenNibLine },
  { to: "/information_desk_boards", label: "Information Boards", icon: RiSpeakerLine },
  { to: "/messages", label: "Messages", icon: RiInbox2Line },
  { to: "/events", label: "Events", icon: RiCalendarEventLine },
  { to: "/tasks", label: "Tasks", icon: RiTimeLine },
  { to: "/embassy_staff", label: "Embassy Staff", icon: RiParentLine },
  { to: "/user", label: "My Profile", icon: RiAccountCircleLine },
  { to: "/settings", label: "Settings", icon: RiSettings3Line },
];

export default function DashboardLayout() {
  const location = useLocation();
  const { user } = useAuth();
  const activeLink = navigationLinks
    .slice()
    .sort((a, b) => b.to.length - a.to.length)
    .find((link) => location.pathname.startsWith(link.to));
  const navbarTitle = activeLink ? activeLink.label : "Navbar Title";

  const userProfilePicture = user?.profile_picture || "https://cdn.pixabay.com/photo/2025/10/07/10/59/parrot-9878922_1280.jpg";

  return (
    <div className="bg-blue-50 overflow-hidden h-screen w-screen">
      <div className="flex justify-between items-center h-14 mr-3">
        <Link to="/dashboard" className="ml-4 mt-4">
          <img
            src={Coat}
            alt="Embassy Logo"
            className="inline-block w-10 h-10 object-contain"
          />
        </Link>
        <div>
          <label className="input rounded-lg h-8 px-2 flex items-center gap-2">
            <svg
              className="h-[1em] opacity-50"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
            >
              <g
                strokeLinejoin="round"
                strokeLinecap="round"
                strokeWidth="2.5"
                fill="none"
                stroke="currentColor"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.3-4.3"></path>
              </g>
            </svg>
            <input type="search" className="grow" placeholder="Search" />
            <kbd className="kbd kbd-sm">⌘</kbd>
            <kbd className="kbd kbd-sm">K</kbd>
          </label>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/user">
            <img
              src={userProfilePicture}
              alt="User Avatar"
              className="w-8 h-8 rounded-full object-cover"
            />
          </Link>
        </div>
      </div>
      <div className="drawer lg:drawer-open">
        {/* defaultChecked  */}
        <input id="my-drawer-4" type="checkbox" className="drawer-toggle"/>
        <div className="drawer-content mr-4 mt-3 bg-white border border-gray-300 rounded-2xl shadow-0 flex flex-col max-h-[calc(100vh-5rem)]">
          <div className="flex-1 overflow-auto no-scrollbar">
            <Outlet />
          </div>
          {/* <FooterBottom /> */}
        </div>
        <div className="drawer-side is-drawer-close:overflow-visible">
          <label
            htmlFor="my-drawer-4"
            aria-label="close sidebar"
            className="drawer-overlay"
          ></label>
          <div className="flex min-h-[calc(100vh-5.3rem)] is-drawer-open:bg-blue-50 mt-4 is-drawer-open:overflow-hidden is-drawer-close:overflow-visible flex-col items-start justify-between is-drawer-close:w-15 is-drawer-open:w-70">
            <ul className="menu w-full grow">
              {navigationLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }: { isActive: boolean }) =>
                        `is-drawer-close:tooltip is-drawer-close:tooltip-right hover:bg-blue-200 hover:rounded-2xl ${
                          isActive
                            ? "bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700"
                            : "bg-blue-50 rounded-2xl"
                        }`
                      }
                      data-tip={link.label}
                    >
                      <Icon className="my-1.5 inline-block size-5.5" />
                      <span className="is-drawer-close:hidden font-medium">
                        {link.label}
                      </span>
                    </NavLink>
                  </li>
                );
              })}
            </ul>
            <ul className="menu w-full border-t border-gray-300 pt-2">
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="My Profile"
              >
                <Link to="/user">
                  <img
                    src={userProfilePicture}
                    alt="User Avatar"
                    className="my-1.5 inline-block size-6 rounded-full object-cover"
                  />
                  <span className="is-drawer-close:hidden">My Profile</span>
                </Link>
              </li>
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Collapse Sidebar"
              >
                 <label
              htmlFor="my-drawer-4"
              aria-label="open sidebar"
            >
              <RiSidebarUnfoldLine className="size-5.5" />
                <span className="is-drawer-close:hidden">Collapse Sidebar</span>
            </label>
              </li>
              <li
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip="Logout"
              >
                <Link to="/logout">
                  <RiLogoutBoxRLine className="my-1.5 inline-block size-5.5" />
                  <span className="is-drawer-close:hidden">Logout</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
