import { Link } from "react-router";

export interface PublicPublication {
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

interface PublicationCardProps {
  publication: PublicPublication;
  featured?: boolean;
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

function PublicationCard({ publication, featured = false }: PublicationCardProps) {
  const excerpt = stripHtml(publication.content).slice(0, 150) + "...";

  if (featured) {
    return (
      <Link
        to={`/publication/${publication.id}`}
        className="group relative block overflow-hidden rounded-2xl bg-gray-900 h-[400px]"
      >
        {publication.cover_image && (
          <img
            src={publication.cover_image}
            alt={publication.title}
            className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:opacity-40 group-hover:scale-105 transition-all duration-500"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-500 text-white uppercase tracking-wide">
              {publication.publication_type}
            </span>
            <span className="text-gray-300 text-sm">
              {formatDate(publication.published_at)}
            </span>
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors">
            {publication.title}
          </h3>
          <p className="text-gray-300 line-clamp-2 mb-4">{excerpt}</p>
          <div className="flex items-center gap-3">
            {publication.embassy.embassy_picture ? (
              <img
                src={publication.embassy.embassy_picture}
                alt={publication.embassy.name}
                className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-white text-sm">
                🏛️
              </div>
            )}
            <div>
              <p className="text-white font-medium text-sm">{publication.embassy.name}</p>
              <p className="text-gray-400 text-xs">
                {publication.embassy.city}, {publication.embassy.country}
              </p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <Link
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
            {publication.publication_type}
          </span>
        </div>
      </div>
      <div className="flex-1 flex flex-col p-5">
        <p className="text-gray-500 text-sm mb-2">{formatDate(publication.published_at)}</p>
        <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
          {publication.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-3 mb-4 flex-1">{excerpt}</p>
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
            <p className="text-gray-900 font-medium text-sm">{publication.embassy.name}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}

interface ApiResponse {
  data: PublicPublication[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface PublicationsSectionProps {
  publications: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export default function PublicationsSection({
  publications,
  loading,
  error,
}: PublicationsSectionProps) {
  const publicationsList = publications?.data ?? [];

  if (loading) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-semibold mb-8 border-b pb-4 border-gray-200">
            Latest News Updates
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden border border-gray-200">
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
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-semibold mb-8 border-b pb-4 border-gray-200">
            Latest Publications
          </h2>
          <p className="text-red-500">Unable to load publications.</p>
        </div>
      </section>
    );
  }

  if (publicationsList.length === 0) {
    return null;
  }

  const [featured, ...rest] = publicationsList;

  return (
    <section className="py-16 px-4 bg-gray-50" aria-labelledby="publications-heading">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8 border-b pb-4 border-gray-200">
          <h2 id="publications-heading" className="text-5xl font-semibold">
            Latest News Updates
          </h2>
          <Link
            to="/publications"
            className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2 transition-colors"
          >
            View all
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
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>

        {/* Featured Publication */}
        {featured && (
          <div className="mb-8">
            <PublicationCard publication={featured} featured />
          </div>
        )}

        {/* Rest of Publications Grid */}
        {rest.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rest.slice(0, 6).map((publication) => (
              <PublicationCard key={publication.id} publication={publication} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
