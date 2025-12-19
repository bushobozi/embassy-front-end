import { Button } from "~/components";
import { Link, useNavigate, useSearchParams } from "react-router";
import { useState, useMemo } from "react";
import { FaChevronRight } from "react-icons/fa6";
import publicationsData from "./data.json";

type Publication = {
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
};

const PUBLICATION_TAGS = [
  { value: "GENERAL", label: "General" },
  { value: "CULTURE", label: "Culture" },
  { value: "EDUCATION", label: "Education" },
  { value: "TRADE", label: "Trade" },
  { value: "TOURISM", label: "Tourism" },
  { value: "EVENTS", label: "Events" },
  { value: "ALERTS", label: "Alerts" },
  { value: "OTHER", label: "Other" },
] as const;

const ITEMS_PER_PAGE = 10;

export default function Publications() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const embassyIdFromUrl = searchParams.get("embassyId");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);

  // Filter and paginate publications
  const filteredPublications = useMemo(() => {
    let filtered = publicationsData as Publication[];

    // Filter by tag
    if (selectedTag) {
      filtered = filtered.filter(
        (pub) => pub.tag.toUpperCase() === selectedTag
      );
    }

    // Filter by embassy ID
    if (embassyIdFromUrl) {
      const embassyId = parseInt(embassyIdFromUrl, 10);
      filtered = filtered.filter((pub) => pub.embassy.id === embassyId);
    }

    return filtered;
  }, [selectedTag, embassyIdFromUrl]);

  const displayedPublications = filteredPublications.slice(0, displayCount);
  const hasMoreData = displayCount < filteredPublications.length;

  const handleRefresh = () => {
    setDisplayCount(ITEMS_PER_PAGE);
    setSelectedTag(null);
  };

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const formatShortDate = (iso: string) => {
    const d = new Date(iso);
    const month = d.toLocaleString("en-US", { month: "long" });
    const day = d.getDate();
    const year = d.getFullYear();
    return `${day} ${month}, ${year}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-0 pb-8 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Publications</h1>
          {embassyIdFromUrl && (
            <button
              onClick={() => {
                searchParams.delete("embassyId");
                navigate({ search: searchParams.toString() });
              }}
              className="px-3 py-1.5 text-sm bg-yellow-100 hover:bg-yellow-200 text-gray-900 rounded-full border border-yellow-300 transition-colors"
            >
              Clear Embassy Filter
            </button>
          )}
        </div>
        <Button
          variant="outline"
          size="md"
          rounded={true}
          onClick={handleRefresh}
          className="flex items-center gap-2"
        >
          Refresh
        </Button>
      </div>

      {/* Tag Filter Buttons */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTagChange(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedTag === null
                ? "bg-blue-600 text-white shadow-sm"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            }`}
          >
            All
          </button>
          {PUBLICATION_TAGS.map((tag) => (
            <button
              key={tag.value}
              onClick={() => handleTagChange(tag.value)}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all cursor-pointer ${
                selectedTag === tag.value
                  ? "bg-blue-600 text-white shadow-sm cursor-pointer"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 cursor-pointer"
              }`}
            >
              {tag.label.toUpperCase()}
            </button>
          ))}
        </div>
      </div>
      <div>
        {displayedPublications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No publications found for this filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {displayedPublications.map((pub) => (
                <article
                  key={pub.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow duration-300 flex flex-col"
                >
                  <Link
                    to={`/read_publications_press_news_blog/${pub.id}`}
                    className="block"
                  >
                    <div className="relative h-120 bg-white overflow-hidden">
                      <div className="relative">
                        <div className="flex items-center justify-center gap-2 absolute top-0 right-3 z-10 p-2">
                          <button
                            type="button"
                            onClick={() =>
                              navigate(
                                `/read_publications_press_news_blog/${pub.id}`
                              )
                            }
                            aria-label="View publication"
                             data-tip="View publication"
                            className="rounded-full tooltip tooltip-left w-10 h-10 cursor-pointer hover:border-blue-700 bg-blue-300/70 grid place-content-center hover:bg-blue-200/50 transition-colors"
                          >
                            <span className="flex justify-center gap-4 items-center w-full">
                              <FaChevronRight className="text-xl text-gray-950" />
                            </span>
                          </button>
                        </div>
                      </div>
                      <img
                        src={
                          pub.cover || "https://via.placeholder.com/400x300?text=No+Image"
                        }
                        alt={pub.title || "Publication cover"}
                        className="w-full h-full object-cover transition-transform duration-300 rounded-b-2xl"
                      />
                    </div>
                  </Link>
                  <div className="p-5 flex flex-col grow">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 rounded-full overflow-hidden ring-2 ring-gray-200">
                        <img
                          src={
                            pub.embassy.picture || "https://via.placeholder.com/32"
                          }
                          alt={pub.embassy.name || "Embassy"}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {pub.embassy.name || "Embassy"}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatShortDate(pub.created_at)}
                        </p>
                      </div>
                    </div>

                    {/* Title */}
                    <Link
                      to={`/read_publications_press_news_blog/${pub.id}`}
                      className="block mb-3"
                    >
                      <h2 className="text-xl font-bold text-gray-900 hover:text-indigo-600 transition-colors line-clamp-2">
                        {pub.title || "Untitled Publication"}
                      </h2>
                    </Link>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {pub.type && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-indigo-100 text-indigo-800">
                          {pub.type}
                        </span>
                      )}
                      {pub.tag && (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-800">
                          {pub.tag.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div
                      className="text-gray-600 text-sm mb-4 line-clamp-3 flex-grow"
                      dangerouslySetInnerHTML={{
                        __html:
                          pub.content?.slice(0, 150) + "..." ||
                          "No content available",
                      }}
                    />
                  </div>
                </article>
              ))}
            </div>

            {/* Load More */}
            {hasMoreData && (
              <div className="flex justify-center mt-12 mb-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLoadMore}
                  className="min-w-[200px] px-8 py-3"
                >
                  Load More Publications
                </Button>
              </div>
            )}

            {/* End of Results Message */}
            {!hasMoreData && displayedPublications.length > 0 && (
              <p className="text-center text-gray-500 py-8 text-sm">
                You've reached the end of the publications list
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
