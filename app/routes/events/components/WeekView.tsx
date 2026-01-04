import React from "react";
import type { CalendarEvent } from "./types";
import { isToday, formatDateLocal } from "./utils";
import { FaMapPin, FaRegClock } from "react-icons/fa6";

interface WeekViewProps {
  events: CalendarEvent[];
  weekDates: Date[];
}

export const WeekView: React.FC<WeekViewProps> = ({ events, weekDates }) => {
  // Helper function to get events for a specific date
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateString = formatDateLocal(date); // YYYY-MM-DD format in local timezone
    return events.filter((event) => {
      if (!event.event_start_date) return false;
      const eventDateString = formatDateLocal(new Date(event.event_start_date));
      return eventDateString === dateString;
    });
  };

  return (
    <div className="overflow-auto">
      <div className="grid grid-cols-7 gap-4 mb-4 sticky top-0 bg-white pb-4">
        {weekDates.map((date, i) => {
          const isTodayDate = isToday(date);

          return (
            <div key={i} className="text-center bg-blue-200 p-2 rounded-xl">
              <div className="text-sm text-gray-500">
                {
                  [
                    "Sunday",
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                  ][date.getDay()]
                }
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  isTodayDate
                    ? " text-blue-700 font-extrabold rounded-lg px-3 py-1"
                    : ""
                }`}
              >
                {date.getDate()}
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex w-full">
        {weekDates.map((date, dayIndex) => {
          const dayEvents = getEventsForDate(date);

          return (
            <div key={dayIndex} className="min-h-[500px] w-full">
              {dayEvents.length > 0 ? (
                <div className="space-y-3 flex flex-col">
                  {dayEvents.map((event) => (
                    <div
                      key={event.id}
                      className="bg-blue-50 border border-gray-200 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-all overflow-hidden"
                    >
                      <div className="flex">
                        <div
                          className={`${event.color || "bg-gray-400"} w-1.5 shrink-0`}
                        ></div>
                        <div className="flex-1 p-3 min-w-0">
                          <div className="font-semibold text-gray-900 text-sm mb-2 line-clamp-2">
                            {event.event_name.length > 60
                              ? `${event.event_name.substring(0, 60)}...`
                              : event.event_name}
                          </div>
                          <div className="text-xs text-gray-600 flex items-center gap-1 mb-2">
                            <span>
                              <FaRegClock />
                            </span>
                            <span>
                              {new Date(event.event_start_date).toLocaleTimeString()} - {new Date(event.event_end_date).toLocaleTimeString()}
                            </span>
                          </div>
                          {event.event_location && (
                            <div className="text-xs text-gray-500 truncate flex items-center gap-1">
                              <span>
                                <FaMapPin />
                              </span>
                              <span>{event.event_location}</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center h-32 text-gray-300 text-sm">
                  No events
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
