import { useState } from "react";
import type { StaffBody } from "../../types/staff-body/StaffBody";
import { Button } from "~/components";
import { RiPencilLine } from "react-icons/ri";

interface PersonalInformationProps {
  staffInfo: StaffBody;
  staffId: string;
  token: string;
  onUpdateSuccess: () => void;
  formatDate: (dateString: string | null) => string;
}

export default function PersonalInformation({
  staffInfo,
  staffId,
  token,
  onUpdateSuccess,
  formatDate,
}: PersonalInformationProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: staffInfo.first_name || "",
    middle_name: staffInfo.middle_name || "",
    last_name: staffInfo.last_name || "",
    email: staffInfo.email || "",
    phone: staffInfo.phone || "",
    gender: staffInfo.gender || "",
    date_of_birth: staffInfo.date_of_birth || "",
    marital_status: staffInfo.marital_status || "",
    religion: staffInfo.religion || "",
    nationality: staffInfo.nationality || "",
    country: staffInfo.country || "",
    city: staffInfo.city || "",
    address: staffInfo.address || "",
    id_type: staffInfo.id_type || "",
    id_number: staffInfo.id_number || "",
    id_issue_date: staffInfo.id_issue_date || "",
    id_expiry_date: staffInfo.id_expiry_date || "",
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
        throw new Error(errorData.message || "Failed to update information");
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
      first_name: staffInfo.first_name || "",
      middle_name: staffInfo.middle_name || "",
      last_name: staffInfo.last_name || "",
      email: staffInfo.email || "",
      phone: staffInfo.phone || "",
      gender: staffInfo.gender || "",
      date_of_birth: staffInfo.date_of_birth || "",
      marital_status: staffInfo.marital_status || "",
      religion: staffInfo.religion || "",
      nationality: staffInfo.nationality || "",
      country: staffInfo.country || "",
      city: staffInfo.city || "",
      address: staffInfo.address || "",
      id_type: staffInfo.id_type || "",
      id_number: staffInfo.id_number || "",
      id_issue_date: staffInfo.id_issue_date || "",
      id_expiry_date: staffInfo.id_expiry_date || "",
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Personal Information
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Basic Information */}
        <div>
          <label className="label">
            <span className="label-text font-medium">First Name</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.first_name}
              onChange={(e) =>
                setFormData({ ...formData, first_name: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.first_name || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Middle Name</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.middle_name}
              onChange={(e) =>
                setFormData({ ...formData, middle_name: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.middle_name || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Last Name</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.last_name}
              onChange={(e) =>
                setFormData({ ...formData, last_name: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.last_name || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Email</span>
          </label>
          {isEditing ? (
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.email || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Phone</span>
          </label>
          {isEditing ? (
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.phone || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Gender</span>
          </label>
          {isEditing ? (
            <select
              value={formData.gender}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="">Select Gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <p className="text-gray-700 capitalize">
              {staffInfo.gender || "---"}
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Date of Birth</span>
          </label>
          {isEditing ? (
            <input
              type="date"
              value={formData.date_of_birth}
              onChange={(e) =>
                setFormData({ ...formData, date_of_birth: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{formatDate(staffInfo.date_of_birth)}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Marital Status</span>
          </label>
          {isEditing ? (
            <select
              value={formData.marital_status}
              onChange={(e) =>
                setFormData({ ...formData, marital_status: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="">Select Status</option>
              <option value="single">Single</option>
              <option value="married">Married</option>
              <option value="divorced">Divorced</option>
              <option value="widowed">Widowed</option>
              <option value="other">Other</option>
            </select>
          ) : (
            <p className="text-gray-700 capitalize">
              {staffInfo.marital_status || "---"}
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Religion</span>
          </label>
          {isEditing ? (
            <select
              value={formData.religion}
              onChange={(e) =>
                setFormData({ ...formData, religion: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="">Select Religion</option>
              <option value="Christianity">Christianity</option>
              <option value="Islam">Islam</option>
              <option value="Hinduism">Hinduism</option>
              <option value="Buddhism">Buddhism</option>
              <option value="Judaism">Judaism</option>
              <option value="Other">Other</option>
            </select>
          ) : (
            <p className="text-gray-700">{staffInfo.religion || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Nationality</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.nationality}
              onChange={(e) =>
                setFormData({ ...formData, nationality: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.nationality || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">Country</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.country}
              onChange={(e) =>
                setFormData({ ...formData, country: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.country || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">City</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.city || "---"}</p>
          )}
        </div>

        <div className="md:col-span-2">
          <label className="label">
            <span className="label-text font-medium">Address</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.address}
              onChange={(e) =>
                setFormData({ ...formData, address: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.address || "---"}</p>
          )}
        </div>

        {/* ID Information */}
        <div className="md:col-span-2">
          <h3 className="text-lg font-semibold text-gray-800 mt-4 mb-2">
            Identification
          </h3>
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">ID Type</span>
          </label>
          {isEditing ? (
            <select
              value={formData.id_type}
              onChange={(e) =>
                setFormData({ ...formData, id_type: e.target.value })
              }
              className="select select-bordered w-full"
            >
              <option value="">Select ID Type</option>
              <option value="passport">Passport</option>
              <option value="national_id">National ID</option>
              <option value="driver_license">Driver License</option>
            </select>
          ) : (
            <p className="text-gray-700 capitalize">
              {staffInfo.id_type?.replace("_", " ") || "---"}
            </p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">ID Number</span>
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.id_number}
              onChange={(e) =>
                setFormData({ ...formData, id_number: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{staffInfo.id_number || "---"}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">ID Issue Date</span>
          </label>
          {isEditing ? (
            <input
              type="date"
              value={formData.id_issue_date}
              onChange={(e) =>
                setFormData({ ...formData, id_issue_date: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{formatDate(staffInfo.id_issue_date)}</p>
          )}
        </div>

        <div>
          <label className="label">
            <span className="label-text font-medium">ID Expiry Date</span>
          </label>
          {isEditing ? (
            <input
              type="date"
              value={formData.id_expiry_date}
              onChange={(e) =>
                setFormData({ ...formData, id_expiry_date: e.target.value })
              }
              className="input input-bordered w-full"
            />
          ) : (
            <p className="text-gray-700">{formatDate(staffInfo.id_expiry_date)}</p>
          )}
        </div>
      </div>
    </div>
  );
}
