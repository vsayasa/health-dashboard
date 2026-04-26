import { type RouteConfig, index, layout, route } from "@react-router/dev/routes";

export default [
  //Public routes
  index("routes/home.tsx"),

  //Auth routes
  layout("./layouts/AuthLayout.tsx", [
    route("login", "./routes/login.tsx"),
    route("register", "./routes/register.tsx"),
  ]),

  //Protected routes
  layout("./layouts/ProtectedLayout.tsx", [
    route("dashboard", "./routes/dashboard.tsx"),
    route("logmetrics", "./routes/logmetrics.tsx"),
    route("goals", "./routes/goals.tsx"),
    route("files", "./routes/files.tsx"),
  ]),
] satisfies RouteConfig;