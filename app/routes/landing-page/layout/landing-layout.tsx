import { Outlet } from "react-router";

export default function LandingLayout() {
  return (
    <div className="min-w-screen min-h-screen bg-gray-50/90">
      <Outlet />
    </div>
  );
}
