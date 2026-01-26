import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Nav, FooterBottom } from "../components";
import { Button } from "~/components";

interface Publication {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  publication_type: string;
  tags: string[];
  published_at: string;
  embassy: {
    name: string;
    embassy_picture: string;
    country: string;
    city: string;
  };
}

interface ApiResponse {
  data: Publication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function stripHtml(html: string): string {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export function meta() {
  return [
    { title: "Publications" },
    { name: "description", content: "Browse all publications" },
  ];
}

export default function PublicationsListing() {
  const publicToken = import.meta.env.VITE_PUBLIC_TOKEN;
  const baseURL = import.meta.env.VITE_API_URL;
  const [country] = useState("Uganda");
  const [publications, setPublications] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [publicationType, setPublicationType] = useState<string>("");

  const fetchPublications = async (page: number = 1) => {
    setLoading(true);
    setError(null);

    try {
      let url = `${baseURL}/publications/public/country/${country}?page=${page}&limit=12`;
      if (publicationType) {
        url += `&publication_type=${publicationType}`;
      }

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-token": publicToken,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch publications");
      }

      const data = await response.json();
      setPublications(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPublications(currentPage);
  }, [currentPage, publicationType]);

  const publicationTypes = ["article", "news", "announcement", "press_release"];

  return (
    <div className="min-h-screen bg-gray-50">
      <Nav />
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          ><Button rounded={true} variant="outline" size="lg" className="cursor-pointer tooltip tooltip-bottom" data-tip="Back to Home">Back to Home</Button>
          </Link>          
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Latest News Updates
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl">
            Stay informed with the latest news, articles, and announcements from
            embassies.
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setPublicationType("")}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                publicationType === ""
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All
            </button>
            {publicationTypes.map((type) => (
              <button
                key={type}
                onClick={() => {
                  setPublicationType(type);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-full text-sm font-medium capitalize transition-colors ${
                  publicationType === type
                    ? "bg-gray-900 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {type.replace("_", " ")}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-200"
              >
                <div className="skeleton h-48 w-full"></div>
                <div className="p-5 space-y-3">
                  <div className="skeleton h-4 w-24"></div>
                  <div className="skeleton h-6 w-full"></div>
                  <div className="skeleton h-4 w-full"></div>
                  <div className="skeleton h-4 w-3/4"></div>
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Unable to Load Publications
            </h2>
            <p className="text-gray-600 mb-8">{error}</p>
            <button
              onClick={() => fetchPublications(currentPage)}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        ) : publications && publications.data.length > 0 ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {publications.data.map((publication) => (
                <Link
                  key={publication.id}
                  to={`/publication/${publication.id}`}
                  className="group flex flex-col bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300"
                >
                  <div className="relative h-48 overflow-hidden">
                    {publication.cover_image ? (
                      <img
                        src={publication.cover_image}
                        alt={publication.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                        <span className="text-4xl">📰</span>
                      </div>
                    )}
                    <div className="absolute top-4 left-4">
                      <span className="px-3 py-1 text-xs font-medium rounded-full bg-white/90 text-gray-800 uppercase tracking-wide shadow-sm">
                        {publication.publication_type.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                  <div className="flex-1 flex flex-col p-5">
                    <p className="text-gray-500 text-sm mb-2">
                      {formatDate(publication.published_at)}
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {publication.title}
                    </h3>
                    <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">
                      {stripHtml(publication.content).slice(0, 150)}...
                    </p>
                    <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                      {publication.embassy.embassy_picture ? (
                        <img
                          src={publication.embassy.embassy_picture}
                          alt={publication.embassy.name}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm">
                          🏛️
                        </div>
                      )}
                      <div>
                        <p className="text-gray-900 font-medium text-sm">
                          {publication.embassy.name}
                        </p>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {publications.meta.totalPages > 1 && (
              <div className="flex justify-center items-center gap-2 mt-12">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Previous
                </button>
                <div className="flex gap-1">
                  {Array.from(
                    { length: publications.meta.totalPages },
                    (_, i) => i + 1
                  )
                    .filter(
                      (page) =>
                        page === 1 ||
                        page === publications.meta.totalPages ||
                        Math.abs(page - currentPage) <= 1
                    )
                    .map((page, index, array) => (
                      <span key={page}>
                        {index > 0 && array[index - 1] !== page - 1 && (
                          <span className="px-2 py-2 text-gray-400">...</span>
                        )}
                        <button
                          onClick={() => setCurrentPage(page)}
                          className={`w-10 h-10 rounded-lg transition-colors ${
                            currentPage === page
                              ? "bg-gray-900 text-white"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {page}
                        </button>
                      </span>
                    ))}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage((p) =>
                      Math.min(publications.meta.totalPages, p + 1)
                    )
                  }
                  disabled={currentPage === publications.meta.totalPages}
                  className="px-4 py-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">📰</div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              No Publications Yet
            </h2>
            <p className="text-gray-600">
              Check back later for the latest updates.
            </p>
          </div>
        )}
      </div>

      <FooterBottom />
    </div>
  );
}
