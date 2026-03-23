import { type RouteConfig, index, layout, route} from "@react-router/dev/routes";

export default [
    // Public Routes (website homepage)
    index("routes/home.tsx"),
    
    // Auth Routes
    layout("./layouts/AuthLayout.tsx", [
        route("login", "./routes/login.tsx"),
        route("register", "./routes/register.tsx"),
    ]),

    // Protected Routes (auth req: what to display when user is logged in)
    layout("./layouts/ProtectedLayout.tsx", [
        route("dashboard", "./routes/dashboard.tsx"),
    ]),



] satisfies RouteConfig;
