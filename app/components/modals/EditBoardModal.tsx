import { useState, useEffect } from "react";
import Button from "../buttons/Button";
import { apiPut } from "../../utils/api";

interface EditBoardModalProps {
  board: {
    id: string;
    title: string;
    category: string;
    description: string;
    location: string;
    is_active: boolean;
    image?: string;
    attachments?: string[];
  };
  onSuccess?: () => void;
}

const CATEGORIES = ["events", "announcements", "news", "notices", "general"];

const LOCATIONS = [
  "UGANDA",
  "KENYA",
  "TANZANIA",
  "RWANDA",
  "BURUNDI",
  "SOUTH SUDAN",
];

// Convert file to base64 string
const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

export default function EditBoardModal({ board, onSuccess }: EditBoardModalProps) {
  const URL = import.meta.env.VITE_API_URL;
  const UPDATEBOARD_URL = `${URL}/information-boards/${board.id}`;

  const [formData, setFormData] = useState({
    title: board.title,
    category: board.category,
    description: board.description,
    location: board.location,
    is_active: board.is_active,
  });

  const [image, setImage] = useState<string>(board.image || "");
  const [attachments, setAttachments] = useState<string[]>(board.attachments || []);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>("");

  // Update form when board prop changes
  useEffect(() => {
    setFormData({
      title: board.title,
      category: board.category,
      description: board.description,
      location: board.location,
      is_active: board.is_active,
    });
    setImage(board.image || "");
    setAttachments(board.attachments || []);
  }, [board]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        setImage(base64);
      } catch (err) {
        setError("Failed to upload image");
      }
    }
  };

  const handleAttachmentsUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    try {
      const base64Files = await Promise.all(files.map((file) => fileToBase64(file)));
      setAttachments((prev) => [...prev, ...base64Files]);
    } catch (err) {
      setError("Failed to upload attachments");
    }
  };

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const payload = {
        title: formData.title.trim(),
        category: formData.category,
        image: image || undefined,
        attachments: attachments.length > 0 ? attachments : undefined,
        description: formData.description.trim(),
        is_active: formData.is_active,
        location: formData.location,
      };

      await apiPut(UPDATEBOARD_URL, payload);

      // Close modal
      (document.getElementById(`edit_board_modal_${board.id}`) as HTMLDialogElement)?.close();

      // Call success callback
      onSuccess?.();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update board");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id={`edit_board_modal_${board.id}`} className="modal">
      <div className="modal-box w-11/12 max-w-5xl">
        <h3 className="font-bold text-lg mb-4">Edit Information Board</h3>

        {error && (
          <div className="alert alert-error mb-4">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div >
              <label className="label mb-2">
                <span className="label-text">Title *</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div >
              <label className="label mb-2">
                <span className="label-text">Category *</span>
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                {CATEGORIES.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
            </div>
            <div >
              <label className="label mb-2">
                <span className="label-text">Location *</span>
              </label>
              <select
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="select select-bordered w-full"
                required
              >
                {LOCATIONS.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
            <div >
              <label className="label mb-2">
                <span className="label-text">Description *</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="textarea textarea-bordered h-24 w-full"
                required
              />
            </div>
            <div >
              <label className="label mb-2">
                <span className="label-text">Image</span>
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="file-input file-input-bordered w-full"
              />
              {image && (
                <div className="mt-2">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded"
                  />
                  <Button
                    type="button"
                    onClick={() => setImage("")}
                    variant="danger"
                    size="sm"
                    className="mt-2"
                  >
                    Remove Image
                  </Button>
                </div>
              )}
            </div>
            <div >
              <label className="label mb-2">
                <span className="label-text">Attachments</span>
              </label>
              <input
                type="file"
                multiple
                onChange={handleAttachmentsUpload}
                className="file-input file-input-bordered w-full"
              />
              {attachments.length > 0 && (
                <div className="mt-2 space-y-2">
                  {attachments.map((attachment, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <span className="text-sm">Attachment {index + 1}</span>
                      <Button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        variant="danger"
                        size="sm"
                        className="mt-2"
                      >
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div >
              <label className="label cursor-pointer justify-start gap-2">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="checkbox"
                />
                <span className="label-text">Active</span>
              </label>
            </div>
          </div>
          <div className="modal-action">
            <Button
              type="button"
              variant="outline"
              size="md"
              onClick={() =>
                (document.getElementById(`edit_board_modal_${board.id}`) as HTMLDialogElement)?.close()
              }
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="md"
              disabled={isSubmitting}
            >
              {isSubmitting ? <span className="loading loading-spinner loading-md"></span> : "Update Board"}
            </Button>
          </div>
        </form>
      </div>
    </dialog>
  );
}
