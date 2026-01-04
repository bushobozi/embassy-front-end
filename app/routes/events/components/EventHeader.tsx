import React from "react";
import { FiChevronLeft, FiChevronRight, FiRefreshCw } from "react-icons/fi";
import type { ViewType, FilterType } from "./types";
import { monthNames } from "./utils";

interface EventHeaderProps {
  currentDate: Date;
  view: ViewType;
  setView: (view: ViewType) => void;
  eventFilter: FilterType;
  setEventFilter: (filter: FilterType) => void;
  loading: boolean;
  onRefresh: () => void;
  onNavigate: (direction: "prev" | "next") => void;
  onToday: () => void;
}

export const EventHeader: React.FC<EventHeaderProps> = ({
  currentDate,
  view,
  setView,
  eventFilter,
  setEventFilter,
  loading,
  onRefresh,
  onNavigate,
  onToday,
}) => {
  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center gap-4">
        <h1 className="text-3xl font-bold">
          {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="hover:bg-gray-200 rounded-lg p-1 flex gap-1">
          <button
            onClick={() => setEventFilter("all")}
            className={`px-3 py-1.5 rounded ${eventFilter === "all" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            All Events
          </button>
          <button
            onClick={() => setEventFilter("my-embassy")}
            className={`px-3 py-1.5 rounded ${eventFilter === "my-embassy" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            My Embassy Events
          </button>
        </div>
        <button
          onClick={onRefresh}
          className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-200"
          disabled={loading}
        >
          <span className="px-2">Refresh</span>
        </button>
        <div className="bg-gray-200 rounded-lg p-0 flex gap-1">
          <button
            onClick={() => setView("month")}
            className={`px-3 py-1.5 rounded ${view === "month" ? "bg-gray-700 text-white" : "text-gray-700"}`}
          >
            Month
          </button>
          <button
            onClick={() => setView("week")}
            className={`px-3 py-1.5 rounded ${view === "week" ? "bg-gray-700 text-white" : "text-gray-700"}`}
          >
            Week
          </button>
          <button
            onClick={() => setView("day")}
            className={`px-3 py-1.5 rounded ${view === "day" ? "bg-gray-700 text-white" : "text-gray-700"}`}
          >
            Day
          </button>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onNavigate("prev")}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-200"
          >
            <FiChevronLeft size={20} />
          </button>
          <button
            onClick={onToday}
            className="px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-200"
          >
            Today
          </button>
          <button
            onClick={() => onNavigate("next")}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-200"
          >
            <FiChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};
