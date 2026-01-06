import { FaChevronRight } from "react-icons/fa6";
import { useNavigate, Link } from "react-router";

export interface Publication {
  id: number;
  title: string;
  cover: string;
  tag: string;
  type: string;
  content: string;
  attachment?: Array<{
    name: string;
    url: string;
  }>;
  created_at: string;
  updated_at: string;
  created_by: {
    id: number;
    name: string;
    profile_picture: string;
  };
  views: number;
  embassy: {
    id: number;
    name: string;
    picture: string;
  };
}
export const formatShortDate = (iso: string) => {
  const d = new Date(iso);
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.getDate();
  const year = d.getFullYear();
  return `${day} ${month}, ${year}`;
};
const publication: Publication = {
  id: 1,
  title: "Sample Publication Title",
  cover: "/images/sample-cover.jpg",
  tag: "News",
  type: "Article",
  content: "This is a sample content of the publication.",
  attachment: [
    {
      name: "Attachment1.pdf",
      url: "/attachments/attachment1.pdf",
    },
  ],
  created_at: "2024-01-01T12:00:00Z",
  updated_at: "2024-01-02T12:00:00Z",
  created_by: {
    id: 1,
    name: "John Doe",
    profile_picture: "/profiles/johndoe.jpg",
  },
  views: 150,
  embassy: {
    id: 1,
    name: "Sample Embassy",
    picture: "/embassies/sample-embassy.jpg",
  },
};

export default function PublicationCard({
  id,
  title,
  cover,
  tag,
  type,
  content,
  attachment,
  created_at,
  updated_at,
  created_by,
  views,
  embassy,
}: Publication) {
  const navigate = useNavigate();
  return (
    <>
      <Link to={`/publication_detail_view_id/${id}/viewed`} className="block">
        <div className="relative h-120 bg-white overflow-hidden">
          <div className="relative">
            <div className="flex items-center justify-center gap-2 absolute top-0 right-3 z-10 p-2">
              <button
                type="button"
                onClick={() =>
                  navigate(`/publication_detail_view_id/${id}/viewed`)
                }
                aria-label="View publication"
                data-tip="View publication"
                className="rounded-full tooltip tooltip-left w-10 h-10 cursor-pointer hover:border-blue-700 bg-blue-200/50 grid place-content-center hover:bg-blue-300/70 transition-colors"
              >
                <span className="flex justify-center gap-4 items-center w-full">
                  <FaChevronRight className="text-xl text-gray-950" />
                </span>
              </button>
            </div>
          </div>
          <img
            src={cover || "https://via.placeholder.com/400x300?text=No+Image"}
            alt={title || "Publication cover"}
            className="w-full h-full object-cover transition-transform duration-300 rounded-b-2xl"
          />
        </div>
      </Link>
      <div className="p-5 flex flex-col grow">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200">
            <img
              src={embassy.picture || "https://via.placeholder.com/32"}
              alt={embassy.name || "Embassy"}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {embassy.name || "Embassy"}
            </p>
            <p className="text-xs text-gray-500">
              {formatShortDate(created_at)} - {views} views
            </p>
          </div>
        </div>
        <Link
          to={`/publication_detail_view_id/${id}/viewed`}
          className="block mb-3"
        >
          <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
            {title || "Untitled Publication"}
          </h2>
        </Link>
        <div className="flex flex-wrap gap-2 mb-3">
          {type && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
              {type}
            </span>
          )}
          {tag && (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
              {tag.toUpperCase()}
            </span>
          )}
        </div>
        <div
          className="text-gray-600 text-sm mb-4 line-clamp-3 grow"
          dangerouslySetInnerHTML={{
            __html: content?.slice(0, 150) + "..." || "No content available",
          }}
        />
      </div>
    </>
  );
}
