import { Button, PublicationCard, Banner } from "~/components";
import { useNavigate, useSearchParams } from "react-router";
import { useState, useMemo, useEffect } from "react";
import { apolloClient } from "~/apolloClient";
import { useAuth } from "~/contexts/AuthContext";
import { GET_EMBASSY_PUBLICATIONS } from "~/routes/publications/components/graphql";

export type Publication = {
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

export type PublicationQueryResponse = {
  publications: Array<{
    id: number;
    title: string;
    cover_image?: string;
    publication_type?: string;
    content: string;
    created_at: string;
    updated_at: string;
    created_by?: string;
    embassy_name?: string;
    embassy_picture?: string;
  }>;
};

const PUBLICATION_TAGS = [
  { value: "GENERAL", label: "General" },
  { value: "CULTURE", label: "Culture" },
  { value: "EDUCATION", label: "Education" },
  { value: "HEALTH", label: "Health" },
  { value: "SCIENCE", label: "Science" },
  { value: "NEWSLETTER", label: "Newsletter" },
  { value: "TRADE", label: "Trade" },
  { value: "TOURISM", label: "Tourism" },
  { value: "EVENTS", label: "Events" },
  { value: "ALERTS", label: "Alerts" },
  { value: "OTHER", label: "Other" },
] as const;

const ITEMS_PER_PAGE = 25;

// Export for use in other files
export { PUBLICATION_TAGS, ITEMS_PER_PAGE };

function EmbassyPublications() {
  const { user } = useAuth();
  const embassyId = user?.embassy_id;
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const embassyIdFromUrl = searchParams.get("embassyId");
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [displayCount, setDisplayCount] = useState(ITEMS_PER_PAGE);
  const [publications, setPublications] = useState<Publication[]>([]);

  const filteredPublications = useMemo(() => {
    let filtered = publications;
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
  }, [selectedTag, embassyIdFromUrl, publications]);

  const displayedPublications = filteredPublications.slice(0, displayCount);
  const hasMoreData = displayCount < filteredPublications.length;

  const handleLoadMore = () => {
    setDisplayCount((prev) => prev + ITEMS_PER_PAGE);
  };

  const handleTagChange = (tag: string | null) => {
    setSelectedTag(tag);
    setDisplayCount(ITEMS_PER_PAGE);
  };

  const fetchPublications = async () => {
    if (!embassyId) {
      setError("Embassy ID not found");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const variables = {
        embassy_id: embassyId,
        page: 1,
        limit: 25,
        // status: "published",
      };
      const result = await apolloClient.query<PublicationQueryResponse>({
        query: GET_EMBASSY_PUBLICATIONS,
        variables,
        fetchPolicy: "network-only",
      });

      if (result.data?.publications) {
        const mappedPublications: Publication[] = result.data.publications.map(
          (pub: any) => ({
            id: pub.id,
            title: pub.title,
            cover: pub.cover_image || "",
            tag: pub.publication_type || "GENERAL",
            type: pub.publication_type || "article",
            content: pub.content,
            created_at: pub.created_at,
            updated_at: pub.updated_at,
            created_by: {
              id: 0, // Not provided in GraphQL response
              name: pub.created_by || "Unknown",
              profile_picture: "",
            },
            views: 0, // Not provided in GraphQL response
            embassy: {
              id: 0,
              name: pub.embassy_name || "",
              picture: pub.embassy_picture || "",
            },
          })
        );
        setPublications(mappedPublications);
      } else {
        console.log("No publications in response");
      }
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Failed to fetch publications"
      );
    } finally {
      setLoading(false);
    }
  };

  const refreshPublications = async () => {
    setRefreshing(true);
    try {
      await fetchPublications();
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPublications();
  }, [embassyId]);

  return (
    <div className="w-full pb-8 pt-0">
      <div className="relative">
        <Banner>My Embassy News Updates</Banner>
      </div>
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h1 className="lg:text-3xl text-xl font-bold text-gray-900">My Publications</h1>
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
        <div className="flex gap-2">
          <Button
            variant="secondary"
            className="cursor-pointer tooltip tooltip-bottom"
            data-tip="Create a new publication"
            size="md"
            onClick={() => navigate("/publications_write")}
          >
            Create Publication
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={refreshPublications}
            className="cursor-pointer tooltip tooltip-left"
            data-tip="Refresh publications list"
            disabled={refreshing}
          >
            {refreshing ? (
              <>
                <span className="loading loading-spinner loading-sm mr-2"></span>
                Refreshing...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => handleTagChange(null)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              selectedTag === null
                ? "bg-blue-600 text-white shadow-0"
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
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            <p>{error}</p>
          </div>
        )}
        {loading && (
          <div className="grid place-content-center h-full">
            <div className="flex w-52 flex-col gap-4">
              <div className="skeleton h-32 w-full"></div>
              <div className="skeleton h-4 w-28"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
            </div>
          </div>
        )}
        {!loading && displayedPublications.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No publications found for this filter.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              {displayedPublications.map((pub) => (
                <article
                  key={pub.id}
                  className="bg-white rounded-2xl border border-gray-200 overflow-hidden hover:shadow-sm transition-shadow duration-300 flex flex-col tooltip tooltip-bottom"
                  data-tip={pub.title}
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

export default EmbassyPublications;
