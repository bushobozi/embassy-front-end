import { useState, useEffect } from "react";
import type { Route } from "./+types/EmbassyProfile";
import { useAuth } from "~/contexts/AuthContext";
import { Button } from "~/components";
import { RiPencilLine, RiFacebookBoxFill, RiTwitterXFill, RiInstagramFill, RiLinkedinBoxFill } from "react-icons/ri";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Embassy" },
    { name: "description", content: "My Embassy Information" },
  ];
}

export interface EmbassyData {
  id: number;
  embassy_picture: string | null;
  name: string;
  country: string;
  city: string;
  address: string;
  phone: string;
  email: string;
  code: string;
  postal_code: string;
  fax_code: string;
  establishment_date: string;
  is_active: boolean;
  provides_visa_services: boolean;
  provides_passport_services: boolean;
  provides_consular_assistance: boolean;
  provides_cultural_exchanges: boolean;
  facebook_link: string | null;
  twitter_link: string | null;
  instagram_link: string | null;
  linkedin_link: string | null;
  created_at: string;
}

export default function EmbassyProfile() {
  const { accessToken, user } = useAuth();
  const embassyId = user?.embassy_id;
  const token = accessToken;
  const [embassyData, setEmbassyData] = useState<EmbassyData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false); 
  const [formData, setFormData] = useState<Partial<EmbassyData>>({});
  const [pictureFile, setPictureFile] = useState<File | null>(null);
  const [picturePreview, setPicturePreview] = useState<string>("");
  const [updatingPicture, setUpdatingPicture] = useState<boolean>(false);
  const URL = import.meta.env.VITE_API_URL;
  const API_URL = `${URL}/embassy/${embassyId}`;
  const UPDATE_API_URL = `${URL}/embassy/${embassyId}`;

  const fetchEmbassyData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      console.log("Fetched embassy data:", data);
      setEmbassyData(data);
    } catch (err) {
      console.error("Error fetching embassy data:", err);
      setError("Failed to fetch embassy data.");
    } finally {
      setLoading(false);
    }
  };

  const openUpdateForm = () => {
    setFormData(embassyData || {});
    (document.getElementById("embassy_update_modal") as HTMLDialogElement)?.showModal();
  };

  const closeUpdateForm = () => {
    (document.getElementById("embassy_update_modal") as HTMLDialogElement)?.close();
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  const handleFormPictureFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPictureFile(file);
      // Create preview URL for display
      const previewUrl = URL.createObjectURL(file);
      setPicturePreview(previewUrl);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      // Create FormData for multipart/form-data submission
      const submitData = new FormData();
      
      // Append all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null && value !== undefined && key !== 'embassy_picture') {
          submitData.append(key, String(value));
        }
      });
      
      // Append the file if selected
      if (pictureFile) {
        submitData.append('embassy_picture', pictureFile);
      }
      
      const response = await fetch(UPDATE_API_URL, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          // Don't set Content-Type - let the browser set it with boundary
        },
        body: submitData,
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const updatedData = await response.json();
      setEmbassyData(updatedData);
      (document.getElementById("embassy_update_modal") as HTMLDialogElement)?.close();
    } catch (err) {
      console.error("Error updating embassy data:", err);
      setError("Failed to update embassy data.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    if (token && embassyId) {
      fetchEmbassyData();
    }
  }, [token, embassyId]);
  return (
    <div className="container mx-auto w-full h-full p-0">
      <div className="flex justify-between items-center lg:flex-nowrap flex-wrap mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Embassy Profile</h1>
        <div className="flex flex-wrap gap-4 lg:flex-nowrap lg:pt-0 pt-4">
          <Button variant="secondary" size="md" onClick={openUpdateForm}>
            Update Embassy
          </Button>
          <Button
            onClick={fetchEmbassyData}
            variant="outline"
            size="md"
            disabled={loading}
          >
            {loading ? (
              <span>
                <span className="loading loading-spinner loading-md"></span>
              </span>
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>
      {loading && (
        <div className="flex flex-col items-center my-16 gap-2 justify-center h-full w-full">
          <div className="flex w-52 flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <span>{error}</span>
        </div>
      )}

      {/* Embassy Content */}
      {!loading && embassyData && (
        <div className="flex flex-wrap w-full container mt-8 mb-16 mx-auto">
          {/* Embassy Picture - Left Column */}
          <div className="lg:w-1/3 w-full lg:pr-10">
            <div className="bg-white border border-gray-200 rounded-xl p-6 sticky top-4">
              <div className="flex flex-col items-center">
                <div className="relative w-48 h-48 mb-4">
                  {embassyData.embassy_picture ? (
                    <img
                      src={embassyData.embassy_picture}
                      alt={`${embassyData.name} Embassy`}
                      className="w-full h-full object-cover rounded-xl border-4 border-gray-100"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-xl flex items-center justify-center border-4 border-gray-100">
                      <span className="text-4xl text-gray-400">🏛️</span>
                    </div>
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 text-center mb-1">
                  {embassyData.name}
                </h2>
                <p className="text-sm text-gray-500 mb-2">Embassy Code: {embassyData.code}</p>
                <div className="badge badge-primary badge-md">
                  {embassyData.is_active ? "Active" : "Inactive"}
                </div>
              </div>
            </div>
          </div>

          {/* Embassy Details - Right Column */}
          <div className="lg:w-2/3 w-full lg:pl-10 mt-6 lg:mt-0">
            <div className="space-y-6">
              {/* Contact Information */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-gray-800 text-2xl">
                    Contact Information
                  </h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openUpdateForm}
                  >
                    <RiPencilLine size="16" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Country</p>
                    <p className="font-medium text-gray-800">{embassyData.country}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">City</p>
                    <p className="font-medium text-gray-800">{embassyData.city}</p>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-800">{embassyData.address}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-800">{embassyData.phone}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-800 text-sm break-all">{embassyData.email}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Postal Code</p>
                    <p className="font-medium text-gray-800">{embassyData.postal_code}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 mb-1">Fax Code</p>
                    <p className="font-medium text-gray-800">{embassyData.fax_code}</p>
                  </div>
                  <div className="lg:col-span-2">
                    <p className="text-xs text-gray-500 mb-1">Establishment Date</p>
                    <p className="font-medium text-gray-800">
                      {new Date(embassyData.establishment_date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* Services Provided */}
              <div className="bg-white border border-gray-200 rounded-xl p-6">
                <h4 className="font-semibold text-gray-800 text-2xl mb-4">
                  Services Provided
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={embassyData.provides_visa_services}
                      disabled
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span className="text-gray-700">Visa Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={embassyData.provides_passport_services}
                      disabled
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span className="text-gray-700">Passport Services</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={embassyData.provides_consular_assistance}
                      disabled
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span className="text-gray-700">Consular Assistance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={embassyData.provides_cultural_exchanges}
                      disabled
                      className="checkbox checkbox-sm checkbox-primary"
                    />
                    <span className="text-gray-700">Cultural Exchanges</span>
                  </div>
                </div>
              </div>

              {/* Social Media Links */}
              {(embassyData.facebook_link || embassyData.twitter_link || 
                embassyData.instagram_link || embassyData.linkedin_link) && (
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="font-semibold text-gray-800 text-2xl mb-4">
                    Social Media
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {embassyData.facebook_link && (
                      <a
                        href={embassyData.facebook_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <RiFacebookBoxFill size={20} />
                        <span className="text-sm font-medium">Facebook</span>
                      </a>
                    )}
                    {embassyData.twitter_link && (
                      <a
                        href={embassyData.twitter_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                      >
                        <RiTwitterXFill size={20} />
                        <span className="text-sm font-medium">Twitter</span>
                      </a>
                    )}
                    {embassyData.instagram_link && (
                      <a
                        href={embassyData.instagram_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-600 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        <RiInstagramFill size={20} />
                        <span className="text-sm font-medium">Instagram</span>
                      </a>
                    )}
                    {embassyData.linkedin_link && (
                      <a
                        href={embassyData.linkedin_link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors"
                      >
                        <RiLinkedinBoxFill size={20} />
                        <span className="text-sm font-medium">LinkedIn</span>
                      </a>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Full Embassy Update Modal */}
      <dialog id="embassy_update_modal" className="modal">
        <div className="modal-box max-w-3xl">
          <h3 className="font-bold text-lg mb-4">Update Embassy Information</h3>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Basic Information */}
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Embassy Name</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Embassy Name"
                  className="input input-bordered w-full"
                  value={formData.name || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Country</span>
                </label>
                <input
                  type="text"
                  name="country"
                  placeholder="Country"
                  className="input input-bordered w-full"
                  value={formData.country || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">City</span>
                </label>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  className="input input-bordered w-full"
                  value={formData.city || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Address</span>
                </label>
                <input
                  type="text"
                  name="address"
                  placeholder="Address"
                  className="input input-bordered w-full"
                  value={formData.address || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Phone</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  className="input input-bordered w-full"
                  value={formData.phone || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Email</span>
                </label>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  className="input input-bordered w-full"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Embassy Code</span>
                </label>
                <input
                  type="text"
                  name="code"
                  placeholder="Embassy Code"
                  className="input input-bordered w-full"
                  value={formData.code || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Postal Code</span>
                </label>
                <input
                  type="text"
                  name="postal_code"
                  placeholder="Postal Code"
                  className="input input-bordered w-full"
                  value={formData.postal_code || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Fax Code</span>
                </label>
                <input
                  type="text"
                  name="fax_code"
                  placeholder="Fax Code"
                  className="input input-bordered w-full"
                  value={formData.fax_code || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full md:col-span-2">
                <label className="label mb-2">
                  <span className="label-text">Embassy Picture</span>
                </label>
                <input
                  type="file"
                  accept="image/*"
                  className="file-input file-input-bordered w-full"
                  onChange={handleFormPictureFileChange}
                />
                <label className="label mb-2">
                  <span className="label-text-alt text-gray-500">
                    Select an image file (JPG, PNG, etc.)
                  </span>
                </label>
                {/* Picture Preview */}
                {(picturePreview || embassyData?.embassy_picture) && (
                  <div className="mt-2">
                    <p className="text-sm font-medium mb-2">
                      {picturePreview ? "New Picture Preview:" : "Current Picture:"}
                    </p>
                    <img
                      src={picturePreview || embassyData?.embassy_picture || ""}
                      alt="Embassy Preview"
                      className="w-full max-h-32 object-cover rounded-lg border"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Social Media Links */}
            <div className="divider">Social Media</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Facebook</span>
                </label>
                <input
                  type="url"
                  name="facebook_link"
                  placeholder="Facebook URL"
                  className="input input-bordered w-full"
                  value={formData.facebook_link || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Twitter</span>
                </label>
                <input
                  type="url"
                  name="twitter_link"
                  placeholder="Twitter URL"
                  className="input input-bordered w-full"
                  value={formData.twitter_link || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">Instagram</span>
                </label>
                <input
                  type="url"
                  name="instagram_link"
                  placeholder="Instagram URL"
                  className="input input-bordered w-full"
                  value={formData.instagram_link || ""}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-control w-full">
                <label className="label mb-2">
                  <span className="label-text">LinkedIn</span>
                </label>
                <input
                  type="url"
                  name="linkedin_link"
                  placeholder="LinkedIn URL"
                  className="input input-bordered w-full"
                  value={formData.linkedin_link || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            {/* Services Checkboxes */}
            <div className="divider">Services Provided</div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="provides_visa_services"
                    className="checkbox checkbox-primary"
                    checked={formData.provides_visa_services || false}
                    onChange={handleCheckboxChange}
                  />
                  <span className="label-text">Visa Services</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="provides_passport_services"
                    className="checkbox checkbox-primary"
                    checked={formData.provides_passport_services || false}
                    onChange={handleCheckboxChange}
                  />
                  <span className="label-text">Passport Services</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="provides_consular_assistance"
                    className="checkbox checkbox-primary"
                    checked={formData.provides_consular_assistance || false}
                    onChange={handleCheckboxChange}
                  />
                  <span className="label-text">Consular Assistance</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="provides_cultural_exchanges"
                    className="checkbox checkbox-primary"
                    checked={formData.provides_cultural_exchanges || false}
                    onChange={handleCheckboxChange}
                  />
                  <span className="label-text">Cultural Exchanges</span>
                </label>
              </div>

              <div className="form-control">
                <label className="label cursor-pointer justify-start gap-3">
                  <input
                    type="checkbox"
                    name="is_active"
                    className="checkbox checkbox-primary"
                    checked={formData.is_active || false}
                    onChange={handleCheckboxChange}
                  />
                  <span className="label-text">Active</span>
                </label>
              </div>
            </div>

            {error && (
              <div className="alert alert-error mt-4">
                <span>{error}</span>
              </div>
            )}

            <div className="modal-action">
              <Button type="button" variant="outline" size="md" onClick={closeUpdateForm}>
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                size="md"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <span className="loading loading-spinner loading-sm"></span>
                  </>
                ) : (
                  "Save Changes"
                )}
              </Button>
            </div>
          </form>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </div>
  );
}
