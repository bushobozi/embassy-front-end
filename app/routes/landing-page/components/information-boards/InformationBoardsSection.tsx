export interface PublicBoard {
  id?: string;
  title: string;
  category?: string;
  image?: string;
  attachments?: string[];
  description: string;
  location?: string;
  embassy?: {
    name: string;
    embassy_picture?: string;
    country: string;
    city: string;
  };
}

interface PublicBoardCardProps {
  board: PublicBoard;
}

function PublicBoardCard({ board }: PublicBoardCardProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 bg-white border border-gray-200 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
      {board.image && (
        <div className="relative w-full md:w-72 h-48 md:h-auto shrink-0">
          <img
            className="absolute left-0 top-0 w-full h-full object-cover object-center rounded-2xl"
            loading="lazy"
            src={board.image}
            alt={board.title}
          />
        </div>
      )}

      <div className="flex-1 flex flex-col gap-3 p-4">
        <h3 className="text-xl font-bold text-gray-900">{board.title}</h3>

        <div className="flex flex-wrap gap-2">
          {board.category && (
            <span className="px-3 py-1 text-sm rounded-full bg-blue-100 text-blue-800">
              {board.category}
            </span>
          )}
          {(board.location || board.embassy) && (
            <span className="px-3 py-1 text-sm rounded-full bg-gray-100 text-gray-700">
              {board.location || `${board.embassy?.city}, ${board.embassy?.country}`}
            </span>
          )}
        </div>

        <p className="text-gray-600 line-clamp-3">
          {board.description}
        </p>

        {board.attachments && board.attachments.length > 0 && (
          <div className="flex items-center text-blue-600 mt-auto">
            <svg
              className="w-4 h-4 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z"
                clipRule="evenodd"
              />
            </svg>
            <a
              href={board.attachments[0]}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline"
              download
            >
              View Attachment
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

interface ApiResponse {
  data: PublicBoard[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface InformationBoardsSectionProps {
  boards: ApiResponse | null;
  loading: boolean;
  error: string | null;
}

export default function InformationBoardsSection({
  boards,
  loading,
  error
}: InformationBoardsSectionProps) {
  const boardsList = boards?.data ?? [];

  if (loading) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-start text-gray-900 mb-8">
            Information Boards
          </h2>
          <div className="flex justify-center items-center py-8">
            <span className="loading loading-spinner loading-lg"></span>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="py-12 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-start text-gray-900 mb-8">
            Information Boards
          </h2>
          <p className="text-start text-red-500">Unable to load information boards.</p>
        </div>
      </section>
    );
  }

  if (boardsList.length === 0) {
    return null;
  }

  return (
    <section className="py-12 px-4 bg-white" aria-labelledby="boards-heading">
      <div className="max-w-7xl mx-auto">        
        <h2
        id="boards-heading"
        className="text-5xl font-semibold mb-4 border-b pb-4 border-gray-200"
      >
          Information Boards
      </h2>
        <div className="grid gap-6 md:grid-cols-1">
          {boardsList.map((board) => (
            <PublicBoardCard key={board.id || board.title} board={board} />
          ))}
        </div>
      </div>
    </section>
  );
}
