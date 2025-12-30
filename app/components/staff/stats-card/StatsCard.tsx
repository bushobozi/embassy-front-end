import type { ReactNode } from "react";

interface StatsCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  className?: string;
}

export default function StatsCard({ title, value, icon, className = "" }: StatsCardProps) {
  return (
    <div
    // border-l-6 border-l-blue-300
      className={`bg-white rounded-2xl p-6 shadow-none hover:shadow-md transition-shadow border border-blue-200  ${className}`}
    >
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h2 className="text-sm font-medium text-gray-500">{title}</h2>
          <p className="text-3xl font-bold mt-1 text-gray-800">
            {value}
          </p>
        </div>
        {icon && (
          <div className="bg-blue-100 p-3 rounded-lg text-blue-600 text-xl">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
