import { Outlet, Link } from "react-router";
import { FaChevronLeft } from "react-icons/fa6";

export default function WritePublicationLayout() {
  return (
    <div>
      <nav>
        <Link
          to="/publications"
          className="text-gray-950 hover:text-gray-700 font-medium"
        >
          <FaChevronLeft className="inline mr-2" />
          <span className="hover:border-b-2 hover:border-gray-600 transition">
            Back to Publications
          </span>
        </Link>
      </nav>
      <div className="mb-8">
        <Outlet />
      </div>
    </div>
  );
}
