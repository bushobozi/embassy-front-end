import type { Route } from "./+types/Dashboard";
import { Publications } from "~/components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Home" },
    { name: "description", content: "Embassy Dashboard Page" },
  ];
}

export default function Dashboard() {
  return (
    <div>
       <Publications />    
    </div>
  );
}
