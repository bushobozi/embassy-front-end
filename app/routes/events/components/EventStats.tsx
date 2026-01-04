import React from "react";
import type { EmbassyEvent } from "./types";

interface EventStatsProps {
  events: EmbassyEvent[];
}

export const EventStats: React.FC<EventStatsProps> = ({ events }) => {
  const activeCount = events.filter((e) => e.is_active).length;
  const publicCount = events.filter((e) => e.is_public).length;
  const paidCount = events.filter((e) => e.is_paid).length;

  return (
    <div className="border border-gray-200 bg-white rounded-2xl p-6">
      <h3 className="font-semibold text-gray-950 mb-4">Event Statistics</h3>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Events</span>
          <span className="font-semibold">{events.length}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Active</span>
          <span className="font-semibold">{activeCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Public</span>
          <span className="font-semibold">{publicCount}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Paid Events</span>
          <span className="font-semibold">{paidCount}</span>
        </div>
      </div>
    </div>
  );
};
