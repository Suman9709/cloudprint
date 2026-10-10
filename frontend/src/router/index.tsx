import { createBrowserRouter } from "react-router-dom";
import { UserLayout } from "../Layout/UserLayout";
import HomePage from "../Pages/HomePage";
import { AuthLayout } from "../Layout/AuthLayout";
import { DashboardLayout } from "../Layout/DashboardLayout";
import NotFound from "../components/NotFound";
import LoginPage from "../Pages/auth/LoginPage";
import AdminLoginPage from "../Pages/auth/AdminLoginPage";
import ShopDashboard from "../Pages/dashboard/ShopDashboard";
import ShopAnalyticsPage from "../Pages/dashboard/ShopAnalyticsPage";
import ShopSettingsPage from "../Pages/dashboard/ShopSettingsPage";
import AdminDashboard from "../Pages/dashboard/AdminDashboard";
import GuestShopPage from "../Pages/public/GuestShopPage";
import { CookiePolicyPage, PrivacyPolicyPage, RefundPolicyPage, TermsOfUsePage } from "../Pages/legal/LegalPages";

export const router = createBrowserRouter([
  {
    element: <UserLayout />,
    children: [
      { path: "/", element: <HomePage /> },
      { path: "shop/:slug", element: <GuestShopPage /> },
      { path: "privacy-policy", element: <PrivacyPolicyPage /> },
      { path: "terms-of-use", element: <TermsOfUsePage /> },
      { path: "cookie-policy", element: <CookiePolicyPage /> },
      { path: "refund-policy", element: <RefundPolicyPage /> },
      { path: "*", element: <NotFound /> },
    ],
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    children: [
      { path: "login", element: <LoginPage /> },
      { path: "admin-login", element: <AdminLoginPage /> },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardLayout />,
    children: [
      { index: true, element: <ShopDashboard /> },
      { path: "paid", element: <ShopDashboard paidOnly /> },
      { path: "analytics", element: <ShopAnalyticsPage /> },
      { path: "settings", element: <ShopSettingsPage /> },
    ],
  },
  {
    path: "/admin",
    element: <DashboardLayout />,
    children: [{ path: "shops", element: <AdminDashboard /> }],
  },
]);
