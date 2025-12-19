import type { Route } from "./+types/Staff"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Staff" },
    { name: "description", content: "Embassy Staff Page" },
  ];
}

export default function Staff() {
    return(
        <div>Staff Page</div>
    )
}