import { useState } from "react";
import { RiPencilLine } from "react-icons/ri";
import Button from "~/components/buttons/Button";

interface WorkInformationProps {
  workEmail: string | null;
  workPhoneNumber: string | null;
  role: string | null;
  department: string | null;
  position: string | null;
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function WorkInformation({
  workEmail,
  workPhoneNumber,
  role,
  department,
  position,
  userId,
  token,
  onUpdateSuccess,
}: WorkInformationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    work_email: workEmail || "",
    work_phone_number: workPhoneNumber || "",
    role: role || "",
    department: department || "",
    position: position || "",
  });

  const URL = import.meta.env.VITE_API_URL;
  const USER_URL = `${URL}/users/${userId}`;

  function formatRoleDepartment(text: string | null) {
    if (!text) return "---";
    return text.replace(/_/g, " ");
  }

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
        throw new Error(
          errorData.message || "Failed to update work information"
        );
      }

      (
        document.getElementById("work_info_modal") as HTMLDialogElement
      )?.close();
      onUpdateSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800 text-2xl">Work</h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            (
              document.getElementById("work_info_modal") as HTMLDialogElement
            )?.showModal()
          }
        >
          <RiPencilLine size="16" />
        </Button>
      </div>

      <div className="space-y-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">Work Email</p>
            <p className="font-medium text-gray-800 text-sm">
              {workEmail || "---"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Work Phone Number</p>
            <p className="font-medium text-gray-800 text-sm">
              {workPhoneNumber || "---"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Role</p>
            <p className="font-medium text-gray-800 text-sm">
              {formatRoleDepartment(role) || "---"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Department</p>
            <p className="font-medium text-gray-800 text-sm">
              {formatRoleDepartment(department) || "---"}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Position</p>
            <p className="font-medium text-gray-800 text-sm">
              {position || "---"}
            </p>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="work_info_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Edit Work Information</h3>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                  <span>{error}</span>
                </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Work Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full mt-3"
                value={formData.work_email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    work_email: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Work Phone Number</span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full mt-3"
                value={formData.work_phone_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    work_phone_number: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Department</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.department}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    department: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Position</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.position}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, position: e.target.value }))
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
                      "work_info_modal"
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
