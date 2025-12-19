import type { Route } from "./+types/Settings"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings" },
    { name: "description", content: "Embassy Settings Page" },
  ];
}

export default function Settings() {
    return(
        <div>Settings Page</div>
    )
}