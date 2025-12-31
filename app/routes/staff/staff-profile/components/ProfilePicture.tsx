import { useState } from "react";
import { Button } from "~/components";
import { RiPencilLine } from "react-icons/ri";

interface ProfilePictureProps {
  photo: string | null;
  staffId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function ProfilePicture({
  photo,
  staffId,
  token,
  onUpdateSuccess,
}: ProfilePictureProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState("");

  const URL = import.meta.env.VITE_API_URL;
  const STAFF_UPDATE_URL = `${URL}/staff/${staffId}`;

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setPhotoFileName(file.name);
    setIsUploading(true);
    setError(null);

    try {
      // Convert file to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = reader.result as string;

        try {
          const response = await fetch(STAFF_UPDATE_URL, {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ photo: base64String }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to update photo");
          }

          setIsEditing(false);
          onUpdateSuccess();
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsUploading(false);
        }
      };

      reader.onerror = () => {
        setError("Failed to read image file");
        setIsUploading(false);
      };

      reader.readAsDataURL(file);
    } catch (err: any) {
      setError(err.message);
      setIsUploading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col items-center">
        <div className="avatar">
          <div className="w-50 h-50 mask mask-squircle ring ring-primary ring-offset-base-100 ring-offset-2">
            <img
              src={
                photo ||
                "https://img.daisyui.com/images/profile/demo/2@94.webp"
              }
              alt="Staff Profile"
            />
          </div>
        </div>
        {!isEditing && (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
            className="mt-4"
          >
            Upload Photo <RiPencilLine className="ml-2" size="16" />
          </Button>
        )}

        {isEditing && (
          <div className="mt-4 w-full">
            <label className="label">
              <span className="label-text">Upload New Photo</span>
            </label>
            <input
              type="file"
              className="file-input file-input-bordered w-full"
              onChange={handlePhotoChange}
              accept="image/*"
              disabled={isUploading}
            />
            {photoFileName && (
              <p className="text-sm text-gray-600 mt-2">
                Selected: {photoFileName}
              </p>
            )}
            {isUploading && (
              <p className="text-sm text-blue-600 mt-2">
                <span className="loading loading-spinner loading-sm"></span>{" "}
                Uploading...
              </p>
            )}
            <div className="flex gap-2 mt-3">
              <Button
                onClick={() => {
                  setIsEditing(false);
                  setError(null);
                  setPhotoFileName("");
                }}
                variant="outline"
                size="sm"
                block={true}
                disabled={isUploading}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {error && (
          <div className="alert alert-error mt-4">
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>
    </div>
  );
}
