import React from "react";
import type { CalendarEvent } from "./types";
import { Button } from "~/components";
import { formatDateLocal } from "./utils";
import {
  FaMapPin,
  FaRegClock,
  FaRegCalendarDays,
  FaClock,
  FaLocationDot,
  FaRegBookmark,
} from "react-icons/fa6";

interface DayViewProps {
  events: CalendarEvent[];
  date: Date;
}

const url = import.meta.env.VITE_BASE_URL;

export const DayView: React.FC<DayViewProps> = ({ events, date }) => {
  const openModal = (eventId: string) => {
    const modal = document.getElementById(
      `event_modal_${eventId}`
    ) as HTMLDialogElement;
    if (modal) {
      modal.showModal();
    }
  };
  const dateString = formatDateLocal(date); // YYYY-MM-DD format in local timezone
  const dayEvents = events.filter((event) => {
    if (!event.event_start_date) return false;
    const eventDateString = formatDateLocal(new Date(event.event_start_date));
    return eventDateString === dateString;
  });

  const dayNames = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const url = import.meta.env.VITE_BASE_URL;

  const truncate = (str: string, maxLength: number = 50): string => {
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
  };

  function formatRoleDepartment(text: string | null) {
    if (!text) return "---";
    return text.replace(/_/g, " ");
  }

  return (
    <div className="overflow-auto">
      <div className="mb-6 text-center pb-4 border-gray-200">
        <div className="text-sm text-gray-500">{dayNames[date.getDay()]}</div>
        <div className="text-3xl font-bold mt-1">
          {monthNames[date.getMonth()]} {date.getDate()}, {date.getFullYear()}
        </div>
        <div className="text-sm text-gray-500 mt-2 bg-gray-300 rounded-full inline-block px-3 py-1">
          {dayEvents.length} {dayEvents.length === 1 ? "event" : "events"}
        </div>
      </div>
      {dayEvents.length > 0 ? (
        <div className="space-y-4 max-w-3xl mx-auto">
          {dayEvents.map((event) => (
            <React.Fragment key={event.id}>
              <div
                onClick={() => openModal(event.id)}
                className="bg-white border border-gray-200 rounded-xl hover:shadow-sm cursor-pointer transition-all overflow-hidden h-40 max-h-40"
              >
                <div className="flex">
                  <div>
                    {event.event_image && (
                      <img
                        src={event.event_image}
                        alt={event.event_name}
                        className="w-80 max-w-80 h-full object-contain rounded-0"
                      />
                    )}
                  </div>
                  <div className="ml-6 p-4">
                    <div className="font-semibold text-gray-900 text-lg mb-3">
                      {truncate(event.event_name)}
                    </div>

                    <div className="flex items-center gap-6 mb-3">
                      <div className="text-sm text-gray-600 flex items-center gap-2">
                        <FaRegClock className="text-gray-500" />
                        <span>
                          {new Date(event.event_start_date).toLocaleTimeString()} - {new Date(event.event_end_date).toLocaleTimeString()}
                        </span>
                      </div>

                      {event.event_location && (
                        <div className="text-sm text-gray-600 flex items-center gap-2">
                          <FaLocationDot className="text-gray-500" />
                          <span>{event.event_location}</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-3 pt-0">
                      <div
                        className={`${event.color || "bg-gray-400"} w-fit shrink-0 mt-2 rounded-sm text-center`}
                      >
                        {event.event_type && (
                          <span className="text-xs text-white px-3 py-2 rounded capitalize">
                            {formatRoleDepartment(event.event_type)}
                          </span>
                        )}
                      </div>
                    </div>
                    {event.attendees && event.attendees.length > 0 && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <span className="text-sm text-gray-500">
                          Attendees:
                        </span>
                        <div className="flex gap-1">
                          {event.attendees.slice(0, 5).map((_, i) => (
                            <div
                              key={i}
                              className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                            ></div>
                          ))}
                          {event.attendees.length > 5 && (
                            <div className="text-sm text-gray-500 ml-2 self-center">
                              +{event.attendees.length - 5} more
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <dialog id={`event_modal_${event.id}`} className="modal">
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
                      <FaRegCalendarDays className="text-6xl text-gray-400" />
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
                          <div className="text-gray-600">
                            {new Date(event.event_start_date).toLocaleDateString(
                              "en-US",
                              {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </div>
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
                            <div className="text-gray-600">
                              {event.event_location}
                            </div>
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
                      {event.attendees && event.attendees.length > 0 && (
                        <div className="flex items-start gap-3">
                          <div className="w-4 h-4 rounded-full bg-green-600 mt-1 shrink-0" />
                          <div>
                            <div className="font-semibold text-sm text-gray-700">
                              Attendees
                            </div>
                            <div className="flex gap-1 mt-2">
                              {event.attendees.slice(0, 8).map((_, i) => (
                                <div
                                  key={i}
                                  className="w-8 h-8 rounded-full bg-gray-300 border-2 border-white"
                                ></div>
                              ))}
                              {event.attendees.length > 8 && (
                                <div className="text-sm text-gray-500 ml-2 self-center">
                                  +{event.attendees.length - 8} more
                                </div>
                              )}
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
            </React.Fragment>
          ))}
        </div>
      ) : (
        <div className="text-center flex justify-center items-center flex-col text-gray-400 py-20">
          <div className="text-6xl text-center mb-4">
            <FaRegCalendarDays />
          </div>
          <h3 className="text-xl font-semibold mb-2">No events scheduled</h3>
          <p className="text-sm">There are no events for this day</p>
        </div>
      )}
    </div>
  );
};
