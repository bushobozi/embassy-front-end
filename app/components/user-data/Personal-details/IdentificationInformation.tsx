import { useState } from "react";
import { RiPencilLine } from "react-icons/ri";
import Button from "~/components/buttons/Button";

interface IdentificationInformationProps {
  nationalIdNumber: string | null;
  passportNumber: string | null;
  driversLicenseNumber: string | null;
  userId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function IdentificationInformation({
  nationalIdNumber,
  passportNumber,
  driversLicenseNumber,
  userId,
  token,
  onUpdateSuccess,
}: IdentificationInformationProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    national_id_number: nationalIdNumber || "",
    passport_number: passportNumber || "",
    drivers_license_number: driversLicenseNumber || "",
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
          errorData.message || "Failed to update identification information"
        );
      }

      (
        document.getElementById("identification_modal") as HTMLDialogElement
      )?.close();
      onUpdateSuccess();
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex items-center justify-between my-4">
        <h4 className="font-semibold text-gray-800 text-2xl">
          Identification Information
        </h4>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            (
              document.getElementById(
                "identification_modal"
              ) as HTMLDialogElement
            )?.showModal()
          }
        >
          <RiPencilLine size="16" />
        </Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div>
          <p className="text-xs text-gray-500 mb-1">National ID Number (NIN)</p>
          <p className="font-medium text-gray-800">
            {nationalIdNumber || "---"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Passport Number</p>
          <p className="font-medium text-gray-800">{passportNumber || "---"}</p>
        </div>
        <div>
          <p className="text-xs text-gray-500 mb-1">Drivers License</p>
          <p className="font-medium text-gray-800">
            {driversLicenseNumber || "---"}
          </p>
        </div>
      </div>

      {/* Edit Modal */}
      <dialog id="identification_modal" className="modal">
        <div className="modal-box">
          <form method="dialog">
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
              ✕
            </button>
          </form>
          <h3 className="font-bold text-lg mb-4">
            Edit Identification Information
          </h3>

          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                  <span>{error}</span>
                </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">National ID Number (NIN)</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.national_id_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    national_id_number: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Passport Number</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.passport_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    passport_number: e.target.value,
                  }))
                }
              />
            </div>

            <div className="form-control w-full mt-3">
              <label className="label">
                <span className="label-text">Driver's License Number</span>
              </label>
              <input
                type="text"
                className="input input-bordered w-full mt-3"
                value={formData.drivers_license_number}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    drivers_license_number: e.target.value,
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
                      "identification_modal"
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
    </>
  );
}
