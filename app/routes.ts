import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  layout("components/layouts/protected/ProtectedLayout.tsx", [
    layout("components/layouts/dashboard/DashboardLayout.tsx", [
      layout("components/layouts/home-layout/HomeLayout.tsx", [
        route("home_embassy", "routes/dashboard/Dashboard.tsx"),
        route("embassy_overview", "routes/overview/Overview.tsx"),
        route(
          "publications_write",
          "routes/publications/write-publication/write-publications.tsx"
        ),
      ]),
      route("settings", "routes/settings/Settings.tsx"),
      route("publications", "routes/publications/Publications.tsx"),
      route("messages", "routes/messages/Messages.tsx"),
      layout("components/layouts/tasks/TasksLayout.tsx", [
        route("tasks", "routes/tasks/Tasks.tsx"),
      ]),
      route("events", "routes/events/Events.tsx"),
      layout("components/layouts/staff-page/StaffLayout.tsx", [
        route("embassy_staff", "routes/staff/Staff.tsx"),
        route("embassy_staff_list", "routes/staff/staff-list/StaffList.tsx"),
        route("embassy_staff_add", "routes/staff/add-staff/AddStaff.tsx"),
        route("embassy_staff_profile/:staffId/page", "routes/staff/staff-profile/StaffProfile.tsx"),
      ]),
      route("user", "routes/user/User.tsx"),
    ]),
  ]),
  layout("components/layouts/login/LoginLayout.tsx", [
    route("consular_login", "routes/login/Login.tsx"),
  ]),
  route("logout", "routes/logout/Logout.tsx"),
] satisfies RouteConfig;
