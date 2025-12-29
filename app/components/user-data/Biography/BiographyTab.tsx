import { useState } from "react";
import { RiPencilLine } from "react-icons/ri";
import Button from "~/components/buttons/Button";

interface BiographyTabProps {
  bio: string;
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function BiographyTab({
  bio,
  userId,
  token,
  onUpdateSuccess,
}: BiographyTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    biography: bio || "",
  });

  const URL = import.meta.env.VITE_API_URL;
  const USER_URL = `${URL}/users/${userId}`;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(USER_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update biography");
      }

      (
        document.getElementById("biography_modal") as HTMLDialogElement
      )?.close();
      onUpdateSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!bio) {
    return (
      <div className="text-center py-12">
        <svg
          className="w-16 h-16 mx-auto text-gray-400 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
          />
        </svg>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          No Biography
        </h3>
        <p className="text-gray-500">
          Biography data is not available for this user.
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() =>
            (
              document.getElementById("biography_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          Add Biography <RiPencilLine className="ml-2" size="16" />
        </Button>

        {/* Edit Modal */}
        <dialog id="biography_modal" className="modal">
          <div className="modal-box max-w-2xl">
            <form method="dialog">
              <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                ✕
              </button>
            </form>
            <h3 className="font-bold text-lg mb-4">Edit Biography</h3>

            {error && (
              <div className="alert alert-error mb-4">
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Biography</span>
                </label>
                <textarea
                  className="textarea textarea-bordered h-48"
                  placeholder="Tell us about yourself..."
                  value={formData.biography}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      biography: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="modal-action">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() =>
                    (
                      document.getElementById(
                        "biography_modal"
                      ) as HTMLDialogElement
                    )?.close()
                  }
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isLoading}
                >
                  {isLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </dialog>
      </div>
    );
  }

  return (
    <div className="my-6 p-6 bg-white border border-gray-200 rounded-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-800">Biography</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            (
              document.getElementById("biography_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          <RiPencilLine size="16" />
        </Button>
      </div>
      <p className="text-gray-700 whitespace-pre-line">{bio}</p>

      {/* Edit Modal */}
      <dialog id="biography_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Edit Biography</h3>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full flex flex-col gap-6 mt-3">
              <label className="label">
                <span className="label-text">Biography</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-48 w-full"
                placeholder="Tell us about yourself..."
                value={formData.biography}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    biography: e.target.value,
                  }))
                }
              />
            </div>

            <div className="modal-action">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() =>
                  (
                    document.getElementById(
                      "biography_modal"
                    ) as HTMLDialogElement
                  )?.close()
                }
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
}
