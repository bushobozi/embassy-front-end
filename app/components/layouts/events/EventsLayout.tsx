import { Outlet, Link } from "react-router";
import Banner from "~/components/banner/Banner";

const staffQuickLinks = [
  { name: "Events Overview", href: "/events" },
];

export default function StaffLayout() {
  return (
    <div className="w-full h-screen">
    <div className="flex items-stretch sticky top-0 bg-white border-b border-b-gray-300 rounded-t-2xl container-fluid mx-auto overflow-hidden">
      <aside className="w-full md:w-1/6 flex-none p-6 sticky top-0 self-stretch h-full">
        <nav>
          <ul className="space-y-2">
            {staffQuickLinks.map((link) => {
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
      <div className="overflow-auto w-full md:w-3/4">
        <main className="flex-1 flex-col min-w-0 p-0 bg-gray-50/20 mx-2">
          <div className="w-full md:-3/4 container mx-auto">
        <Banner>Embassy Events</Banner>
        </div>  
        </main>
      </div>
      <div className="w-full md:w-1/6 p-6 sticky top-0 self-stretch h-full hidden md:block">
       <p className="text-gray-500 text-sm">
          Incase of any issues associated with events management. Please reach out to
          the system admin through the link below:
          <a
            href="#!"
            className="font-semibold mx-2 text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
          >
            Contact System Admin
          </a>
        </p>
      </div>
    </div>
     <Outlet />
    </div>
  );
}
