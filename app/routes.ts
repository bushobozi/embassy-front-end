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
        route(
          "publications_write",
          "routes/publications/write-publication/write-publications.tsx"
        ),
        route("publication_detail_view_id/:publicationId/viewed", "routes/publications/view-publication/ViewPublication.tsx"),
        route("em_my_publications", "routes/publications/Publications.tsx"),
        route("em_manage_publications", "routes/publications/manage-publications/ManagePublications.tsx"),
        route("publications_update_em/:publicationId/update", "routes/publications/edit-publication/EditPublication.tsx"),
        route("information_desk_boards", "routes/information-boards/InformationBoards.tsx"),
      ]),
      route("settings", "routes/settings/Settings.tsx"),      
      route("messages", "routes/messages/Messages.tsx"),
      layout("components/layouts/tasks/TasksLayout.tsx", [
        route("tasks", "routes/tasks/Tasks.tsx"),
      ]),
      layout("components/layouts/events/EventsLayout.tsx", [
        route("events", "routes/events/events-page.tsx"),
      ]),
      layout("components/layouts/staff-page/StaffLayout.tsx", [
        route("embassy_staff", "routes/staff/Staff.tsx"),
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
