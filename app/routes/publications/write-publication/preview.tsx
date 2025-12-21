interface PreviewProps {
  title: string;
  content: string;
  publicationType: string;
  tags: string;
  coverImagePreview: string | null;
}

export default function Preview({
  title,
  content,
  publicationType,
  tags,
  coverImagePreview,
}: PreviewProps) {
  const tagsArray = tags
    ? tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
    : [];

  const hasContent = title || content || coverImagePreview;

  return (
    <dialog id="my_modal_2" className="modal">
      <div className="modal-box max-w-4xl">
        <h3 className="font-bold text-2xl mb-4">Publication Preview</h3>

        {!hasContent ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              Create a publication in order to have something to preview here
            </p>
          </div>
        ) : (
          <>
            {coverImagePreview && (
              <div className="mb-4">
                <img
                  src={coverImagePreview}
                  alt="Cover"
                  className="w-full h-64 object-cover rounded-lg"
                />
              </div>
            )}
            <h2 className="text-3xl font-bold mb-2">{title || "Add Title"}</h2>
            {publicationType && (
              <span className="inline-block bg-indigo-100 text-indigo-800 text-xs font-semibold px-2.5 py-0.5 rounded mb-2">
                {publicationType}
              </span>
            )}
            <div className="flex gap-2">
              {tagsArray.length > 0 && (
                <div className="flex gap-2 mb-4">
                  {tagsArray.map((tag, index) => (
                    <span
                      key={index}
                      className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <div
              className="prose max-w-none py-4"
              dangerouslySetInnerHTML={{
                __html: content || "No content available",
              }}
            />
          </>
        )}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
}
