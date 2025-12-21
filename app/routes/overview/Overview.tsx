import type { Route } from "./+types/Overview"
import { Banner, Stats } from "~/components"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Overview" },
    { name: "description", content: "Embassy Overview Page" },
  ];
}

export default function Overview(){
    return(
        <>
        <Banner />
        <Stats />
        </>
    )
}