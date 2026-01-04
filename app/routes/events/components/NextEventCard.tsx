import React from "react";
import type { EmbassyEvent } from "./types";
import {
  FaCalendar,
  FaClock,
  FaLocationDot,
  FaRegBookmark,
} from "react-icons/fa6";
import { Button } from "~/components";

interface NextEventCardProps {
  event: EmbassyEvent;
}

const url = import.meta.env.VITE_BASE_URL;

export const NextEventCard: React.FC<NextEventCardProps> = ({ event }) => {
  const modalId = `event_modal_${event.id}`;

  const truncate = (str: string, maxLength: number = 20): string => {
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
  };

  const openModal = () => {
    const modal = document.getElementById(modalId) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };

  function formatRoleDepartment(text: string | null) {
    if (!text) return "---";
    return text.replace(/_/g, " ");
  }

  return (
    <>
      <div className="border border-gray-200 bg-white rounded-2xl p-6">
        <h4 className="font-semibold text-gray-950 mb-3">Next Event</h4>
        <div className="flex items-start gap-3 mb-4">
          <div className="text-3xl">
            {event.event_image ? (
              <img
                src={event.event_image}
                alt={event.event_name}
                className="w-16 h-16 max-w-25 max-h-25 object-cover rounded-md"
              />
            ) : (
              <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400 text-2xl">
                <FaCalendar />
              </div>
            )}
          </div>
          <div>
            <div className="text-gray-400 text-sm">
              {new Date(event.event_start_date).toLocaleTimeString()} - {new Date(event.event_end_date).toLocaleTimeString()}
            </div>
            <div className="font-semibold text-sm truncate">
              {truncate(event.event_name)}
            </div>
            <div className="text-gray-600 text-sm mt-1">{event.event_location}</div>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <Button variant="secondary" block={true} size="sm">
            Remind Me
          </Button>
          <Button variant="primary" block={true} size="sm" onClick={openModal}>
            Details
          </Button>
        </div>
      </div>
      <dialog id={modalId} className="modal">
        <div className="modal-box max-w-3xl">
          {event.event_image ? (
            <div className="w-full h-80 mb-4 rounded-0 overflow-hidden">
              <img
                src={event.event_image}
                alt={event.event_name}
                className="w-full h-full object-cover"
              />
            </div>
          ) : (
            <div className="w-full h-48 mb-4 bg-gray-200 rounded-lg flex items-center justify-center">
              <FaCalendar className="text-6xl text-gray-400" />
            </div>
          )}
          <h3 className="font-bold text-2xl mb-4">{event.event_name}</h3>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-start gap-3">
                <FaClock className="text-blue-600 mt-1 shrink-0" />
                <div>
                  <div className="font-semibold text-sm text-gray-700">
                    Date & Time
                  </div>
                  <div className="text-gray-600">{new Date(event.event_start_date).toLocaleDateString()}</div>
                  <div className="text-gray-600">
                    {new Date(event.event_start_date).toLocaleTimeString()} - {new Date(event.event_end_date).toLocaleTimeString()}
                  </div>
                </div>
              </div>
              {event.event_location && (
                <div className="flex items-start gap-3">
                  <FaLocationDot className="text-red-600 mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-gray-700">
                      Location
                    </div>
                    <div className="text-gray-600">{event.event_location}</div>
                  </div>
                </div>
              )}
              {event.event_type && (
                <div className="flex items-start gap-3">
                  <FaRegBookmark className="text-yellow-500 mt-1 shrink-0" />
                  <div>
                    <div className="font-semibold text-sm text-gray-700">
                      Category
                    </div>
                    <div className="text-gray-600 capitalize">
                      {formatRoleDepartment(event.event_type)}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {event.event_description && (
              <div className="pt-3">
                <div className="font-semibold text-sm text-gray-700 mb-2">
                  Description
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">
                  {event.event_description}
                </p>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-2 mt-6">
            <Button variant="secondary" block={true} size="md">
              Remind Me
            </Button>
            <form method="dialog" className="flex-1">
              <Button variant="outline" block={true} size="md">
                Close
              </Button>
            </form>
          </div>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>close</button>
        </form>
      </dialog>
    </>
  );
};
