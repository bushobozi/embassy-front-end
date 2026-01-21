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
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between mb-4 md:mb-6 lg:mb-8 gap-4">
      <div className="flex items-center gap-2 md:gap-4">
        <h1 className="text-xl md:text-2xl lg:text-3xl font-bold">
          {monthNames[currentDate.getMonth()]}, {currentDate.getFullYear()}
        </h1>
      </div>

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4 w-full lg:w-auto">
        <div className="hover:bg-gray-200 rounded-lg p-1 flex gap-1 w-full sm:w-auto overflow-x-auto">
          <button
            onClick={() => setEventFilter("all")}
            className={`px-2 md:px-3 py-1.5 rounded text-sm whitespace-nowrap ${eventFilter === "all" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            All Events
          </button>
          <button
            onClick={() => setEventFilter("my-embassy")}
            className={`px-2 md:px-3 py-1.5 rounded text-sm whitespace-nowrap ${eventFilter === "my-embassy" ? "bg-blue-600 text-white" : "text-gray-700"}`}
          >
            My Embassy Events
          </button>
        </div>
        
        <div className="flex items-center gap-2 md:gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <button
            onClick={onRefresh}
            className="p-1.5 rounded-lg border border-gray-200 hover:bg-gray-200 flex items-center"
            disabled={loading}
          >
            <FiRefreshCw size={16} className="md:hidden" />
            <span className="hidden md:inline px-2">Refresh</span>
          </button>
          
          <div className="bg-gray-200 rounded-lg p-0 flex gap-1">
            <button
              onClick={() => setView("month")}
              className={`px-2 md:px-3 py-1.5 rounded text-xs md:text-sm ${view === "month" ? "bg-gray-700 text-white" : "text-gray-700"}`}
            >
              Month
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-2 md:px-3 py-1.5 rounded text-xs md:text-sm ${view === "week" ? "bg-gray-700 text-white" : "text-gray-700"}`}
            >
              Week
            </button>
            <button
              onClick={() => setView("day")}
              className={`px-2 md:px-3 py-1.5 rounded text-xs md:text-sm ${view === "day" ? "bg-gray-700 text-white" : "text-gray-700"}`}
            >
              Day
            </button>
          </div>
          
          <div className="flex items-center gap-1 md:gap-2">
            <button
              onClick={() => onNavigate("prev")}
              className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:bg-gray-200"
            >
              <FiChevronLeft size={18} className="md:w-5 md:h-5" />
            </button>
            <button
              onClick={onToday}
              className="px-2 md:px-4 py-1.5 md:py-2 rounded-lg border border-gray-200 hover:bg-gray-200 text-sm md:text-base"
            >
              Today
            </button>
            <button
              onClick={() => onNavigate("next")}
              className="p-1.5 md:p-2 rounded-lg border border-gray-200 hover:bg-gray-200"
            >
              <FiChevronRight size={18} className="md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
