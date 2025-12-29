import { useState } from "react";
import { RiPencilLine } from "react-icons/ri";
import Button from "~/components/buttons/Button";

interface UserHistoryTabProps {
  education: string[];
  previousEmployers: string[];
  certifications: string[];
  languages: string[];
  hireDate: string;
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function UserHistoryTab({
  education,
  previousEmployers,
  certifications,
  languages,
  hireDate,
  userId,
  token,
  onUpdateSuccess,
}: UserHistoryTabProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    education: education || [],
    previous_employers: previousEmployers || [],
    certifications: certifications || [],
    languages: languages || [],
    hire_date: hireDate || "",
  });

  const URL = import.meta.env.VITE_API_URL;
  const USER_URL = `${URL}/users/${userId}`;

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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
        throw new Error(errorData.message || "Failed to update user history");
      }

      (document.getElementById("history_modal") as HTMLDialogElement)?.close();
      onUpdateSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split("\n").filter((item) => item.trim() !== "");
    setFormData((prev) => ({ ...prev, [field]: items }));
  };

  return (
    <div className="p-0 my-6">
      <div className="bg-white border border-gray-200 rounded-xl p-5">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-semibold text-gray-800 text-2xl">
            Profile History
          </h4>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              (
                document.getElementById("history_modal") as HTMLDialogElement
              )?.showModal()
            }
          >
            <RiPencilLine size="16" />
          </Button>
        </div>

        <div className="space-y-6">
          {/* Hire Date */}
          <div>
            <p className="text-xs text-gray-500 mb-1">Hire Date</p>
            <p className="font-medium text-gray-800">{formatDate(hireDate)}</p>
          </div>

          {/* Education */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Education</p>
            {education && education.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {education.map((edu, index) => (
                  <li key={index} className="font-medium text-gray-800">
                    {edu}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-medium text-gray-800">---</p>
            )}
          </div>

          {/* Previous Employers */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Previous Employers</p>
            {previousEmployers && previousEmployers.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {previousEmployers.map((employer, index) => (
                  <li key={index} className="font-medium text-gray-800">
                    {employer}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-medium text-gray-800">---</p>
            )}
          </div>

          {/* Certifications */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Certifications</p>
            {certifications && certifications.length > 0 ? (
              <ul className="list-disc list-inside space-y-1">
                {certifications.map((cert, index) => (
                  <li key={index} className="font-medium text-gray-800">
                    {cert}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-medium text-gray-800">---</p>
            )}
          </div>

          {/* Languages */}
          <div>
            <p className="text-xs text-gray-500 mb-2">Languages</p>
            {languages && languages.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-600 rounded-full text-sm font-medium"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            ) : (
              <p className="font-medium text-gray-800">---</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="history_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Edit User History</h3>

          {error && (
            <div className="alert alert-error mb-4">
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Hire Date */}
            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Hire Date</span>
                <span className="text-gray-400">(Current Hire Date - {formatDate(hireDate)})</span>
              </label>
              <input
                type="date"
                className="input input-bordered w-full mt-3"
                value={formData.hire_date}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    hire_date: e.target.value,
                  }))
                }
              />
            </div>

            {/* Education */}
            <div className="form-control w-full flex flex-col gap-4  mt-3">
              <label className="label">
                <span className="label-text">Education (one per line)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="BS in Computer Science - MIT&#10;MBA - Harvard"
                value={formData.education.join("\n")}
                onChange={(e) => handleArrayChange("education", e.target.value)}
              />
            </div>

            {/* Previous Employers */}
            <div className="form-control w-full flex flex-col gap-4  mt-3">
              <label className="label">
                <span className="label-text">
                  Previous Employers (one per line)
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="Company A&#10;Company B"
                value={formData.previous_employers.join("\n")}
                onChange={(e) =>
                  handleArrayChange("previous_employers", e.target.value)
                }
              />
            </div>

            {/* Certifications */}
            <div className="form-control w-full flex flex-col gap-4  mt-3">
              <label className="label">
                <span className="label-text">
                  Certifications (one per line)
                </span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="PMP&#10;AWS Certified"
                value={formData.certifications.join("\n")}
                onChange={(e) =>
                  handleArrayChange("certifications", e.target.value)
                }
              />
            </div>

            {/* Languages */}
            <div className="form-control w-full flex flex-col gap-4 mt-3">
              <label className="label">
                <span className="label-text">Languages (one per line)</span>
              </label>
              <textarea
                className="textarea textarea-bordered h-24 w-full"
                placeholder="English&#10;Spanish&#10;French"
                value={formData.languages.join("\n")}
                onChange={(e) => handleArrayChange("languages", e.target.value)}
              />
            </div>

            <div className="modal-action">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  (
                    document.getElementById(
                      "history_modal"
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
