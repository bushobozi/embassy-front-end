import { useState, useEffect } from "react";
import type { Route } from "./+types/Staff";
import type { StaffOverview } from "./types/StaffOverview";
import { useAuth } from "~/contexts/AuthContext";
import StatsCard from "~/components/staff/stats-card/StatsCard";
import { Banner } from "~/components";
import StaffList from "./staff-list/StaffList";
export function meta({}: Route.MetaArgs) {
  return [
    { title: "Staff" },
    { name: "description", content: "Embassy Staff" },
  ];
}

export default function Staff() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [staffOverview, setStaffOverview] = useState<StaffOverview | null>(null);
  const { accessToken, user} = useAuth();
  const embassyId = user?.embassy_id;
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const STAFF_OVERVIEW_URL = `${URL}/staff/stats/summary`;

  const fetchStaffOverview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${STAFF_OVERVIEW_URL}?embassy_id=${embassyId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch staff overview");
      }

      const data = await response.json();
      setStaffOverview(data);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaffOverview();
  }, [embassyId]);
  return (
    <div className="h-full">
       <div className="w-full">
        <Banner>
        Embassy Staff Management Overview
      </Banner></div>     
      <div className="my-8 w-full">
        {staffOverview && !loading && (
          <div className="mt-0 grid grid-cols-3 sm:grid-cols-4 gap-4">
            <StatsCard title="Total Staff" value={staffOverview.total} />
            <StatsCard title="Active" value={staffOverview.byStatus.active} />
            <StatsCard title="Inactive" value={staffOverview.byStatus.inactive} />
            <StatsCard title="On-Leave" value={staffOverview.byStatus.onLeave} />
            <StatsCard title="Retired Staff" value={staffOverview.byStatus.retired} />
            <StatsCard title="Male Staff" value={staffOverview.byGender.male ?? 0} />
            <StatsCard title="Female Staff" value={staffOverview.byGender.female ?? 0} />
            <StatsCard title="Other" value={staffOverview.byGender.other ?? 0} />
            <StatsCard title="Transferred" value={staffOverview.transferred ?? 0} />
            {Object.entries(staffOverview.byDepartment).map(([dept, count]) => (
              <StatsCard key={dept} title={`${dept} Staff`} value={count} />
            ))}
          </div>
        )}
         {loading && (
        <div className="flex flex-col items-center my-16 gap-2 justify-center h-full w-full">
          <div className="flex w-52 flex-col gap-4">
            <div className="flex items-center gap-4">
              <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
              <div className="flex flex-col gap-4">
                <div className="skeleton h-4 w-20"></div>
                <div className="skeleton h-4 w-28"></div>
              </div>
            </div>
            <div className="skeleton h-32 w-full"></div>
          </div>
        </div>
      )}
      {error && (
        <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
          <span>{error}</span>
        </div>
      )}
      </div>
      <div className="w-full">
      <StaffList />
      </div>
    </div>
  );
}
