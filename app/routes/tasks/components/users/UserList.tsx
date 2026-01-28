import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";

interface User {
  id: string;
  email: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  profile_picture?: string;
  role: string;
}

interface UserListProps {
  selectedUserId: string | null;
  onUserSelect: (userId: string | null) => void;
  selectedStatus: string | null;
  onStatusSelect: (status: string | null) => void;
  selectedPriority: string | null;
  onPrioritySelect: (priority: string | null) => void;
}

export default function UserList({
  selectedUserId,
  onUserSelect,
  selectedStatus,
  onStatusSelect,
  selectedPriority,
  onPrioritySelect,
}: UserListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user: currentUser, accessToken } = useAuth();
  const URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    fetchUsers();
  }, [currentUser?.embassy_id]);

  const fetchUsers = async () => {
    if (!currentUser?.embassy_id) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `${URL}/users?embassy_id=${currentUser.embassy_id}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch users");
      }

      const data = await response.json();
      setUsers(Array.isArray(data) ? data : data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
      setUsers([]);
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId: string) => {
    onUserSelect(selectedUserId === userId ? null : userId);
  };

  const handleStatusClick = (status: string) => {
    onStatusSelect(selectedStatus === status ? null : status);
  };

  const handlePriorityClick = (priority: string) => {
    onPrioritySelect(selectedPriority === priority ? null : priority);
  };

  const statuses = [
    { value: "pending", label: "Pending" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];

  const priorities = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
  ];

  return (
    <div className="space-y-6 mt-5">
      {/* Users Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-blue-900">Filter by User</h2>
          {selectedUserId && (
            <button
              onClick={() => onUserSelect(null)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>
        {loading ? (
          <div className="text-sm text-gray-500">Loading users...</div>
        ) : error ? (
          <div className="text-sm text-red-500">{error}</div>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {users.map((user) => {
              const isSelected = selectedUserId === user.id;
              return (
                <li key={user.id}>
                  <button
                    onClick={() => handleUserClick(user.id)}
                    className={`w-full text-left rounded-3xl transition-all duration-200 cursor-pointer p-3 ${
                      isSelected
                        ? "bg-yellow-300 border-0 hover:bg-yellow-400 transition-colors"
                        : "bg-yellow-100 hover:bg-yellow-100/50 transition-colors hover:border-yellow-300"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {user.profile_picture ? (
                        <img
                          src={user.profile_picture}
                          alt={`${user.first_name} ${user.last_name}`}
                          className="w-10 h-10 rounded-full object-cover border-2 border-yellow-300"
                        />
                      ) : (
                        <div className="w-10 h-10 rounded-full bg-blue-200 flex items-center justify-center border-2 border-yellow-300">
                          <span className="text-sm font-bold text-gray-700">
                            {user.first_name.charAt(0)}
                            {user.middle_name ? user.middle_name.charAt(0) : ""}
                            {user.last_name.charAt(0)}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-semibold text-sm text-gray-900">
                          {user.first_name} {user.last_name}
                        </h3>
                        <p className="text-xs text-gray-600">{user.email}</p>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Status Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-blue-900">Filter by Status</h2>
          {selectedStatus && (
            <button
              onClick={() => onStatusSelect(null)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {statuses.map((status) => {
            const isSelected = selectedStatus === status.value;
            return (
              <li key={status.value}>
                <button
                  onClick={() => handleStatusClick(status.value)}
                  className={`w-full text-left rounded-2xl transition-all duration-200 cursor-pointer px-4 py-2 ${
                    isSelected
                      ? "bg-blue-500 text-white hover:bg-blue-600"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span className="font-medium text-sm">{status.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Priority Filter */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-blue-900">Filter by Priority</h2>
          {selectedPriority && (
            <button
              onClick={() => onPrioritySelect(null)}
              className="text-xs text-blue-600 hover:text-blue-800"
            >
              Clear
            </button>
          )}
        </div>
        <ul className="space-y-2">
          {priorities.map((priority) => {
            const isSelected = selectedPriority === priority.value;
            return (
              <li key={priority.value}>
                <button
                  onClick={() => handlePriorityClick(priority.value)}
                  className={`w-full text-left rounded-2xl transition-all duration-200 cursor-pointer px-4 py-2 ${
                    isSelected
                      ? "bg-green-500 text-white hover:bg-green-600"
                      : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                  }`}
                >
                  <span className="font-medium text-sm">{priority.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}