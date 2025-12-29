import { useState } from "react";
import { RiPencilLine } from "react-icons/ri";
import Button from "~/components/buttons/Button";

interface PersonalInformationProps {
  id: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  dateOfBirth: string;
  gender: string | null;
  address: string | null;
  socialMediaLinks: {
    linkedin: string;
    twitter: string;
  } | null;
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function PersonalInformation({
  id,
  firstName,
  middleName,
  lastName,
  email,
  phoneNumber,
  dateOfBirth,
  gender,
  address,
  socialMediaLinks,
  userId,
  token,
  onUpdateSuccess,
}: PersonalInformationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    first_name: firstName,
    middle_name: middleName || "",
    last_name: lastName,
    email: email,
    phone_number: phoneNumber || "",
    date_of_birth: dateOfBirth,
    address: address || "",
    social_media_links: {
      linkedin: socialMediaLinks?.linkedin || "",
      twitter: socialMediaLinks?.twitter || "",
    },
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
          errorData.message || "Failed to update personal information"
        );
      }

      (
        document.getElementById("personal_info_modal") as HTMLDialogElement
      )?.close();
      onUpdateSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800 text-2xl">
          Person Information 
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            (
              document.getElementById(
                "personal_info_modal"
              ) as HTMLDialogElement
            )?.showModal()
          }
        >
          <RiPencilLine size="16" />
        </Button>
      </div>

      <div className="space-y-3 w-full mt-3">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <p className="text-xs text-gray-500 mb-1">First Name</p>
            <p className="font-medium text-gray-800">{firstName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Middle name</p>
            <p className="font-medium text-gray-800">{middleName || "---"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Last name</p>
            <p className="font-medium text-gray-800">{lastName}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="font-medium text-gray-800 text-sm break-all">
              {email}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Phone</p>
            <p className="font-medium text-gray-800">{phoneNumber || "---"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">DOB</p>
            <p className="font-medium text-gray-800">{dateOfBirth}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Gender</p>
            <p className="font-medium text-gray-800">{gender || "---"}</p>
          </div>
          <div className="col-span-3">
            <p className="text-xs text-gray-500 mb-1">Address</p>
            <p className="font-medium text-gray-800">{address || "---"}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">LinkedIn</p>
            {socialMediaLinks?.linkedin ? (
              <a
                href={socialMediaLinks.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline text-sm break-all"
              >
                {socialMediaLinks.linkedin}
              </a>
            ) : (
              <p className="font-medium text-gray-800">---</p>
            )}
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Twitter</p>
            {socialMediaLinks?.twitter ? (
              <a
                href={socialMediaLinks.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:underline text-sm break-all"
              >
                {socialMediaLinks.twitter}
              </a>
            ) : (
              <p className="font-medium text-gray-800">---</p>
            )}
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="personal_info_modal" className="modal">
        <div className="modal-box max-w-2xl">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">Edit Personal Information</h3>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                  <span>{error}</span>
                </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">First Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full mt-3"
                  value={formData.first_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      first_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Middle Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full mt-3"
                  value={formData.middle_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      middle_name: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Last Name</span>
                </label>
                <input
                  type="text"
                  className="input input-bordered w-full mt-3"
                  value={formData.last_name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      last_name: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  className="input input-bordered w-full mt-3"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>

              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Phone Number</span>
                </label>
                <input
                  type="tel"
                  className="input input-bordered w-full mt-3"
                  value={formData.phone_number}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      phone_number: e.target.value,
                    }))
                  }
                />
              </div>

              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Date of Birth</span>
                  <span className="text-gray-400">(Current - {formData.date_of_birth})</span>
                </label>
                <input
                  type="date"
                  className="input input-bordered w-full mt-3"
                  value={formData.date_of_birth}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      date_of_birth: e.target.value,
                    }))
                  }
                />
              </div>
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.address}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, address: e.target.value }))
                }
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">LinkedIn</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full mt-3"
                  placeholder="https://linkedin.com/in/username"
                  value={formData.social_media_links.linkedin}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social_media_links: {
                        ...prev.social_media_links,
                        linkedin: e.target.value,
                      },
                    }))
                  }
                />
              </div>

              <div className="form-control w-full mt-3">
                <label className="label">
                  <span className="label-text">Twitter</span>
                </label>
                <input
                  type="url"
                  className="input input-bordered w-full mt-3"
                  placeholder="https://twitter.com/username"
                  value={formData.social_media_links.twitter}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      social_media_links: {
                        ...prev.social_media_links,
                        twitter: e.target.value,
                      },
                    }))
                  }
                />
              </div>
            </div>

            <div className="modal-action">
              <Button
                type="button"
                  variant="outline"
                  size="md"
                onClick={() =>
                  (
                    document.getElementById(
                      "personal_info_modal"
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
