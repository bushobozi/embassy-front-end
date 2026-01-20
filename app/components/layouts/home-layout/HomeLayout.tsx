import { Link, Outlet, useLocation } from "react-router";
import ImportantLinks from "./important-links";
import FooterBottom from "../dashboard/FooterBottom";
import { EmbassyList } from "~/components/embassy-lists/EmbassyList";
import NewsCard from "~/components/news-card/NewsCard";

const quickInnerLinks = [
  { name: "Latest News", href: "/home_embassy" },
  { name: "My News Updates", href: "/em_my_publications" },
  { name: "Manage News Updates", href: "/em_manage_publications" },
  { name: "Write News Update", href: "/publications_write" },
  { name: "Information Boards", href: "/information_desk_boards" },
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
        <div className="rounded-2xl my-4">
          <h1 className="text-xl font-bold text-blue-900">
            Check other Embassies
          </h1>
        </div>
        <EmbassyList />
         <NewsCard />
      </aside>
      <div className="overflow-auto w-2/3 no-scrollbar">
        <main className="flex-1 flex-col min-w-0 p-0 pb-12 bg-gray-50/20 mx-2">
          <Outlet />
        </main>
      </div>
      <div className="w-1/6 flex-none p-4 sticky top-0 self-stretch h-full">
        <div className="mt-3">         
          <ImportantLinks />
          <p className="text-gray-500 text-sm mt-8">
            Incase of any issues associated with news management. Please reach
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
