import { Button } from "~/components";

interface UserProfileHeaderProps {
  firstName: string;
  middleName: string | null;
  lastName: string;
  role: string | null;
  department: string | null;
  refreshUserData: () => void;
  isRefreshing?: boolean;
}

export default function UserProfileHeader({
  firstName,
  middleName,
  lastName,
  role,
  department,
  refreshUserData,
  isRefreshing = false,
}: UserProfileHeaderProps) {
  const user_id = localStorage.getItem("user_id");
  function formatRoleDepartment(text: string | null) {
    if (!text) return "---";
    return text.replace(/_/g, " ");
  }
  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center gap-4">
        <h2 className="text-xl font-semibold text-gray-800">
          {firstName} {middleName || ""} {lastName}
        </h2>
        <span className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm font-medium capitalize">
          {formatRoleDepartment(role) || "---"}
        </span>
        <span className="px-3 py-1 bg-green-100 text-green-600 rounded-full text-sm font-medium capitalize">
          {formatRoleDepartment(department) || "---"}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="md"
          onClick={refreshUserData}
          disabled={isRefreshing}
        >
          {isRefreshing ? (
            <>
              <span className="loading loading-spinner loading-sm mr-2"></span>
              Refreshing...
            </>
          ) : (
            "Refresh"
          )}
        </Button>
      </div>
    </div>
  );
}
