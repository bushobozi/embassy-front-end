import { useState } from "react";
import { RiPencilLine } from "react-icons/ri";
import Button from "~/components/buttons/Button";

interface EmergencyContactsProps {
  emergencyContactName: string | null;
  emergencyContactPhone: string | null;
  emergencyContactEmail: string | null;
  emergencyContactRelationship: string | null;
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function EmergencyContacts({
  emergencyContactName,
  emergencyContactPhone,
  emergencyContactEmail,
  emergencyContactRelationship,
  userId,
  token,
  onUpdateSuccess,
}: EmergencyContactsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    emergency_contact_name: emergencyContactName || "",
    emergency_contact_phone_number: emergencyContactPhone || "",
    emergency_contact_email: emergencyContactEmail || "",
    emergency_contact_relationship: emergencyContactRelationship || "",
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
        throw new Error(
          errorData.message || "Failed to update emergency contacts"
        );
      }

      (
        document.getElementById("emergency_contacts_modal") as HTMLDialogElement
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
        <h4 className="font-semibold text-gray-800 text-2xl">
          Emergency Contacts
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            (
              document.getElementById(
                "emergency_contacts_modal"
              ) as HTMLDialogElement
            )?.showModal()
          }
        >
          <RiPencilLine size="16" />
        </Button>
      </div>

      <div className="space-y-3 grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">Emergency Contact Name</p>
          <p className="font-medium text-gray-800">
            {emergencyContactName || "---"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">
            Emergency Contact Phone Number
          </p>
          <p className="font-medium text-gray-800">
            {emergencyContactPhone || "---"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Emergency Contact Email</p>
          <p className="font-medium text-gray-800 text-sm break-all">
            {emergencyContactEmail || "---"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Relationship</p>
          <p className="font-medium text-gray-800">
            {emergencyContactRelationship || "---"}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="emergency_contacts_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Edit Emergency Contacts</h3>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                  <span>{error}</span>
                </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Emergency Contact Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.emergency_contact_name}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergency_contact_name: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">
                  Emergency Contact Phone Number
                </span>
              </label>
              <input
                type="tel"
                className="input input-bordered w-full mt-3"
                value={formData.emergency_contact_phone_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergency_contact_phone_number: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Emergency Contact Email</span>
              </label>
              <input
                type="email"
                className="input input-bordered w-full mt-3"
                value={formData.emergency_contact_email}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergency_contact_email: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Relationship</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.emergency_contact_relationship}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    emergency_contact_relationship: e.target.value,
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
                      "emergency_contacts_modal"
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
