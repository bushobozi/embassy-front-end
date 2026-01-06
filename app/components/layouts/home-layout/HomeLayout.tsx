import { Link, Outlet, useLocation } from "react-router";
import ImportantLinks from "./important-links";

const quickInnerLinks = [
  { name: "Latest Publications", href: "/home_embassy" },
  // { name: "Overview", href: "/embassy_overview" },
  { name: "My Publications", href: "/em_my_publications" },
  { name: "Write Publication", href: "/publications_write" },
  
  // { name: "Settings", href: "/settings" },
];

export default function HomeLayout() {
  const location = useLocation();
  return (
    <div className="w-full h-screen flex items-stretch relative container-fluid mx-auto overflow-hidden">
      <aside className="w-1/6 flex-none p-6 sticky top-0 self-stretch h-full">
        <nav>
          <ul className="space-y-2">
            {quickInnerLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className={`flex items-center justify-between px-6 py-2 transition-colors duration-200 rounded-xl ${
                      isActive
                        ? "bg-blue-300/70 text-gray-950 font-semibold"
                        : "text-gray-700 hover:text-gray-900 bg-blue-100 hover:bg-blue-200/50"
                    }`}
                  >
                    <span>{link.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
      <div className="overflow-auto w-2/3">
        <main className="flex-1 flex-col min-w-0 p-0 pb-12 bg-gray-50/20 mx-2">
          <Outlet />
        </main>
      </div>
      <div className="w-1/6 flex-none p-4 sticky top-0 self-stretch h-full">
        <div className="mt-3">
          <ImportantLinks />
        </div>
      </div>
    </div>
  );
}
