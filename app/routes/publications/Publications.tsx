import type { Route } from "./+types/Publications"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Publications" },
    { name: "description", content: "Embassy Publications Page" },
  ];
}

export default function Publications() {
    return(
        <div>Publications Page</div>
    )
}