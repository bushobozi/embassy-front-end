import { Banner, StatsCard } from "~/components";
import type { Route } from "./+types/Tasks";
import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import type { TasksOverview } from "./types/TasksOver";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasks" },
    { name: "description", content: "Manage daily tasks" },
  ];
}

export default function Tasks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasksOverview, setTasksOverview] = useState<TasksOverview | null>(
    null
  );
  const { accessToken, user } = useAuth();
  const embassyId = user?.embassy_id;
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const TASKS_OVERVIEW_URL = `${URL}/tasks/stats/summary`;

  const fetchTasksOverview = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${TASKS_OVERVIEW_URL}?embassy_id=${embassyId}`,
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
        throw new Error(errorData.message || "Failed to fetch tasks overview");
      }

      const data = await response.json();
      setTasksOverview(data);
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
    fetchTasksOverview();
  }, [embassyId, token]);
  return (
    <>
      <div>
        <Banner>Tasks Summary</Banner>
        <div className="my-8 w-full">
          {tasksOverview && !loading && (
            <div className="grid grid-cols-1 sm:grid-cols-8 gap-4">
              <StatsCard title="Total Tasks" value={tasksOverview.total} />
              <StatsCard
                title="Pending Tasks"
                value={tasksOverview.byStatus.pending}
              />
              <StatsCard
                title="In Progress Tasks"
                value={tasksOverview.byStatus.inProgress}
              />
              <StatsCard
                title="Completed Tasks"
                value={tasksOverview.byStatus.completed}
              />
              <StatsCard
                title="Low Priority Tasks"
                value={tasksOverview.byPriority.low}
              />
              <StatsCard
                title="Medium Priority Tasks"
                value={tasksOverview.byPriority.medium}
              />
              <StatsCard
                title="High Priority Tasks"
                value={tasksOverview.byPriority.high}
              />
              <StatsCard title="Urgent Tasks" value={tasksOverview.urgent} />
              <StatsCard title="Overdue Tasks" value={tasksOverview.overdue} />
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
      </div>
    </>
  );
}
