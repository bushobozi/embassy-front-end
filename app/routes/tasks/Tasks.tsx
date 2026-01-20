import { Banner, StatsCard, Button } from "~/components";
import type { Route } from "./+types/Tasks";
import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { useOutletContext } from "react-router";
import type { TasksOverview } from "./types/TasksOver";
import type { Task, TaskStatus } from "./types";
import { apolloClient } from "~/apolloClient";
import { GET_TASKS } from "./graphql";
import TasksBoard from "./components/TasksBoard";
import CreateTaskModal from "./components/CreateTaskModal";
import EditTaskModal from "./components/EditTaskModal";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Tasks" },
    { name: "description", content: "Manage daily tasks" },
  ];
}

interface TasksQueryResult {
  tasks: Task[];
}

interface TasksLayoutContext {
  selectedUserId: string | null;
  selectedStatus: string | null;
  selectedPriority: string | null;
  searchQuery: string;
  sortBy: string;
  setSelectedUserId: (id: string | null) => void;
  setSelectedStatus: (status: string | null) => void;
  setSelectedPriority: (priority: string | null) => void;
  setSearchQuery: (query: string) => void;
  setSortBy: (sortBy: string) => void;
}

export default function Tasks() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tasksOverview, setTasksOverview] = useState<TasksOverview | null>(
    null
  );
  const [tasks, setTasks] = useState<Task[]>([]);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [tasksError, setTasksError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  
  // Get filter state from layout context
  const { selectedUserId, selectedStatus, selectedPriority } = useOutletContext<TasksLayoutContext>();

  const { accessToken, user } = useAuth();
  const embassyId = user?.embassy_id;
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;
  const TASKS_OVERVIEW_URL = `${URL}/tasks/stats/summary`;

  const fetchTasks = async () => {
    if (!embassyId) {
      setTasksError("Embassy ID not found");
      return;
    }

    setTasksLoading(true);
    setTasksError(null);

    try {
      const variables: any = {
        embassy_id: embassyId,
      };
      
      if (selectedUserId) {
        variables.assigned_to = selectedUserId;
      }
      
      if (selectedStatus) {
        variables.status = selectedStatus;
      }
      
      if (selectedPriority) {
        variables.priority = selectedPriority;
      }

      const result = await apolloClient.query<TasksQueryResult>({
        query: GET_TASKS,
        variables,
        fetchPolicy: "network-only",
      });

      if (result.data?.tasks) {
        setTasks(result.data.tasks);
      }
    } catch (err) {
      setTasksError(err instanceof Error ? err.message : "Failed to fetch tasks");
      console.error("Error fetching tasks:", err);
    } finally {
      setTasksLoading(false);
    }
  };

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

  const handleRefresh = () => {
    setLoading(true);
    try {
      setRefreshKey((prev) => prev + 1);
    fetchTasks();
    fetchTasksOverview();
    } catch (error) {
      console.error("Error during refresh:", error);
    } finally {
      setLoading(false);
    }
    
  };

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    try {
      const response = await fetch(
        `${URL}/tasks/${taskId}/status/${newStatus}?embassy_id=${embassyId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update task status");
      }

      handleRefresh();
    } catch (error) {
      console.error("Error updating status:", error);
      throw error;
    }
  };

  const handleTaskUpdate = (task: Task) => {
    setSelectedTask(task);
    setShowEditModal(true);
  };

  const handleTaskDelete = (taskId: string) => {
    // Task is already deleted, just refresh
    handleRefresh();
  };

  useEffect(() => {
    fetchTasksOverview();
    fetchTasks();
  }, [embassyId, token, selectedUserId, selectedStatus, selectedPriority]);

  return (
    <>
      <div>
        <Banner>Tasks Management</Banner>

        {/* Action Bar */}
        <div className="flex justify-between items-center my-5">
          <h1 className="my-4 text-2xl font-bold text-blue-900">Tasks Overview</h1>
          <div className="flex gap-3">
            <Button
              onClick={handleRefresh}
              variant="outline"
              size="md"
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </Button>
            <Button
              onClick={() => setShowCreateModal(true)}
              variant="secondary"
              size="md"
            >
              Create Task
            </Button>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="w-full">
          {tasksOverview && !loading && (
            <div className="grid grid-cols-3 sm:grid-cols-3 gap-4">
              <StatsCard title="Total Tasks" value={tasksOverview.total} />
              <StatsCard
                title="Pending"
                value={tasksOverview.byStatus.pending}
              />
              <StatsCard
                title="In Progress"
                value={tasksOverview.byStatus.inProgress}
              />
              <StatsCard
                title="Completed"
                value={tasksOverview.byStatus.completed}
              />
              {/* <StatsCard title="Low" value={tasksOverview.byPriority.low} />
              <StatsCard
                title="Medium"
                value={tasksOverview.byPriority.medium}
              />
              <StatsCard title="High" value={tasksOverview.byPriority.high} /> */}
              <StatsCard title="Urgent" value={tasksOverview.urgent} />
              <StatsCard title="Overdue" value={tasksOverview.overdue} />
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

        {/* Kanban Board */}
        <div className="my-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Tasks Board */}
          <div className="lg:col-span-3">
            {tasksError && (
              <div className="bg-red-100 text-red-800 p-4 rounded mb-4">
                <span>Error loading tasks: {tasksError}</span>
              </div>
            )}
            <TasksBoard
              key={refreshKey}
              tasks={tasks}
              loading={tasksLoading}
              onStatusChange={handleStatusChange}
              onTaskUpdate={handleTaskUpdate}
              onTaskDelete={handleTaskDelete}
              onRefresh={handleRefresh}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={handleRefresh}
      />
      <EditTaskModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedTask(null);
        }}
        onTaskUpdated={handleRefresh}
        task={selectedTask}
      />
    </>
  );
}
