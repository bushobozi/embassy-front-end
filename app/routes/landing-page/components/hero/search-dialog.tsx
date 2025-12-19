import { forwardRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { Button } from "~/components";

type LinkItem = {
  name: string;
  url: string;
  description?: string;
};

type Props = {
  results: LinkItem[];
  query: string;
  onClose: () => void;
};

export default forwardRef<HTMLDialogElement, Props>(function SearchDialog(
  { results, query, onClose },
  ref
) {
  const handleDialogClick = (e: React.MouseEvent<HTMLDialogElement>) => {
    if (e.target === e.currentTarget) onClose();
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDialogElement>) => {
    if (e.key === "Escape") onClose();
  };

  return (
    <>
      <style>{`dialog::backdrop { background: rgba(0,0,0,0.45); }`}</style>

      <dialog
        ref={ref}
        className="fixed z-50 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-2xl p-6 w-full max-w-3xl max-h-[80vh] overflow-auto"
        aria-label="Search results"
        onClick={handleDialogClick}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-2xl font-semibold">Search results</h3>
          <Button
            onClick={onClose}
            variant="ghost"
            size="md"
            aria-label="Close search results"
          >
            <FaXmark className="text-2xl" />
          </Button>
        </div>

        {results.length === 0 ? (
          <p className="text-sm text-gray-600">
            No links found for "{query}". Try another term.
          </p>
        ) : (
          <ul className="space-y-3">
            {results.map((r) => (
              <li
                key={r.url}
                className="p-3 border-l-3 border-gray-200 rounded bg-white"
              >
                <a
                  href={r.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-indigo-600 font-medium hover:underline"
                >
                  {r.name}
                </a>
                {r.description ? (
                  <p className="text-sm text-gray-600 mt-1">{r.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </dialog>
    </>
  );
});
