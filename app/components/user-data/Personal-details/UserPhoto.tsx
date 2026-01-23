import { useState } from "react";
import Button from "~/components/buttons/Button";
import { RiPencilLine } from "react-icons/ri";

interface UserPhotoProps {
  profile_picture: string | null;
  firstName: string;
  lastName: string;
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function UserPhoto({
  profile_picture,
  firstName,
  lastName,
  userId,
  token,
  onUpdateSuccess,
}: UserPhotoProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const URL = import.meta.env.VITE_API_URL;
  const USER_URL = `${URL}/users/${userId}`;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(window.URL.createObjectURL(file));
    }
  };

  const convertFileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("Please select a file");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Convert file to base64
      const base64String = await convertFileToBase64(selectedFile);

      const response = await fetch(USER_URL, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          profile_picture: base64String,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to update profile picture"
        );
      }

      (
        document.getElementById("profile_picture_modal") as HTMLDialogElement
      )?.close();
      setPreviewUrl("");
      setSelectedFile(null);
      onUpdateSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="lg:w-1/3 w-full px-4">
      <div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-50 h-50 mask mask-squircle bg-gray-300 overflow-hidden ring-gray-300 ring-2">
            {profile_picture ? (
              <img
                src={profile_picture}
                alt={`${firstName} ${lastName}`}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-blue-200">
                <svg
                  className="w-16 h-16 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
            )}
          </div>
          <div className="mt-4">
            <Button
              variant="outline"
              size="sm"
              className="mt-2 cursor-pointer"
              title="Upload picture"
              onClick={() =>
                (
                  document.getElementById(
                    "profile_picture_modal"
                  ) as HTMLDialogElement
                )?.showModal()
              }
            >
              Upload Photo <RiPencilLine className="ml-2" size="16" />
            </Button>
          </div>
          <dialog id="profile_picture_modal" className="modal">
            <div className="modal-box">
              <form method="dialog">
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                  ✕
                </button>
              </form>
              <h3 className="font-bold text-lg mb-4">Update Profile Picture</h3>

              {error && (
                <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                  <span>{error}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text">Select Profile Picture</span>
                  </label>
                  <input
                    type="file"
                    className="file-input file-input-bordered w-full"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                  />
                  <label className="label">
                    <span className="label-text-alt text-gray-500">
                      Supported formats: JPG, PNG, GIF (Max 5MB)
                    </span>
                  </label>
                </div>

                {previewUrl && (
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text">Preview</span>
                    </label>
                    <div className="flex justify-center">
                      <div className="w-32 h-32 rounded-full bg-gray-300 overflow-hidden ring-gray-300 ring-2">
                        <img
                          src={previewUrl}
                          alt="Preview"
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      </div>
                    </div>
                  </div>
                )}

                <div className="modal-action">
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setPreviewUrl("");
                      setSelectedFile(null);
                      setError(null);
                      (
                        document.getElementById(
                          "profile_picture_modal"
                        ) as HTMLDialogElement
                      )?.close();
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    disabled={isLoading}
                  >
                    {isLoading ? "Uploading..." : "Save Changes"}
                  </Button>
                </div>
              </form>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  );
}
