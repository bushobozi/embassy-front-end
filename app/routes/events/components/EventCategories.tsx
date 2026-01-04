import React from "react";

export const EventCategories: React.FC = () => {
  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-950 font-semibold">Event Categories</h3>
      </div>
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-1 bg-blue-400 rounded-full"></div>
          <span className="text-gray-950">Conference</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-1 bg-purple-500 rounded-full"></div>
          <span className="text-gray-950">National Day</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-1 bg-green-400 rounded-full"></div>
          <span className="text-gray-950">Visa Outreach</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-1 bg-pink-400 rounded-full"></div>
          <span className="text-gray-950">Cultural Event</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-1 bg-yellow-400 rounded-full"></div>
          <span className="text-gray-950">Training</span>
        </div>
      </div>
    </div>
  );
};
