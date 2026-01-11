import { Outlet, Link } from "react-router";
import { useState } from "react";
import ImportantLinks from "../home-layout/important-links";
import FooterBottom from "../dashboard/FooterBottom";
import UserList from "~/routes/tasks/components/users/UserList";

const staffQuickLinks = [{ name: "Tasks Overview", href: "/tasks" }];

export default function StaffLayout() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string | null>("all");
  const [selectedPriority, setSelectedPriority] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("name");

  return (
    <div className="w-full h-screen flex items-stretch relative container-fluid mx-auto overflow-hidden">
      <aside className="w-1/6 flex-none p-6 sticky top-0 self-stretch h-full">
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
        <UserList 
          selectedUserId={selectedUserId}
          onUserSelect={setSelectedUserId}
          selectedStatus={selectedStatus}
          onStatusSelect={setSelectedStatus}
          selectedPriority={selectedPriority}
          onPrioritySelect={setSelectedPriority}
        />
      </aside>
      <div className="overflow-auto w-2/3 no-scrollbar">
        <main className="flex-1 flex-col min-w-0 p-0 pb-12 bg-gray-50/20 mx-2">
          <Outlet context={{
            selectedUserId,
            selectedStatus,
            selectedPriority,
            searchQuery,
            sortBy,
            setSelectedUserId,
            setSelectedStatus,
            setSelectedPriority,
            setSearchQuery,
            setSortBy
          }} />
        </main>
      </div>
      <div className="w-full md:w-1/6 p-4 sticky top-0 self-stretch h-full hidden md:block">
        <div className="mt-3">
          <ImportantLinks />
          <p className="text-gray-500 text-sm mt-8">
            Incase of any issues associated with tasks management. Please reach
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
