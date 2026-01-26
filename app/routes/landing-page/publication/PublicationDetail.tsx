import { useState, useEffect } from "react";
import { Link, useParams } from "react-router";
import { Nav, FooterBottom } from "../components";
import { Button } from "~/components";

interface Publication {
  id: string;
  title: string;
  slug: string;
  content: string;
  cover_image: string;
  attachments: string[];
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

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function meta() {
  return [
    { title: "Publication" },
    { name: "description", content: "View publication details" },
  ];
}

export default function PublicationDetail() {
  const { publicationId } = useParams();
  const publicToken = import.meta.env.VITE_PUBLIC_TOKEN;
  const baseURL = import.meta.env.VITE_API_URL;
  const [publication, setPublication] = useState<Publication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPublication = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${baseURL}/publications/public/${publicationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-token": publicToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Publication not found");
      }

      const data = await response.json();
      setPublication(data);
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
    if (publicationId) {
      fetchPublication();
    }
  }, [publicationId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Nav />
        <div className="max-w-4xl mx-auto px-4 py-16">
          <div className="animate-pulse">
            <div className="skeleton h-8 w-32 mb-4"></div>
            <div className="skeleton h-12 w-3/4 mb-4"></div>
            <div className="skeleton h-6 w-48 mb-8"></div>
            <div className="skeleton h-96 w-full rounded-2xl mb-8"></div>
            <div className="space-y-4">
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-full"></div>
              <div className="skeleton h-4 w-3/4"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !publication) {
    return (
      <div className="min-h-screen bg-white">
        <Nav />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Publication Not Found
          </h1>
          <p className="text-gray-600 mb-8">
            The publication you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" type="button"  size="lg">
            <Link to="/"> <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>Back to Home</Link>
          </Button>
        </div>
        <FooterBottom />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Nav />

      {/* Hero Section with Cover Image */}
      {publication.cover_image && (
        <div className="relative h-[50vh] min-h-180 bg-gray-900">
          <img
            src={publication.cover_image}
            alt={publication.title}
            className="absolute inset-0 w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-linear-to-t from-gray-900 via-gray-900/10 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-8">
            <div className="max-w-4xl mx-auto">
              <Link
                to="/"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Home
              </Link>
              <div className="flex items-center gap-3 mb-4">
                <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500 text-white uppercase tracking-wide">
                  {publication.publication_type}
                </span>
                <span className="text-gray-300 text-sm">
                  {formatDate(publication.published_at)}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-bold text-white leading-tight">
                {publication.title}
              </h1>
            </div>
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 py-12">
        {/* Header for publications without cover image */}
        {!publication.cover_image && (
          <header className="mb-12">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
              Back to Home
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 uppercase tracking-wide">
                {publication.publication_type}
              </span>
              <span className="text-gray-500 text-sm">
                {formatDate(publication.published_at)}
              </span>
            </div>
            <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
              {publication.title}
            </h1>
          </header>
        )}

        {/* Embassy Info */}
        <div className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-200">
          {publication.embassy.embassy_picture ? (
            <img
              src={publication.embassy.embassy_picture}
              alt={publication.embassy.name}
              className="w-14 h-14 rounded-full object-cover border-2 border-gray-200"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-2xl">
              🏛️
            </div>
          )}
          <div>
            <p className="text-gray-900 font-semibold text-lg">
              {publication.embassy.name}
            </p>
            <p className="text-gray-500">
              {publication.embassy.city}, {publication.embassy.country}
            </p>
          </div>
        </div>

        {/* Tags */}
        {publication.tags && publication.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-8">
            {publication.tags.map((tag, index) => (
              <span
                key={index}
                className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Content */}
        <div
          className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: publication.content }}
        />

        {/* Attachments */}
        {publication.attachments && publication.attachments.length > 0 && (
          <div className="mt-12 pt-8 border-t border-gray-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Attachments</h3>
            <div className="grid gap-3">
              {publication.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
                  download
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                    <svg
                      className="w-5 h-5 text-blue-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-900 font-medium group-hover:text-blue-600 transition-colors">
                      Attachment {index + 1}
                    </p>
                    <p className="text-gray-500 text-sm">Click to download</p>
                  </div>
                  <svg
                    className="w-5 h-5 text-gray-400 group-hover:text-blue-600 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                    />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        )}

        {/* Share Section */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Share this article
          </h3>
          <div className="flex gap-3">
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                />
              </svg>
              Copy Link
            </button>
            <a
              href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent(publication.title)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              Share on X
            </a>
            <a
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              Share
            </a>
          </div>
        </div>
      </article>

      <FooterBottom />
    </div>
  );
}
