import React from "react";
import type { CalendarEvent } from "./types";
import { isToday, formatDateLocal } from "./utils";

interface MonthViewProps {
  date: Date;
  events: CalendarEvent[];
}

export const MonthView: React.FC<MonthViewProps> = ({ date, events }) => {
  const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
  const lastDayOfMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const days: (Date | null)[] = [];
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  for (let day = 1; day <= daysInMonth; day++) {
    days.push(new Date(date.getFullYear(), date.getMonth(), day));
  }
  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const dateString = formatDateLocal(date);
    return events.filter((event) => {
      if (!event.event_start_date) return false;
      const eventDateString = formatDateLocal(new Date(event.event_start_date));
      return eventDateString === dateString;
    });
  };

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="overflow-auto">
      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-2 mb-2">
        {dayNames.map((dayName) => (
          <div
            key={dayName}
            className="text-center text-sm font-semibold text-gray-600 py-2"
          >
            {dayName}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day, index) => {
          if (!day) {
            return (
              <div
                key={`empty-${index}`}
                className="min-h-30 bg-gray-50 rounded-lg"
              ></div>
            );
          }

          const dayEvents = getEventsForDate(day);
          const isTodayDate = isToday(day);

          return (
            <div
              key={index}
              className={`min-h-30 border rounded-lg p-2 ${
                isTodayDate
                  ? "bg-red-200 border-red-200"
                  : "bg-blue-50 border-blue-50"
              } hover:shadow-md transition-shadow cursor-pointer`}
            >
              <div
                className={`font-semibold mb-2 ${
                  isTodayDate
                    ? "text-blue-600 rounded-full text-xl"
                    : "text-gray-700 text-sm"
                }`}
              >
                {day.getDate()}
              </div>

              {/* Events */}
              <div className="space-y-1">
                {dayEvents.slice(0, 3).map((event) => (
                  <div
                    key={event.id}
                    className={`${event.color || "bg-gray-400"} text-white text-xs px-2 py-1 rounded truncate`}
                    title={event.event_name}
                  >
                    {event.event_name}
                  </div>
                ))}
                {dayEvents.length > 3 && (
                  <div className="text-xs text-gray-500 px-2">
                    +{dayEvents.length - 3} more
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
