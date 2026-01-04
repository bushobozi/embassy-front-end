import React, { useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { monthNames } from "./utils";

interface MiniCalendarProps {
  currentDate: Date;
  onDateChange?: (date: Date) => void;
}

export const MiniCalendar: React.FC<MiniCalendarProps> = ({
  currentDate,
  onDateChange,
}) => {
  const [displayDate, setDisplayDate] = useState(currentDate);
  const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const navigateMonth = (direction: "prev" | "next") => {
    const newDate = new Date(displayDate);
    if (direction === "prev") {
      newDate.setMonth(displayDate.getMonth() - 1);
    } else {
      newDate.setMonth(displayDate.getMonth() + 1);
    }
    setDisplayDate(newDate);
    if (onDateChange) {
      onDateChange(newDate);
    }
  };
  const firstDayOfMonth = new Date(
    displayDate.getFullYear(),
    displayDate.getMonth(),
    1
  );
  const lastDayOfMonth = new Date(
    displayDate.getFullYear(),
    displayDate.getMonth() + 1,
    0
  );
  const startingDayOfWeek = firstDayOfMonth.getDay();
  const daysInMonth = lastDayOfMonth.getDate();
  const lastDayOfPrevMonth = new Date(
    displayDate.getFullYear(),
    displayDate.getMonth(),
    0
  ).getDate();
  const calendarDays: (number | null)[] = [];
  for (let i = startingDayOfWeek - 1; i >= 0; i--) {
    calendarDays.push(-(lastDayOfPrevMonth - i)); // Negative for previous month
  }
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }
  const remainingDays = 35 - calendarDays.length; // 5 weeks = 35 days
  for (let day = 1; day <= remainingDays; day++) {
    calendarDays.push(-(day + 100)); // Negative + 100 for next month
  }
  const weeks: (number | null)[][] = [];
  for (let i = 0; i < calendarDays.length; i += 7) {
    weeks.push(calendarDays.slice(i, i + 7));
  }
  return (
    <div className="border border-gray-200 bg-white rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-950 font-semibold">
          {monthNames[displayDate.getMonth()]} {displayDate.getFullYear()}
        </h3>
        <div className="flex gap-2">
          <button
            className="text-gray-900 hover:text-gray-950"
            onClick={() => navigateMonth("prev")}
          >
            <FiChevronLeft size={16} />
          </button>
          <button
            className="text-gray-900 hover:text-gray-950"
            onClick={() => navigateMonth("next")}
          >
            <FiChevronRight size={16} />
          </button>
        </div>
      </div>
      <div>
        <div className="grid grid-cols-7 gap-2 mb-2">
          {days.map((day) => (
            <div key={day} className="text-center text-gray-900 text-xs">
              {day}
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {weeks.map((week, i) => (
            <div key={i} className="grid grid-cols-7 gap-2">
              {week.map((date, j) => {
                const isCurrentMonth = date !== null && date > 0 && date < 100;
                const isPrevMonth = date !== null && date < 0 && date > -100;
                const isNextMonth = date !== null && date < -100;
                const dayNumber = isPrevMonth
                  ? Math.abs(date)
                  : isNextMonth
                    ? Math.abs(date) - 100
                    : date;

                return (
                  <div
                    key={j}
                    className={`text-center text-sm py-1 rounded cursor-pointer ${
                      isCurrentMonth &&
                      date === currentDate.getDate() &&
                      displayDate.getMonth() === currentDate.getMonth() &&
                      displayDate.getFullYear() === currentDate.getFullYear()
                        ? "bg-blue-600 text-white"
                        : isCurrentMonth
                          ? "text-gray-950 hover:bg-gray-100"
                          : "text-gray-400"
                    }`}
                  >
                    {dayNumber}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
