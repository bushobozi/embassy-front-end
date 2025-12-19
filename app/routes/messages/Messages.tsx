import type { Route } from "./+types/Messages"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Messages and Inbox" },
    { name: "description", content: "Embassy Messages Page" },
  ];
}

export default function Messages() {
    return(
        <div>Messages Page</div>
    )
}