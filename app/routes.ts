import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  // Public Routes
  index("routes/home.tsx"),

  // Auth Routes
  layout("./layouts/AuthLayout.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),

  // Protected Routes
  layout("./layouts/ProtectedLayout.tsx", [
    route("dashboard", "./routes/dashboard.tsx"),
    route("goals", "./routes/goals.tsx"),
  ]),

] satisfies RouteConfig;