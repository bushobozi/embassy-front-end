import { FaChevronRight } from "react-icons/fa6";
import { RiDeleteBin6Line, RiPencilLine } from "react-icons/ri";
import { useNavigate, Link } from "react-router";
import Button from "~/components/buttons/Button";

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

export interface ManagePublicationCardProps extends Publication {
  deletePublication?: (publicationId: string) => Promise<void>;
  draftPublication?: (publicationId: string) => Promise<void>;
  archivePublication?: (publicationId: string) => Promise<void>;
  publishPublication?: (publicationId: string) => Promise<void>;
  loadingState?: string;
}

function ManagePublicationCard({
  id,
  title,
  cover,
  tag,
  type,
  content,
  created_at,
  views,
  embassy,
  deletePublication,
  draftPublication,
  archivePublication,
  publishPublication,
  loadingState,
}: ManagePublicationCardProps) {
  const navigate = useNavigate();
  
  const formatShortDate = (iso: string) => {
    const d = new Date(iso);
    const month = d.toLocaleString("en-US", { month: "long" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };
  return (
    <>
      <div className="flex flex-col md:flex-row bg-white rounded-2xl shadow-md overflow-hidden h-60">
        <Link to={`/publication_detail_view_id/${id}/viewed`} className="flex-1">
          <div className="relative h-60 bg-white overflow-hidden flex flex-col">
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
              className="w-full h-full object-cover transition-transform duration-300 rounded-r-0 shadow-lg hover:scale-105"
            />
          </div>
        </Link>
        <div className="p-5 flex flex-col flex-1">
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
          <div className="mt-4 flex gap-2">
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              size="sm"
              loading={loadingState === "publishing"}
              onClick={() => {
                publishPublication?.(id.toString());
              }}
              disabled={!!loadingState}
            >
              {loadingState === "publishing" ? "Publishing..." : "Publish"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              size="sm"
              loading={loadingState === "archiving"}
              onClick={() => {
                archivePublication?.(id.toString());
              }}
              disabled={!!loadingState}
            >
              {loadingState === "archiving" ? "Archiving..." : "Archive"}
            </Button>
            <Button
              variant="outline"
              className="flex-1 cursor-pointer"
              size="sm"
              loading={loadingState === "drafting"}
              onClick={() => {
                draftPublication?.(id.toString());
              }}
              disabled={!!loadingState}
            >
              {loadingState === "drafting" ? "Drafting..." : "Draft"}
            </Button>
            <Button
              className="tooltip tooltip-top cursor-pointer"
              data-tip="Update Publication"
              variant="outline"
              size="sm"
              onClick={() => {
                navigate(`/publications_update_em/${id}/update`);
              }}
            >
              <RiPencilLine className="inline-block" size={16} />
            </Button>
            <Button
              variant="danger"
              className="flex-none cursor-pointer text-center"
              size="sm"
              loading={loadingState === "deleting"}
              onClick={() => {
                deletePublication?.(id.toString());
              }}
              disabled={!!loadingState}
            >
              {loadingState === "deleting" ? (
                "Deleting..."
              ) : (
                <>
                  <RiDeleteBin6Line className="inline-block" size={16} />
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ManagePublicationCard;
