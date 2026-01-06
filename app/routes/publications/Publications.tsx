import type { Route } from "./+types/Publications"
import { EmbassyPublications } from "~/components";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "My Publications" },
    { name: "description", content: "Embassy Publications Page" },
  ];
}

export default function Publications() {
    return(
        <EmbassyPublications />
    )
}