import { Button, PublicationCard } from "~/components";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useMemo } from "react";
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
  const filteredPublications = useMemo(() => {
    let filtered = publicationsData as Publication[];
    if (selectedTag) {
      filtered = filtered.filter(
        (pub) => pub.tag.toUpperCase() === selectedTag
      );
    }
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
  return (
    <div className="max-w-7xl mx-auto px-0 pb-8 pt-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-900">
            Latest Information
          </h1>
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
                  <PublicationCard {...pub} />
                </article>
              ))}
            </div>
            {hasMoreData && (
              <div className="flex justify-center mt-12 mb-4">
                <Button
                  variant="outline"
                  size="md"
                  onClick={handleLoadMore}
                  className="min-w-50 px-8 py-3"
                >
                  Load More Publications
                </Button>
              </div>
            )}
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
