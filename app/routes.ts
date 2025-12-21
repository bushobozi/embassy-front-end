import {
  type RouteConfig,
  index,
  layout,
  route,
} from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
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
    route("events", "routes/events/Events.tsx"),
    route("staff", "routes/staff/Staff.tsx"),
    route("user", "routes/user/User.tsx"),
  ]),
] satisfies RouteConfig;
