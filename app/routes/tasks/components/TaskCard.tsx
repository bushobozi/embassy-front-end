import type { Task, TaskStatus, TaskPriority } from "../types";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onRefresh?: () => void;
}

export default function TaskCard({
  task,
  onStatusChange,
  onTaskUpdate,
  onTaskDelete,
  onRefresh,
}: TaskCardProps) {
  const { user, accessToken } = useAuth();
  const [showToast, setShowToast] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [showDropdown, setShowDropdown] = useState(false);
  const deleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const URL = import.meta.env.VITE_API_URL;

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "bg-green-100 text-green-800 border-green-200";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "high":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityIcon = (priority: TaskPriority) => {
    switch (priority) {
      case "low":
        return "";
      case "medium":
        return "";
      case "high":
        return "";
      default:
        return "";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && task.status !== "completed";
  };

  const startDeleteCountdown = () => {
    setShowToast(true);
    setCountdown(5);

    countdownIntervalRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          if (countdownIntervalRef.current) {
            clearInterval(countdownIntervalRef.current);
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    deleteTimerRef.current = setTimeout(() => {
      executeDelete();
    }, 5000);
  };

  const undoDelete = () => {
    if (deleteTimerRef.current) {
      clearTimeout(deleteTimerRef.current);
    }
    if (countdownIntervalRef.current) {
      clearInterval(countdownIntervalRef.current);
    }
    setShowToast(false);
    setCountdown(5);
  };

  const executeDelete = async () => {
    try {
      const response = await fetch(
        `${URL}/tasks/${task.id}?embassy_id=${user?.embassy_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const responseText = await response.text();
      let data;

      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error("Failed to parse response:", responseText);
        }
      }

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete task");
      }

      setShowToast(false);
      onTaskDelete(task.id);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error deleting task:", error);
      setShowToast(false);
    }
  };

  const handleStatusChange = async (newStatus: TaskStatus) => {
    if (newStatus === task.status) return;
    
    try {
      await onStatusChange(task.id, newStatus);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error changing status:", error);
    }
  };

  const handlePriorityChange = async (newPriority: TaskPriority) => {
    if (newPriority === task.priority) return;

    try {
      const response = await fetch(
        `${URL}/tasks/${task.id}/priority/${newPriority}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update priority");
      }

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating priority:", error);
    }
  };

  const handleUrgentToggle = async () => {
    try {
      const endpoint = task.is_urgent ? 'unmark-urgent' : 'mark-urgent';
      const response = await fetch(
        `${URL}/tasks/${task.id}/${endpoint}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update urgent flag");
      }

      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error updating urgent flag:", error);
    }
  };

  useEffect(() => {
    return () => {
      if (deleteTimerRef.current) {
        clearTimeout(deleteTimerRef.current);
      }
      if (countdownIntervalRef.current) {
        clearInterval(countdownIntervalRef.current);
      }
    };
  }, []);

  return (
    <>
      {showToast && (
        <div className="toast toast-top toast-center z-50">
          <div className="alert alert-warning shadow-lg">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="stroke-current shrink-0 h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>
                Task will be deleted in {countdown} second{countdown !== 1 ? "s" : ""}
              </span>
            </div>
            <button
              onClick={undoDelete}
              className="btn btn-sm btn-ghost hover:bg-gray-200"
            >
              Undo
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-2xl p-4 shadow-0 hover:shadow-md transition-shadow border border-gray-200">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 mb-1">{task.title}</h4>
            <p className="text-sm text-gray-600 line-clamp-2">
              {task.description}
            </p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowDropdown(!showDropdown)}
              className="text-gray-500 hover:text-gray-700 p-1"
            >
              <svg
                className="w-5 h-5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onTaskUpdate(task);
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Edit Task
                  </button>
                  <button
                    onClick={() => {
                      handleUrgentToggle();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {task.is_urgent ? "Remove Urgent" : "Mark as Urgent"}
                  </button>
                  <hr className="my-1" />
                  <button
                    onClick={() => {
                      startDeleteCountdown();
                      setShowDropdown(false);
                    }}
                    className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                  >
                    Delete Task
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-3">
          <span
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(
              task.priority
            )}`}
          >
            {getPriorityIcon(task.priority)} {task.priority}
          </span>
          {task.is_urgent && (
            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium bg-red-200 text-red-900">
            Urgent
            </span>
          )}
          {task.due_date && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                isOverdue(task.due_date)
                  ? "bg-red-100 text-red-800"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {formatDate(task.due_date)}
              {isOverdue(task.due_date) && " (Overdue)"}
            </span>
          )}
        </div>

        {task.assigned_to && task.assigned_to.first_name && task.assigned_to.last_name && (
          <div className="flex items-center gap-2 mb-3 text-sm text-gray-600">
            <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-semibold">
              {task.assigned_to.first_name[0]}
              {task.assigned_to.last_name[0]}
            </div>
            <span>
              {task.assigned_to.first_name} {task.assigned_to.last_name}
            </span>
          </div>
        )}
        <div className="avatar-group -space-x-6">
  <div className="avatar">
    <div className="w-10">
      <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp" />
    </div>
  </div>
  <div className="avatar">
    <div className="w-10">
      <img src="https://img.daisyui.com/images/profile/demo/spiderperson@192.webp" />
    </div>
  </div>
  <div className="avatar">
    <div className="w-10">
      <img src="https://img.daisyui.com/images/profile/demo/averagebulk@192.webp" />
    </div>
  </div>
  <div className="avatar avatar-placeholder">
    <div className="bg-neutral text-neutral-content w-10">
      <span>+99</span>
    </div>
  </div>
</div>

        {/* <div className="flex gap-2">
          <select
            value={task.status}
            onChange={(e) => handleStatusChange(e.target.value as TaskStatus)}
            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="pending">To Do</option>
            <option value="in-progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
          <select
            value={task.priority}
            onChange={(e) =>
              handlePriorityChange(e.target.value as TaskPriority)
            }
            className="flex-1 text-xs border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div> */}
      </div>
    </>
  );
}
