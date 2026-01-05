import React from "react";
import type { CalendarEvent } from "./types";

interface EventCardProps {
  event: CalendarEvent;
  style: React.CSSProperties;
}

export const EventCard: React.FC<EventCardProps> = ({ event, style }) => {
  if (!event) return null;

  // Extract the color code (e.g., "bg-blue-500" -> "blue")
  const colorClass = event.color || "bg-gray-400";

  return (
    <div
      className="bg-white border border-gray-200 rounded-lg absolute shadow-sm hover:shadow-md cursor-pointer transition-all overflow-hidden"
      style={style}
    >
      {/* Color bar on the left */}
      <div className="flex h-full">
        <div className={`${colorClass} w-1.5 shrink-0`}></div>
        {/* Event details */}
        <div className="flex-1 p-2 min-w-0">
          <div className="font-semibold text-gray-900 text-xs truncate mb-1">
            {event.event_name}
          </div>

          <div className="text-xs text-gray-600 flex items-center gap-1">
            <span>🕐</span>
            <span>
              {new Date(event.event_start_date).toLocaleTimeString()} -{" "}
              {new Date(event.event_end_date).toLocaleTimeString()}
            </span>
          </div>

          {event.event_location && (
            <div className="text-xs text-gray-500 truncate mt-1 flex items-center gap-1">
              <span>📍</span>
              <span>{event.event_location}</span>
            </div>
          )}

          {event.attendees && event.attendees.length > 0 && (
            <div className="flex gap-1 mt-1.5">
              {event.attendees.slice(0, 3).map((_, i) => (
                <div
                  key={i}
                  className="w-4 h-4 rounded-full bg-gray-300 border border-white"
                ></div>
              ))}
              {event.attendees.length > 3 && (
                <div className="text-xs text-gray-500">
                  +{event.attendees.length - 3}
                </div>
              )}
            </div>
          )}
           {event.embassy_name && (
          <div className="flex items-center gap-2">
            {event.embassy_picture && (
              <img
                src={event.embassy_picture}
                alt={event.embassy_name}
                className="w-6 h-6 rounded-full object-cover border border-gray-300"
              />
            )}
            <span className="text-sm text-gray-600">{event.embassy_name}</span>
          </div>
        )}
        </div>
      </div>
    </div>
  );
};
