import { createBrowserRouter } from "react-router-dom";
import { UserLayout } from "../Layout/UserLayout";
import HomePage from "../Pages/HomePage";
import { AuthLayout } from "../Layout/AuthLayout";
import { DashboardLayout } from "../Layout/DashboardLayout";
import NotFound from "../components/NotFound";
import LoginPage from "../Pages/auth/LoginPage";
import SignupPage from "../Pages/auth/SignupPage";
import StudentDashboard from "../Pages/dashboard/StudentDashboard";
import PaymentPage from "../Pages/PaymentPage";
import { CookiePolicyPage, PrivacyPolicyPage, RefundPolicyPage, TermsOfUsePage } from "../Pages/legal/LegalPages";

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
            },
            {
                path: "privacy-policy",
                element: <PrivacyPolicyPage />
            },
            {
                path: "terms-of-use",
                element: <TermsOfUsePage />
            },
            {
                path: "cookie-policy",
                element: <CookiePolicyPage />
            },
            {
                path: "refund-policy",
                element: <RefundPolicyPage />
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
                element: <LoginPage />
            },
            {
                path: "register",
                element: <SignupPage />
            },
            {
                path: "profile",
                element: <div>Profile</div>
            }
        ]
    },

    // student workspace routes
    {
        path: "/student",
        element: <DashboardLayout />,
        children: [
            {
                path: "dashboard",
                element: <StudentDashboard />
            },
            {
                path: "payment",
                element: <PaymentPage />
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
