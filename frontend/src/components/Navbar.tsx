import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { api, ensureCsrf } from "../lib/api";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");
  const isAdminSection = location.pathname.startsWith("/admin");
  const logout = async () => {
    try {
      await api.post("/api/accounts/logout/", {}, { headers: await ensureCsrf() });
    } finally {
      navigate("/");
    }
  };

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-950" aria-label="CloudPrint home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/25">C</span>
          Cloud<span className="text-blue-600">Print</span>
        </Link>
        {isDashboard ? (
          <div className="flex items-center gap-3">
            {isAdminSection ? <NavLink to="/admin/shops" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Shops</NavLink> : <><NavLink to="/dashboard" end className="text-sm font-semibold text-slate-700 hover:text-blue-600">Orders</NavLink><NavLink to="/dashboard/paid" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Paid</NavLink><NavLink to="/dashboard/analytics" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Analytics</NavLink><NavLink to="/dashboard/settings" className="text-sm font-semibold text-slate-700 hover:text-blue-600">Settings</NavLink></>}
            <button type="button" onClick={logout} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Sign out</button>
          </div>
        ) : (
          <div className="flex items-center gap-5">
            <a href="/#how-it-works" className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-600 md:block">How it works</a>
            <NavLink to="/auth/admin-login" className="hidden text-sm font-semibold text-slate-700 hover:text-blue-600 md:block">Admin</NavLink>
            <NavLink to="/auth/login" className="rounded-lg bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-slate-800">Shop sign in</NavLink>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
