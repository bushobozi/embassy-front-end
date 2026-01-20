import { BreadCrumb } from "~/components";
import { useState } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { Button } from "~/components";
import { useNavigate } from "react-router";
export default function AddStaff() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [photoFileName, setPhotoFileName] = useState<string>("");
  const [formData, setformData] = useState({
    photo: "",
    first_name: "",
    middle_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    position: "",
    department: "",
    email: "",
    phone_number: "",
    address: "",
    city: "",
    country: "",
    languages_spoken: "",
    skills: "",
    hired_date: "",
    academic_qualifications: "",
    professional_qualifications: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_phone: "",
    next_of_kin_name: "",
    next_of_kin_relationship: "",
    next_of_kin_phone: "",
    religion: "",
    marital_status: "",
    id_type: "",
    id_number: "",
    id_issue_date: "",
    id_expiry_date: "",
    nationality: "",
    staff_status: "",
    is_transferred: false,
    transfer_date: "",
    transfer_reason: "",
    embassy_id: "",
    created_by: "",
  });
  const countries = [
    "USA",
    "Canada",
    "UK",
    "Australia",
    "Uganda",
    "Kenya",
    "Other",
  ];
  const nationalities = [
    "USA",
    "Canada",
    "UK",
    "Australian",
    "Ugandan",
    "Kenyan",
    "Other",
  ];
  const languages = [
    "English",
    "Spanish",
    "French",
    "German",
    "Chinese",
    "Other",
  ];
  const maritalStatuses = ["single", "married", "divorced", "widowed", "other"];
  const genders = ["male", "female", "other"];
  const idTypes = ["passport", "national_id", "driver_license"];
  const staffStatuses = ["active", "inactive", "on_leave", "retired"];
  const departments = [
    "Administration",
    "Consular Services",
    "Cultural Affairs",
    "Economic Affairs",
    "Political Affairs",
    "Public Diplomacy",
    "IT",
    "Other",
  ];
  const religions = [
    "Christianity",
    "Islam",
    "Hinduism",
    "Buddhism",
    "Judaism",
    "Other",
  ];
  const { user, accessToken } = useAuth();
  const embassy_id = user?.embassy_id || "";
  const initialFormData = { ...formData };
  const resetForm = () => {
    setformData(initialFormData);
  };
  const URL = import.meta.env.VITE_API_URL;
  const STAFF_URL = `${URL}/staff`;
  const goToStaffList = () => {
    navigate("/embassy_staff");
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const dateFields = [
      "date_of_birth",
      "id_issue_date",
      "id_expiry_date",
      "hired_date",
      "transfer_date",
    ];
    const payload: any = {};
    for (const key in formData) {
      if (key !== "embassy_id" && key !== "created_by") {
        const value = (formData as any)[key];
        if (value === null || value === undefined || value === "") {
          continue;
        }
        if (dateFields.includes(key) && value === "") {
          continue;
        }
        payload[key] = value;
      }
    }
    if (embassy_id) {
      payload.embassy_id = embassy_id;
    }
    try {
      const response = await fetch(STAFF_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to add staff member");
      }
      const result = await response.json();
      setSuccess("Staff member added successfully.");
      setError(null);
      resetForm();
      setPhotoFileName("");
      goToStaffList();
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Error adding staff member. Please try again.");
      }
      setSuccess(null);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <>
      <div className="my-4">
        <BreadCrumb
          links={[
            { label: "Embassy Staff Overview", href: "/embassy_staff" },
            { label: "Add Staff Member to Embassy" },
          ]}
        />
        <div className="w-full m:w-3/4 my-4">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded mb-4 w-full">
              <span>{error}</span>
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-800 p-4 rounded mb-4 w-full">
              <span>{success}</span>
            </div>
          )}
          <form
            className="space-y-6"
            onSubmit={handleSubmit}
            autoComplete="off"
            autoCorrect="off"
          >
            <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-xl">
                Personal Information
              </legend>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="firstName" className="label mb-3">
                    First Name*
                  </label>
                  <input
                    type="text"
                    id="firstName"
                    name="first_name"
                    placeholder="John"
                    value={formData.first_name}
                    onChange={(e) =>
                      setformData({ ...formData, first_name: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="middleName" className="label mb-3">
                    Middle Name
                  </label>
                  <input
                    type="text"
                    id="middleName"
                    name="middle_name"
                    placeholder="Michael"
                    value={formData.middle_name}
                    onChange={(e) =>
                      setformData({ ...formData, middle_name: e.target.value })
                    }
                    className="input w-full"
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="lastName" className="label mb-3">
                    Last Name*
                  </label>
                  <input
                    type="text"
                    id="lastName"
                    name="last_name"
                    placeholder="Doe"
                    value={formData.last_name}
                    onChange={(e) =>
                      setformData({ ...formData, last_name: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="gender" className="label mb-3">
                    Gender*
                  </label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({ ...formData, gender: e.target.value })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="dateOfBirth" className="label mb-3">
                    Date of Birth*
                  </label>
                  <input
                    type="date"
                    id="dateOfBirth"
                    name="date_of_birth"
                    value={formData.date_of_birth}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        date_of_birth: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="email" className="label mb-3">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="some@emil.com"
                    value={formData.email}
                    onChange={(e) =>
                      setformData({ ...formData, email: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="phoneNumber" className="label mb-3">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="phoneNumber"
                    name="phone_number"
                    placeholder="+1 234 567 8901"
                    value={formData.phone_number}
                    onChange={(e) =>
                      setformData({ ...formData, phone_number: e.target.value })
                    }
                    className="input w-full"
                    maxLength={13}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="country" className="label mb-3">
                    Country*
                  </label>
                  <select
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({ ...formData, country: e.target.value })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select Country</option>
                    {countries.map((country) => (
                      <option key={country} value={country}>
                        {country}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="city" className="label mb-3">
                    City*
                  </label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    placeholder="New York"
                    value={formData.city}
                    onChange={(e) =>
                      setformData({ ...formData, city: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="address" className="label mb-3">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    placeholder="123 Main St"
                    value={formData.address}
                    onChange={(e) =>
                      setformData({ ...formData, address: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="religion" className="label mb-3">
                    Religion*
                  </label>
                  <select
                    id="religion"
                    name="religion"
                    value={formData.religion}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({ ...formData, religion: e.target.value })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select Religion</option>
                    {religions.map((religion) => (
                      <option key={religion} value={religion}>
                        {religion}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="nationality" className="label mb-3">
                    Nationality*
                  </label>
                  <select
                    id="nationality"
                    name="nationality"
                    value={formData.nationality}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({ ...formData, nationality: e.target.value })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select Nationality</option>
                    {nationalities.map((nationality) => (
                      <option key={nationality} value={nationality}>
                        {nationality}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="idType" className="label mb-3">
                    ID Type*
                  </label>
                  <select
                    id="idType"
                    name="id_type"
                    value={formData.id_type}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({ ...formData, id_type: e.target.value })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select ID Type</option>
                    {idTypes.map((idType) => (
                      <option key={idType} value={idType}>
                        {idType}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="idNumber" className="label mb-3">
                    ID Number*
                  </label>
                  <input
                    type="text"
                    id="idNumber"
                    name="id_number"
                    placeholder="Enter ID Number"
                    value={formData.id_number}
                    onChange={(e) =>
                      setformData({ ...formData, id_number: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="idIssueDate" className="label mb-3">
                    ID Issue Date*
                  </label>
                  <input
                    type="date"
                    id="idIssueDate"
                    name="id_issue_date"
                    value={formData.id_issue_date}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        id_issue_date: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="idExpiryDate" className="label mb-3">
                    ID Expiry Date*
                  </label>
                  <input
                    type="date"
                    id="idExpiryDate"
                    name="id_expiry_date"
                    value={formData.id_expiry_date}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        id_expiry_date: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="maritalStatus" className="label mb-3">
                    Marital Status*
                  </label>
                  <select
                    id="maritalStatus"
                    name="marital_status"
                    value={formData.marital_status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({
                        ...formData,
                        marital_status: e.target.value,
                      })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select Marital Status</option>
                    {maritalStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </fieldset>
            <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-xl">
                Profile Picture Upload
              </legend>
              <div>
                <label className="label mb-3">
                  Profile Photo (Max size 10MB)*
                </label>
                <input
                  type="file"
                  className="file-input w-full"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setPhotoFileName(file.name);
                      // Convert file to base64
                      const reader = new FileReader();
                      reader.onloadend = () => {
                        const base64String = reader.result as string;
                        setformData({ ...formData, photo: base64String });
                      };
                      reader.onerror = () => {
                        setError("Failed to read image file");
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  name="photo"
                  accept="image/*"
                  required
                />
                {photoFileName && (
                  <p className="text-sm text-gray-600 mt-2">
                    Selected: {photoFileName}
                  </p>
                )}
              </div>
            </fieldset>
            <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-xl">
                Emergency Contact Information
              </legend>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="emergencyContactName" className="label mb-3">
                    Emergency Contact Name*
                  </label>
                  <input
                    type="text"
                    id="emergencyContactName"
                    name="emergency_contact_name"
                    placeholder="Jane Doe"
                    value={formData.emergency_contact_name}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        emergency_contact_name: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label
                    htmlFor="emergencyContactRelationship"
                    className="label mb-3"
                  >
                    Relationship*
                  </label>
                  <input
                    type="text"
                    id="emergencyContactRelationship"
                    name="emergency_contact_relationship"
                    placeholder="Sister"
                    value={formData.emergency_contact_relationship}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        emergency_contact_relationship: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="emergencyContactPhone" className="label mb-3">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="emergencyContactPhone"
                    name="emergency_contact_phone"
                    placeholder="+1 234 567 8901"
                    value={formData.emergency_contact_phone}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        emergency_contact_phone: e.target.value,
                      })
                    }
                    className="input w-full"
                    maxLength={13}
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="nextOfKinName" className="label mb-3">
                    Next of Kin Name*
                  </label>
                  <input
                    type="text"
                    id="nextOfKinName"
                    name="next_of_kin_name"
                    placeholder="Robert Doe"
                    value={formData.next_of_kin_name}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        next_of_kin_name: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="nextOfKinRelationship" className="label mb-3">
                    Relationship*
                  </label>
                  <input
                    type="text"
                    id="nextOfKinRelationship"
                    name="next_of_kin_relationship"
                    placeholder="Brother"
                    value={formData.next_of_kin_relationship}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        next_of_kin_relationship: e.target.value,
                      })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="nextOfKinPhone" className="label mb-3">
                    Phone Number*
                  </label>
                  <input
                    type="tel"
                    id="nextOfKinPhone"
                    name="next_of_kin_phone"
                    placeholder="+1 234 567 8901"
                    value={formData.next_of_kin_phone}
                    onChange={(e) =>
                      setformData({
                        ...formData,
                        next_of_kin_phone: e.target.value,
                      })
                    }
                    className="input w-full"
                    maxLength={13}
                    required
                  />
                </div>
              </div>
            </fieldset>
            <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-xl">
                Qualifications
              </legend>
              <div className="flex flex-col">
                <label htmlFor="academicQualifications" className="label mb-3">
                  Academic Qualifications*
                </label>
                <textarea
                  id="academicQualifications"
                  name="academic_qualifications"
                  placeholder="Enter academic qualifications"
                  value={formData.academic_qualifications}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      academic_qualifications: e.target.value,
                    })
                  }
                  className="textarea w-full"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label
                  htmlFor="professionalQualifications"
                  className="label mb-3"
                >
                  Professional Qualifications*
                </label>
                <textarea
                  id="professionalQualifications"
                  name="professional_qualifications"
                  placeholder="Enter professional qualifications"
                  value={formData.professional_qualifications}
                  onChange={(e) =>
                    setformData({
                      ...formData,
                      professional_qualifications: e.target.value,
                    })
                  }
                  className="textarea w-full"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label htmlFor="skills" className="label mb-3">
                  Skills*
                </label>
                <textarea
                  id="skills"
                  name="skills"
                  placeholder="Enter skills"
                  value={formData.skills}
                  onChange={(e) =>
                    setformData({ ...formData, skills: e.target.value })
                  }
                  className="textarea w-full"
                  required
                />
              </div>
              <div className="flex flex-col mt-4">
                <label htmlFor="languagesSpoken" className="label mb-3">
                  Languages Spoken*
                </label>
                <select
                  id="languagesSpoken"
                  name="languages_spoken"
                  value={formData.languages_spoken}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setformData({
                      ...formData,
                      languages_spoken: e.target.value,
                    })
                  }
                  className="select w-full"
                  required
                >
                  <option value="">Select Language</option>
                  {languages.map((language) => (
                    <option key={language} value={language}>
                      {language}
                    </option>
                  ))}
                </select>
              </div>
              <div className="mb-4" />
            </fieldset>
            <fieldset className="fieldset border-base-300 rounded-box w-full border p-4">
              <legend className="fieldset-legend text-xl">Staff Status</legend>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-8 mb-4">
                <div className="flex flex-col">
                  <label htmlFor="staffStatus" className="label mb-3">
                    Staff Status*
                  </label>
                  <select
                    id="staffStatus"
                    name="staff_status"
                    value={formData.staff_status}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({ ...formData, staff_status: e.target.value })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select Staff Status</option>
                    {staffStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="department" className="label mb-3">
                    Department*
                  </label>
                  <select
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({ ...formData, department: e.target.value })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-col">
                  <label htmlFor="position" className="label mb-3">
                    Position*
                  </label>
                  <input
                    type="text"
                    id="position"
                    name="position"
                    placeholder="Enter Position"
                    value={formData.position}
                    onChange={(e) =>
                      setformData({ ...formData, position: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                <div className="flex flex-col">
                  <label htmlFor="hiredDate" className="label mb-3">
                    Hired Date*
                  </label>
                  <input
                    type="date"
                    id="hiredDate"
                    name="hired_date"
                    value={formData.hired_date}
                    onChange={(e) =>
                      setformData({ ...formData, hired_date: e.target.value })
                    }
                    className="input w-full"
                    required
                  />
                </div>
                 <div className="flex flex-col">
                  <label htmlFor="isTransferred" className="label mb-3">
                    Is Transferred?
                  </label>
                  <select
                    id="isTransferred"
                    name="is_transferred"
                    value={formData.is_transferred ? "yes" : "no"}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                      setformData({
                        ...formData,
                        is_transferred: e.target.value === "yes",
                      })
                    }
                    className="select w-full"
                    required
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {formData.is_transferred && (
                  <div className="flex flex-col">
                    <label htmlFor="transferDate" className="label mb-3">
                      Transfer Date*
                    </label>
                    <input
                      type="date"
                      id="transferDate"
                      name="transfer_date"
                      value={formData.transfer_date}
                      onChange={(e) =>
                        setformData({
                          ...formData,
                          transfer_date: e.target.value,
                        })
                      }
                      className="input w-full"
                      required
                    />
                  </div>
                )}
                {formData.is_transferred && (
                  <div className="flex flex-col">
                    <label htmlFor="transferReason" className="label mb-3">
                      Transfer Reason*
                    </label>
                    <textarea
                      id="transferReason"
                      name="transfer_reason"
                      placeholder="Enter transfer reason"
                      value={formData.transfer_reason}
                      onChange={(e) =>
                        setformData({
                          ...formData,
                          transfer_reason: e.target.value,
                        })
                      }
                      className="textarea w-full"
                      required
                    />
                  </div>
                )}
              </div>
            </fieldset>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
              <Button
                block={true}
                type="button"
                variant="outline"
                size="md"
                onClick={() => setformData(initialFormData)}
              >
                Clear
              </Button>
              <Button
                block={true}
                variant="primary"
                size="md"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Submitting..." : "Add Staff Member"}
              </Button>
            </div>
            {error && (
              <div className="bg-red-100 text-red-800 p-4 rounded mb-4 w-full">
                <span>{error}</span>
              </div>
            )}
            {success && (
              <div className="bg-green-100 text-green-800 p-4 rounded mb-4 w-full">
                <span>{success}</span>
              </div>
            )}
          </form>
        </div>
      </div>
    </>
  );
}
