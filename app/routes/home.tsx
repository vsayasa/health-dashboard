import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Vitametrics - Home" },
    { name: "description", content: "Welcome to Vitametrics!" },
  ];
}

export default function Home() {
  return <Welcome />;
}
