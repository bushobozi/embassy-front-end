import { useState, useEffect } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { Banner, Button } from "~/components";
import type { User } from "./types";
import {
  RiSearchLine,
  RiMailLine,
  RiPhoneLine,
  RiMapPinLine,
  RiBuilding2Line,
  RiUserLine,
  RiCheckboxCircleLine,
  RiCloseCircleLine,
  RiShieldCheckLine,
  RiUserUnfollowLine,
  RiAlertLine,
} from "react-icons/ri";
import { BiTrash } from "react-icons/bi";

export function meta() {
  return [
    { title: "Users" },
    { name: "description", content: "Embassy Users Management" },
  ];
}

export default function Users() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<"activate" | "deactivate" | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { accessToken, user } = useAuth();
  const embassyId = user?.embassy_id;
  const token = accessToken;
  const URL = import.meta.env.VITE_API_URL;

  // Filters
  const [roleFilter, setRoleFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [activeFilter, setActiveFilter] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const roleOptions = ["user", "admin", "super_admin", "editor"];
  const activeOptions = [
    { label: "Active", value: "active" },
    { label: "Inactive", value: "in-active" },
  ];

  const fetchUsers = async () => {
    if (!embassyId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams({
        embassy_id: embassyId,
      });

      const response = await fetch(`${URL}/users?${params.toString()}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch users");
      }

      const data: User[] = await response.json();
      setUsers(data);
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
    if (embassyId) {
      fetchUsers();
    }
  }, [embassyId, token, URL]);

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => setSuccessMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Open modal for activate/deactivate
  const openModal = (userToModify: User, type: "activate" | "deactivate") => {
    setSelectedUser(userToModify);
    setModalType(type);
  };

  // Close modal
  const closeModal = () => {
    setSelectedUser(null);
    setModalType(null);
  };

  // Handle activate user
  const handleActivate = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${URL}/users/${selectedUser.id}/activate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to activate user");
      }

      setSuccessMessage(`${selectedUser.first_name} ${selectedUser.last_name} has been activated successfully.`);
      closeModal();
      fetchUsers(); // Refresh the list
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Handle deactivate user
  const handleDeactivate = async () => {
    if (!selectedUser) return;

    setActionLoading(true);
    try {
      const response = await fetch(`${URL}/users/${selectedUser.id}/deactivate`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to deactivate user");
      }

      setSuccessMessage(`${selectedUser.first_name} ${selectedUser.last_name} has been deactivated successfully.`);
      closeModal();
      fetchUsers(); // Refresh the list
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    } finally {
      setActionLoading(false);
    }
  };

  // Filter users client-side (search, role, department, status)
  const filteredUsers = users.filter((u) => {
    // Search filter
    if (searchQuery) {
      const fullName = `${u.first_name} ${u.middle_name || ""} ${u.last_name}`.toLowerCase();
      const email = u.email.toLowerCase();
      const query = searchQuery.toLowerCase();
      if (!fullName.includes(query) && !email.includes(query)) {
        return false;
      }
    }

    // Role filter
    if (roleFilter && u.role !== roleFilter) {
      return false;
    }

    // Department filter
    if (departmentFilter && u.department !== departmentFilter) {
      return false;
    }

    // Active status filter
    if (activeFilter) {
      const isActive = activeFilter === "active";
      if (u.is_active !== isActive) {
        return false;
      }
    }

    return true;
  });

  // Get unique departments from users
  const departments = [...new Set(users.map((u) => u.department).filter(Boolean))];

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "super_admin":
        return "badge-error";
      case "admin":
        return "badge-warning";
      case "editor":
        return "badge-info";
      default:
        return "badge-ghost";
    }
  };

  return (
    <div className="h-full">
      <div className="w-full">
        <Banner>Embassy Users Management</Banner>
      </div>
      <div className=" mb-6">
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
          {/* Search */}
          <div>
            <label className="label text-sm font-medium">Search</label>
            <div className="relative">
              <RiSearchLine className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name or email..."
                className="input input-bordered w-full pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Role Filter */}
          <div>
            <label className="label text-sm font-medium">Role</label>
            <select
              className="select select-bordered w-full"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="">All Roles</option>
              {roleOptions.map((option) => (
                <option key={option} value={option}>
                  {option.replace("_", " ").replace(/\b\w/g, (l) => l.toUpperCase())}
                </option>
              ))}
            </select>
          </div>

          {/* Department Filter */}
          <div>
            <label className="label text-sm font-medium">Department</label>
            <select
              className="select select-bordered w-full"
              value={departmentFilter}
              onChange={(e) => setDepartmentFilter(e.target.value)}
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept} value={dept || ""}>
                  {dept}
                </option>
              ))}
            </select>
          </div>

          {/* Active Filter */}
          <div>
            <label className="label text-sm font-medium">Status</label>
            <select
              className="select select-bordered w-full"
              value={activeFilter}
              onChange={(e) => setActiveFilter(e.target.value)}
            >
              <option value="">All Status</option>
              {activeOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
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
        <div className="bg-red-100 text-red-800 p-4 rounded-xl mb-4">
          <span>{error}</span>
        </div>
      )}
      {filteredUsers.length === 0 && !loading && !error && (
        <div className="w-full text-center text-gray-600 my-8 bg-gray-100 p-6 rounded-xl">
          <RiUserLine className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p>No users found for the selected filters.</p>
        </div>
      )}
      {filteredUsers.length > 0 && !loading && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredUsers.map((u) => (
            <div
              key={u.id}
              className="bg-white rounded-3xl border border-gray-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col justify-between"
            >
              {/* Card Header */}
              <div className=" p-4">
                <div className="flex items-center gap-3">
                  <div className="avatar">
                    <div className="w-14 h-14 rounded-full ring ring-white ring-offset-2 ring-offset-blue-500">
                      <img
                        src={
                          u.profile_picture ||
                          `https://ui-avatars.com/api/?name=${u.first_name}+${u.last_name}&background=random`
                        }
                        alt={`${u.first_name} ${u.last_name}`}
                      />
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg truncate">
                      {u.first_name} {u.last_name}
                    </h3>
                    <span className={`badge badge-sm ${getRoleBadgeColor(u.role)}`}>
                      {u.role.replace("_", " ")}
                    </span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <RiMailLine className="w-4 h-4 text-gray-400 flex-shrink-0" />
                  <span className="truncate">{u.email}</span>
                </div>

                {u.phone_number && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiPhoneLine className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{u.phone_number}</span>
                  </div>
                )}

                {u.department && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiBuilding2Line className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{u.department}</span>
                  </div>
                )}

                {u.position && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiUserLine className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span>{u.position}</span>
                  </div>
                )}

                {u.address && (
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <RiMapPinLine className="w-4 h-4 text-gray-400 flex-shrink-0" />
                    <span className="truncate">{u.address}</span>
                  </div>
                )}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <div className="flex items-center gap-1">
                    {u.is_active ? (
                      <span className="flex items-center gap-1 text-green-600 text-sm">
                        <RiCheckboxCircleLine className="w-4 h-4" />
                        Active
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-red-600 text-sm">
                        <RiCloseCircleLine className="w-4 h-4" />
                        Inactive
                      </span>
                    )}
                  </div>
                  {/* Action Button */}
                  {u.is_active ? (
                    <button
                      onClick={() => openModal(u, "deactivate")}
                      className="btn btn-xs btn-outline btn-error gap-1"
                    >
                      <RiUserUnfollowLine className="w-3 h-3" />
                      Deactivate
                    </button>
                  ) : (
                    <button
                      onClick={() => openModal(u, "activate")}
                      className="btn btn-xs btn-outline btn-success gap-1"
                    >
                      <RiShieldCheckLine className="w-3 h-3" />
                      Activate
                    </button>
                  )}
                </div>
              </div>
               <div className="p-3 flex gap-2">
                  <Button block={true} size="lg" variant="secondary" rounded={true}>
                    View Profile
                  </Button>
                  <Button variant="danger" rounded={true} size="lg">
                    <BiTrash size={20} />
                  </Button>
                  </div>
            </div>
          ))}
        </div>
      )}

      {/* Success Message Toast */}
      {successMessage && (
        <div className="toast toast-bottom toast-center z-50">
          <div className="alert alert-success">
            <RiCheckboxCircleLine className="w-5 h-5" />
            <span>{successMessage}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {modalType && selectedUser && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg flex items-center gap-2">
              {modalType === "deactivate" ? (
                <>
                  <RiAlertLine className="w-6 h-6 text-error" />
                  Deactivate User
                </>
              ) : (
                <>
                  <RiShieldCheckLine className="w-6 h-6 text-success" />
                  Activate User
                </>
              )}
            </h3>

            <div className="py-4">
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl mb-4">
                <div className="avatar">
                  <div className="w-12 h-12 rounded-full">
                    <img
                      src={
                        selectedUser.profile_picture ||
                        `https://ui-avatars.com/api/?name=${selectedUser.first_name}+${selectedUser.last_name}&background=random`
                      }
                      alt={`${selectedUser.first_name} ${selectedUser.last_name}`}
                    />
                  </div>
                </div>
                <div>
                  <p className="font-semibold">
                    {selectedUser.first_name} {selectedUser.last_name}
                  </p>
                  <p className="text-sm text-gray-500">{selectedUser.email}</p>
                </div>
              </div>

              {modalType === "deactivate" ? (
                <p className="text-gray-600">
                  Are you sure you want to deactivate this user? They will no longer be able to access the system.
                </p>
              ) : (
                <p className="text-gray-600">
                  Are you sure you want to activate this user? They will regain access to the system.
                </p>
              )}
            </div>

            <div className="modal-action">
              <Button
                variant="outline"
                size="md"
                onClick={closeModal}
                disabled={actionLoading}
              >
                Cancel
              </Button>
              {modalType === "deactivate" ? (
                <Button
                  variant="danger"
                  size="md"
                  onClick={handleDeactivate}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <RiUserUnfollowLine className="w-4 h-4" />
                      Deactivate
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="md"
                  onClick={handleActivate}
                  disabled={actionLoading}
                >
                  {actionLoading ? (
                    <span className="loading loading-spinner loading-sm"></span>
                  ) : (
                    <>
                      <RiShieldCheckLine className="w-4 h-4" />
                      Activate
                    </>
                  )}
                </Button>
              )}
            </div>
          </div>
          <div className="modal-backdrop bg-black/50" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
}
