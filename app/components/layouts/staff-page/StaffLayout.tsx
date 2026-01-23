import { Outlet, Link } from "react-router";
import FooterBottom from "../dashboard/FooterBottom";
import ImportantLinks from "../home-layout/important-links";
import BackButton from "~/components/buttons/BackButton";
import NewsCard from "~/components/news-card/NewsCard";

const staffQuickLinks = [
  { name: "Staff Overview", href: "/embassy_staff" },
   { name: "Embassy Users", href: "/embassy_staff_users" },
  { name: "Add Staff", href: "/embassy_staff_add" }, 
];

export default function StaffLayout() {
  return (
    <div className="w-full h-screen flex items-stretch relative container-fluid mx-auto overflow-hidden">
      <aside className="hidden lg:block lg:w-1/6 flex-none p-6 sticky top-0 self-stretch h-full">
      <BackButton />
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
        <NewsCard />
      </aside>
      <div className="overflow-auto w-full lg:w-2/3 no-scrollbar">
        <main className="flex-1 flex-col min-w-0 p-0 pb-12 bg-gray-50/20 mx-2">
          <Outlet />
        </main>
      </div>
      <div className="hidden lg:block lg:w-1/6 p-4 sticky top-0 self-stretch h-full">
        <div className="mt-3">
          <ImportantLinks />
          <p className="text-gray-500 text-sm mt-8">
            Incase of any issues associated with staff management. Please reach
            out to the system admin through the link below:
            <a
              href="#!"
              className="font-semibold mx-2 text-gray-600 hover:underline focus:text-gray-800 focus:outline-none"
            >
              Contact System Admin
            </a>
          </p>
          <hr className="my-8 border-t border-gray-300" />
          <FooterBottom />
        </div>
      </div>
    </div>
  );
}
