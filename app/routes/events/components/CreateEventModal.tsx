import React, { useState } from "react";
import { Button } from "~/components";
import { useAuth } from "~/contexts/AuthContext";
interface CreateEventModalProps {
  onEventCreated: () => void;
}
export const CreateEventModal: React.FC<CreateEventModalProps> = ({
  onEventCreated,
}) => {
  const [formData, setFormData] = useState({
    event_name: "",
    event_description: "",
    event_type: "CONFERENCE",
    event_start_date: "",
    event_end_date: "",
    event_location: "",
    event_image: "",
    event_cost: 0,
    max_attendees: 100,
    registration_deadline: "",
    is_paid: false,
    is_active: true,
    is_public: true,
    is_virtual: false,
    is_private: false,
  });
  const { user, accessToken } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" 
          ? (e.target as HTMLInputElement).checked 
          : type === "number" 
          ? value === "" ? 0 : Number(value)
          : value,
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          event_image: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    try {
      const token = accessToken;
      const embassyId = user?.embassy_id;
      const userId = user?.id;
      
      console.log("User object:", user);
      console.log("Embassy ID:", embassyId);
      console.log("User ID:", userId);
      
      const url = import.meta.env.VITE_API_URL;
      if (!token) {
        throw new Error("Authentication token not found. Please log in again.");
      }
      if (!userId) {
        throw new Error("User ID not found. Please log in again.");
      }
      if (!embassyId) {
        throw new Error("Embassy ID not found. Please ensure you are logged in properly.");
      }
      
      // Convert datetime-local format to ISO-8601
      const formatToISO = (datetime: string) => {
        if (!datetime) return "";
        return new Date(datetime).toISOString();
      };
      
      const requestBody = {
        event_image: formData.event_image,
        event_name: formData.event_name,
        event_description: formData.event_description,
        event_start_date: formatToISO(formData.event_start_date),
        event_end_date: formatToISO(formData.event_end_date),
        event_location: formData.event_location,
        event_type: formData.event_type,
        is_virtual: formData.is_virtual,
        is_active: formData.is_active,
        is_public: formData.is_public,
        is_private: formData.is_private,
        is_paid: formData.is_paid,
        event_cost: formData.event_cost,
        max_attendees: formData.max_attendees,
        registration_deadline: formatToISO(formData.registration_deadline),
        embassy_id: embassyId,
      };
      
      console.log("Submitting event data:", requestBody);
      const response = await fetch(`${url}/events`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      });

      if (response.status === 401) {
        window.location.href = "/consular_login";
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create event");
      }
      setSuccess(true);
      setFormData({
        event_name: "",
        event_description: "",
        event_type: "CONFERENCE",
        event_start_date: "",
        event_end_date: "",
        event_location: "",
        event_image: "",
        event_cost: 0,
        max_attendees: 100,
        registration_deadline: "",
        is_paid: false,
        is_active: true,
        is_public: true,
        is_virtual: false,
        is_private: false,
      });
      onEventCreated();
      setTimeout(() => {
        const modal = document.getElementById(
          "create_event_modal"
        ) as HTMLDialogElement;
        modal?.close();
        setSuccess(false);
      }, 1500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <dialog id="create_event_modal" className="modal">
      <div className="modal-box max-w-xl">
        <h3 className="font-bold text-2xl mb-4">Create New Event</h3>
        {error && (
          <div role="alert" className="alert alert-error alert-soft mb-4">
            <span className="font-bold">{error}</span>
          </div>
        )}
        {success && (
          <div role="alert" className="alert alert-success alert-soft mb-4">
            <span className="font-bold">Event created successfully!</span>
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label mb-2">
              <span className="label-text">Event Name *</span>
            </label>
            <input
              type="text"
              name="event_name"
              value={formData.event_name}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Enter event name"
              required
            />
          </div>
          <div>
            <label className="label mb-2">
              <span className="label-text">Event Type *</span>
            </label>
            <select
              name="event_type"
              value={formData.event_type}
              onChange={handleInputChange}
              className="select select-bordered w-full"
              required
            >
              <option value="CONFERENCE">Conference</option>
              <option value="NATIONAL_DAY">National Day Celebration</option>
              <option value="VISA_OUTREACH">Visa Outreach</option>
              <option value="CULTURAL_EVENT">Cultural Event</option>
              <option value="TRAINING">Training / Workshop</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label mb-2">
                <span className="label-text">Start Date *</span>
              </label>
              <input
                type="datetime-local"
                name="event_start_date"
                value={formData.event_start_date}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
            <div>
              <label className="label mb-2">
                <span className="label-text">End Date *</span>
              </label>
              <input
                type="datetime-local"
                name="event_end_date"
                value={formData.event_end_date}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                required
              />
            </div>
          </div>
          <div>
            <label className="label mb-2">
              <span className="label-text">Location *</span>
            </label>
            <input
              type="text"
              name="event_location"
              value={formData.event_location}
              onChange={handleInputChange}
              className="input input-bordered w-full"
              placeholder="Event location"
              required
            />
          </div>
          <div>
            <label className="label mb-2">
              <span className="label-text">Registration Deadline</span>
            </label>
            <input
              type="datetime-local"
              name="registration_deadline"
              value={formData.registration_deadline}
              onChange={handleInputChange}
              className="input input-bordered w-full"
            />
            <label className="label">
              <span className="label-text-alt">
                Leave empty for no deadline
              </span>
            </label>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label mb-2">
                <span className="label-text">Event Cost</span>
              </label>
              <input
                type="number"
                name="event_cost"
                value={formData.event_cost}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="0.00"
                step="0.01"
                min="0"
              />
            </div>
            <div>
              <label className="label mb-2">
                <span className="label-text">Max Attendees</span>
              </label>
              <input
                type="number"
                name="max_attendees"
                value={formData.max_attendees}
                onChange={handleInputChange}
                className="input input-bordered w-full"
                placeholder="Unlimited"
                min="1"
              />
            </div>
          </div>
          <div>
            <label className="label mb-2">
              <span className="label-text">Description *</span>
            </label>
            <textarea
              name="event_description"
              value={formData.event_description}
              onChange={handleInputChange}
              className="textarea textarea-bordered w-full h-24"
              placeholder="Detailed description of the event"
              required
            ></textarea>
          </div>
          <div>
            <label className="label mb-2">
              <span className="label-text">Event Image</span>
            </label>
            <input
              type="file"
              onChange={handleFileChange}
              className="file-input file-input-bordered w-full"
              accept="image/*"
            />
            <label className="label">
              <span className="label-text-alt">
                Max size 2MB, will be resized to 800x600px
              </span>
            </label>
            {formData.event_image && (
              <div className="mt-2">
                <img
                  src={formData.event_image}
                  alt="Selected Event Image"
                  className="w-full h-auto rounded-md"
                />
              </div>
            )}
          </div>
          <div className="space-y-2">
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name="is_paid"
                  checked={formData.is_paid}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Paid Event</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Active Event</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name="is_public"
                  checked={formData.is_public}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Public Event</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name="is_virtual"
                  checked={formData.is_virtual}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Virtual Event</span>
              </label>
            </div>
            <div className="form-control">
              <label className="label cursor-pointer justify-start gap-3">
                <input
                  type="checkbox"
                  name="is_private"
                  checked={formData.is_private}
                  onChange={handleInputChange}
                  className="checkbox checkbox-primary"
                />
                <span className="label-text">Private Event</span>
              </label>
            </div>
          </div>
          <div className="modal-action">
            <Button
              type="submit"
              variant="primary"
              block={true}
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="loading loading-spinner"></span>
                  Creating...
                </>
              ) : (
                <>Create Event</>
              )}
            </Button>
          </div>
        </form>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  );
};
