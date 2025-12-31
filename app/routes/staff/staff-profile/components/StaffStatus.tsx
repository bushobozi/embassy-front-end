import { useState } from "react";
import { Button } from "~/components";
import { RiPencilLine } from "react-icons/ri";

interface StaffStatusProps {
  staffStatus: string | null;
  hireDate: string | null;
  isTransferred: boolean;
  transferDate: string | null;
  transferReason: string | null;
  staffId: string;
  token: string;
  onUpdateSuccess: () => void;
  formatDate: (dateString: string | null) => string;
}

export default function StaffStatus({
  staffStatus,
  hireDate,
  isTransferred,
  transferDate,
  transferReason,
  staffId,
  token,
  onUpdateSuccess,
  formatDate,
}: StaffStatusProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    staff_status: staffStatus || "",
    hire_date: hireDate || "",
    is_transferred: isTransferred,
    transfer_date: transferDate || "",
    transfer_reason: transferReason || "",
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
        throw new Error(errorData.message || "Failed to update staff status");
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
      staff_status: staffStatus || "",
      hire_date: hireDate || "",
      is_transferred: isTransferred,
      transfer_date: transferDate || "",
      transfer_reason: transferReason || "",
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Status</h2>
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

      <div className="space-y-4">
        <div>
          <label className="label">
            <span className="label-text font-medium">Staff Status</span>
          </label>
          {isEditing ? (
            <select
              value={formData.staff_status}
              onChange={(e) =>
                setFormData({ ...formData, staff_status: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="">Select Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="on_leave">On Leave</option>
              <option value="retired">Retired</option>
            </select>
          ) : (
            <p className="text-gray-700">
              <span
                className={`badge ${
                  staffStatus === "active"
                    ? "badge-success"
                    : staffStatus === "inactive"
                    ? "badge-error"
                    : staffStatus === "on_leave"
                    ? "badge-warning"
                    : "badge-neutral"
                } text-white`}
              >
                {staffStatus?.toUpperCase().replace("_", " ") || "UNKNOWN"}
              </span>
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Hire Date</span>
          </label>
          {isEditing ? (
            <input
              type="date"
              value={formData.hire_date}
              onChange={(e) =>
                setFormData({ ...formData, hire_date: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{formatDate(hireDate)}</p>
          )}
        </div>

        <div className="divider"></div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Transfer Status</span>
          </label>
          {isEditing ? (
            <select
              value={formData.is_transferred ? "yes" : "no"}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  is_transferred: e.target.value === "yes",
                })
              }
              className="select select-bordered w-full"
            >
              <option value="no">Not Transferred</option>
              <option value="yes">Transferred</option>
            </select>
          ) : (
            <p className="text-gray-700">
              <span
                className={`badge ${
                  isTransferred ? "badge-warning" : "badge-info"
                } text-white`}
              >
                {isTransferred ? "NOT TRANSFERRED" : "TRANSFERRED"}
              </span>
            </p>
          )}
        </div>

        {isEditing && formData.is_transferred ? (
          <>
            <div>
              <label className="label">
                <span className="label-text font-medium">Transfer Date</span>
              </label>
              <input
                type="date"
                value={formData.transfer_date}
                onChange={(e) =>
                  setFormData({ ...formData, transfer_date: e.target.value })
                }
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Transfer Reason</span>
              </label>
              <textarea
                value={formData.transfer_reason}
                onChange={(e) =>
                  setFormData({ ...formData, transfer_reason: e.target.value })
                }
                className="textarea textarea-bordered w-full"
                rows={13}
                placeholder="Enter transfer reason..."
              />
            </div>
          </>
        ) : null}

        {!isEditing && (
          <>
            <div>
              <label className="label">
                <span className="label-text font-medium">Transfer Date</span>
              </label>
              <p className="text-gray-700">{formatDate(transferDate)}</p>
            </div>

            <div>
              <label className="label">
                <span className="label-text font-medium">Transfer Reason</span>
              </label>
              <p className="text-gray-700">{transferReason || "---"}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
