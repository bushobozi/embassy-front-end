import type { Route } from "./+types/Events"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Events" },
    { name: "description", content: "Embassy Events Page" },
  ];
}

export default function Events() {
    return(
        <div>Events Page</div>
    )
}