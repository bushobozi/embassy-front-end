import type { Route } from "./+types/Messages";
import { FancyText } from "~/components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Messages and Inbox" },
    { name: "description", content: "Embassy Messages Page" },
  ];
}

export default function Messages() {
  return (
    <div>
      Messages Page
      <FancyText
        title="Welcome to the Messages Page!"
        text="Here you can view and manage your messages."
      />
    </div>
  );
}
