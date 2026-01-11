import type { Task, TaskStatus } from "../types";
import TaskColumn from "./TaskColumn";

interface TasksBoardProps {
  tasks: Task[];
  loading: boolean;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onRefresh?: () => void;
}

export default function TasksBoard({
  tasks,
  loading,
  onStatusChange,
  onTaskUpdate,
  onTaskDelete,
  onRefresh,
}: TasksBoardProps) {
  const columns: { status: TaskStatus; title: string; bgColor: string }[] = [
    { status: "pending", title: "To Do", bgColor: "bg-gray-100" },
    { status: "in-progress", title: "In Progress", bgColor: "bg-blue-50" },
    { status: "completed", title: "Completed", bgColor: "bg-green-50" },
  ];

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex flex-col items-center gap-4">
          <div className="skeleton h-16 w-16 shrink-0 rounded-full"></div>
          <div className="skeleton h-4 w-32"></div>
        </div>
      </div>
    );
  }

  return (
   <div>
     <h1 className="my-5 text-2xl font-bold text-blue-900">Tasks Management</h1>
    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-6 p-0">
      {columns.map((column) => (
        <TaskColumn
          key={column.status}
          status={column.status}
          title={column.title}
          bgColor={column.bgColor}
          tasks={getTasksByStatus(column.status)}
          onStatusChange={onStatusChange}
          onTaskUpdate={onTaskUpdate}
          onTaskDelete={onTaskDelete}
          onRefresh={onRefresh}
        />
      ))}
    </div>
   </div>
  );
}
