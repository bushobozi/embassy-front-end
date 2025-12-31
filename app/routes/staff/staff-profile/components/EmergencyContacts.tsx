import { useState } from "react";
import { Button } from "~/components";
import { RiPencilLine } from "react-icons/ri";

interface EmergencyContactsProps {
  emergencyContactName: string | null;
  emergencyContactRelationship: string | null;
  emergencyContactPhone: string | null;
  nextOfKinName: string | null;
  nextOfKinRelationship: string | null;
  nextOfKinPhone: string | null;
  staffId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function EmergencyContacts({
  emergencyContactName,
  emergencyContactRelationship,
  emergencyContactPhone,
  nextOfKinName,
  nextOfKinRelationship,
  nextOfKinPhone,
  staffId,
  token,
  onUpdateSuccess,
}: EmergencyContactsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    emergency_contact_name: emergencyContactName || "",
    emergency_contact_relationship: emergencyContactRelationship || "",
    emergency_contact_phone: emergencyContactPhone || "",
    next_of_kin_name: nextOfKinName || "",
    next_of_kin_relationship: nextOfKinRelationship || "",
    next_of_kin_phone: nextOfKinPhone || "",
  });

  const URL = import.meta.env.VITE_API_URL;
  const STAFF_UPDATE_URL = `${URL}/staff/${staffId}`;

  const handleUpdate = async () => {
    setIsUpdating(true);
    setError(null);

    try {
      const response = await fetch(STAFF_UPDATE_URL, {
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

      setIsEditing(false);
      onUpdateSuccess();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      emergency_contact_name: emergencyContactName || "",
      emergency_contact_relationship: emergencyContactRelationship || "",
      emergency_contact_phone: emergencyContactPhone || "",
      next_of_kin_name: nextOfKinName || "",
      next_of_kin_relationship: nextOfKinRelationship || "",
      next_of_kin_phone: nextOfKinPhone || "",
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Emergency Contacts
        </h2>
        {!isEditing ? (
          <Button
            onClick={() => setIsEditing(true)}
            variant="outline"
            size="sm"
          >
            <RiPencilLine size="16" />
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              variant="primary"
              size="sm"
            >
              {isUpdating ? "Saving..." : "Save"}
            </Button>
            <Button
              onClick={handleCancel}
              disabled={isUpdating}
              variant="outline"
              size="sm"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>

 {error && (
         <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                  <span>{error}</span>
                </div>
      )}

      <div className="space-y-8">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergency_contact_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact_name: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Enter contact name"
                />
              ) : (
                <p className="text-gray-700">
                  {emergencyContactName || "---"}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Relationship</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.emergency_contact_relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact_relationship: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g., Spouse, Parent, Sibling"
                />
              ) : (
                <p className="text-gray-700 capitalize">
                  {emergencyContactRelationship || "---"}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.emergency_contact_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emergency_contact_phone: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="+1234567890"
                />
              ) : (
                <p className="text-gray-700">
                  {emergencyContactPhone || "---"}
                </p>
              )}
            </div>
          </div>
        </div>

        <div className="divider"></div>
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Next of Kin
        </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="label">
                <span className="label-text font-medium">Name</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.next_of_kin_name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      next_of_kin_name: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="Enter next of kin name"
                />
              ) : (
                <p className="text-gray-700">{nextOfKinName || "---"}</p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Relationship</span>
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={formData.next_of_kin_relationship}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      next_of_kin_relationship: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="e.g., Spouse, Parent, Child"
                />
              ) : (
                <p className="text-gray-700 capitalize">
                  {nextOfKinRelationship || "---"}
                </p>
              )}
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Phone Number</span>
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={formData.next_of_kin_phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      next_of_kin_phone: e.target.value,
                    })
                  }
                  className="input input-bordered w-full"
                  placeholder="+1234567890"
                />
              ) : (
                <p className="text-gray-700">{nextOfKinPhone || "---"}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
