import { useState } from "react";
import { Button } from "~/components";
import { RiPencilLine } from "react-icons/ri";

interface QualificationsProps {
  academicQualifications: string | null;
  professionalQualifications: string | null;
  skills: string | null;
  languages: string | null;
  staffId: string;
  token: string;
  onUpdateSuccess: () => void;
}

export default function Qualifications({
  academicQualifications,
  professionalQualifications,
  skills,
  languages,
  staffId,
  token,
  onUpdateSuccess,
}: QualificationsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    academic_qualifications: academicQualifications || "",
    professional_qualifications: professionalQualifications || "",
    skills: skills || "",
    languages: languages || "",
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
        throw new Error(errorData.message || "Failed to update qualifications");
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
      academic_qualifications: academicQualifications || "",
      professional_qualifications: professionalQualifications || "",
      skills: skills || "",
      languages: languages || "",
    });
    setIsEditing(false);
    setError(null);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-800">
          Qualifications & Skills
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

      <div className="space-y-6">
        {/* Academic Qualifications */}
        <div>
          <label className="label">
            <span className="label-text font-medium">
              Academic Qualifications
            </span>
          </label>
          {isEditing ? (
            <textarea
              value={formData.academic_qualifications}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  academic_qualifications: e.target.value,
                })
              }
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Enter academic qualifications (e.g., Bachelor's in Computer Science, Master's in Business Administration)"
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {academicQualifications || "---"}
              </p>
            </div>
          )}
        </div>

        {/* Professional Qualifications */}
        <div>
          <label className="label">
            <span className="label-text font-medium">
              Professional Qualifications
            </span>
          </label>
          {isEditing ? (
            <textarea
              value={formData.professional_qualifications}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  professional_qualifications: e.target.value,
                })
              }
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Enter professional qualifications (e.g., PMP, CPA, Six Sigma)"
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {professionalQualifications || "---"}
              </p>
            </div>
          )}
        </div>

        {/* Skills */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Skills</span>
          </label>
          {isEditing ? (
            <textarea
              value={formData.skills}
              onChange={(e) =>
                setFormData({ ...formData, skills: e.target.value })
              }
              className="textarea textarea-bordered w-full"
              rows={4}
              placeholder="Enter skills (e.g., Project Management, Data Analysis, Leadership)"
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {skills || "---"}
              </p>
            </div>
          )}
        </div>

        {/* Languages */}
        <div>
          <label className="label">
            <span className="label-text font-medium">Languages</span>
          </label>
          {isEditing ? (
            <textarea
              value={formData.languages}
              onChange={(e) =>
                setFormData({ ...formData, languages: e.target.value })
              }
              className="textarea textarea-bordered w-full"
              rows={3}
              placeholder="Enter languages spoken (e.g., English (Fluent), French (Intermediate), Spanish (Basic))"
            />
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-700 whitespace-pre-wrap">
                {languages || "---"}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
