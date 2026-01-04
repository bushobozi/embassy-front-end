import React from "react";
import type { EmbassyEvent } from "./types";
import { FaCalendar } from "react-icons/fa6";

interface EventsListProps {
  events: EmbassyEvent[];
}

const url = import.meta.env.VITE_BASE_URL;

export const EventsList: React.FC<EventsListProps> = ({ events }) => {
  const truncate = (str: string, maxLength: number = 20): string => {
    return str.length > maxLength ? `${str.slice(0, maxLength)}...` : str;
  };
  return (
    <div className="bg-white rounded-2xl p-0">
      <h3 className="font-semibold text-gray-950 mb-4">Upcoming Events</h3>
      <div className="space-y-3 max-h-100 overflow-y-auto">
        {events.slice(0, 10).map((event) => (
          <div
            key={event.id}
            className="p-3 border border-gray-200 flex gap-2 rounded-2xl hover:bg-gray-50 cursor-pointer"
          >
            <div>
              {event.event_image ? (
                <img
                  src={event.event_image}
                  alt={event.event_name}
                  className="w-16 h-16 max-w-25 max-h-25 object-cover rounded-md"
                />
              ) : (
                <div className="w-16 h-16 bg-gray-200 rounded-md flex items-center justify-center text-gray-400">
                  <FaCalendar />
                </div>
              )}
            </div>
            <div>
              <div className="font-semibold text-sm truncate">
                {truncate(event.event_name)}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(event.event_start_date).toLocaleDateString()} • {new Date(event.event_start_date).toLocaleTimeString()}
              </div>
              <div className="text-xs text-gray-600 mt-1">{event.event_location}</div>
              {!event.is_active && (
                <span className="badge badge-sm badge-warning mt-2">Inactive</span>
              )}
            </div>
          </div>
        ))}
        {events.length === 0 && (
          <p className="text-gray-500 text-sm text-center py-4">
            No events found
          </p>
        )}
      </div>
    </div>
  );
};
