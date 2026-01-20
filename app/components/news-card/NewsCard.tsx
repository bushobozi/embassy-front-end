import { useState, useEffect } from "react";
import { RiNewspaperLine, RiRefreshLine, RiExternalLinkLine } from "react-icons/ri";
import { apiGet } from "~/utils/api";

type NewsHeadline = {
  title: string;
  url: string;
  imageUrl: string;
  source: string;
};

type NewsResponse = {
  headlines: NewsHeadline[];
  fetchedAt: string;
  nextRefreshAt: string;
};

export default function NewsCard() {
  const [news, setNews] = useState<NewsHeadline[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string>("");
  const URL = import.meta.env.VITE_API_URL;

  const fetchNews = async () => {
    const newsAPI = `${URL}/news/headlines`;
    try {
      setLoading(true);
      setError(null);
      const data: NewsResponse = await apiGet(
        newsAPI
      );
      setNews(data.headlines);
      setFetchedAt(data.fetchedAt);
    } catch (err: any) {
      console.error("Error fetching news:", err);
      setError(err.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="mt-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <RiNewspaperLine className="text-blue-600 w-5 h-5" />
          <h3 className="font-semibold text-gray-900">Latest News</h3>
        </div>
        <button
          onClick={fetchNews}
          disabled={loading}
          className="p-1.5 hover:bg-gray-100 rounded-full transition-colors disabled:opacity-50"
          title="Refresh news"
        >
          <RiRefreshLine
            className={`w-4 h-4 text-gray-600 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {loading && news.length === 0 ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="text-sm text-red-600 p-3 bg-red-50 rounded">
          {error}
        </div>
      ) : news.length === 0 ? (
        <div className="text-sm text-gray-500 text-center py-6">
          No news available at the moment
        </div>
      ) : (
        <div className="space-y-4">
          {news.map((headline, index) => (
            <a
              key={index}
              href={headline.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block group hover:bg-gray-50 p-2 rounded-lg transition-colors"
            >
              <div className="flex gap-3">
                {headline.imageUrl && (
                  <img
                    src={headline.imageUrl}
                    alt={headline.title}
                    className="w-16 h-16 object-cover rounded shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {headline.title}
                  </h4>
                  <div className="flex items-center gap-1 mt-1">
                    <span className="text-xs text-gray-500">
                      {headline.source}
                    </span>
                    <RiExternalLinkLine className="w-3 h-3 text-gray-400" />
                  </div>
                </div>
              </div>
            </a>
          ))}
          {fetchedAt && (
            <p className="text-xs text-gray-400 text-center pt-2 border-t">
              Updated at {formatTime(fetchedAt)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
