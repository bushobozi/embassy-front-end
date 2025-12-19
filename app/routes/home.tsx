import type { Route } from "./+types/home";
import { LandingPage } from "./landing-page";
import { Welcome } from "~/welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Welcome" },
    { name: "description", content: "Embassy Dashboard" },
  ];
}

export default function Home() {
  return <Welcome />;
}
