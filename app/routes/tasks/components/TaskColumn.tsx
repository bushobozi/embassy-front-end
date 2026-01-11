import type { Task, TaskStatus } from "../types";
import TaskCard from "./TaskCard";

interface TaskColumnProps {
  status: TaskStatus;
  title: string;
  bgColor: string;
  tasks: Task[];
  onStatusChange: (taskId: string, newStatus: TaskStatus) => Promise<void>;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onRefresh?: () => void;
}

export default function TaskColumn({
  status,
  title,
  bgColor,
  tasks,
  onStatusChange,
  onTaskUpdate,
  onTaskDelete,
  onRefresh,
}: TaskColumnProps) {
  return (
    <div className={`${bgColor} rounded-3xl border border-gray-200 shadow-0 p-4 min-h-125`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-gray-800">{title}</h3>
        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-600">
          {tasks.length}
        </span>
      </div>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No tasks in this column</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onStatusChange={onStatusChange}
              onTaskUpdate={onTaskUpdate}
              onTaskDelete={onTaskDelete}
              onRefresh={onRefresh}
            />
          ))
        )}
      </div>
    </div>
  );
}
