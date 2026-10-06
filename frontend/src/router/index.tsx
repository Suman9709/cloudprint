import { createBrowserRouter } from "react-router-dom";
import { UserLayout } from "../Layout/UserLayout";
import HomePage from "../Pages/HomePage";
import { AuthLayout } from "../Layout/AuthLayout";
import { DashboardLayout } from "../Layout/DashboardLayout";
import NotFound from "../components/NotFound";

export const router = createBrowserRouter([
    // public routes
    {
        element: <UserLayout />,
        children: [
            {
                path: "/",
                element: <HomePage />
            },
            {
                path: '*',
                element: <NotFound />
            }
        ]
    },
    // authenticated routes
    {
        path: "/auth",
        element: <AuthLayout />,
        children: [
            {
                path: "login",
                element: <div>Login</div>
            },
            {
                path: "register",
                element: <div>Register</div>
            },
            {
                path: "profile",
                element: <div>Profile</div>
            }
        ]
    },

    // shop dashboard routes
    {
        path: "/dashboard",
        element: <DashboardLayout />,
        children: [
            {
                index: true,
                element: <div>Dashboard Home</div>
            }
        ]
    }

])