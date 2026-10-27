import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { api, ensureCsrf } from "../lib/api";
import VelqoMark from "./VelqoMark";

const navLink = ({ isActive }: { isActive: boolean }) => `rounded-lg px-3 py-2 text-sm font-semibold transition ${isActive ? "bg-slate-100 text-slate-950" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950"}`;

const MenuIcon = () => <svg viewBox="0 0 24 24" aria-hidden="true" className="size-5 fill-none stroke-current stroke-2"><path d="M4 7h16M4 12h16M4 17h16" /></svg>;

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isDashboard = location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/admin");
  const isAdminSection = location.pathname.startsWith("/admin");
  const dashboardLinks = isAdminSection
    ? [["/admin/overview", "Overview"], ["/admin/shops", "Shops"], ["/admin/shops/new", "Create shop"]]
    : [["/dashboard", "Orders"], ["/dashboard/paid", "Paid"], ["/dashboard/collected", "Collected"], ["/dashboard/analytics", "Analytics"], ["/dashboard/settings", "Settings"]];

  const logout = async () => {
    try {
      await api.post("/api/accounts/logout/", {}, { headers: await ensureCsrf() });
    } finally {
      navigate("/");
    }
  };

  const mobileMenu = (links: string[][], dashboard = false) => (
    <details className="dropdown dropdown-end lg:hidden">
      <summary className="btn btn-ghost btn-square btn-sm text-slate-700" aria-label="Open navigation"><MenuIcon /></summary>
      <ul className="menu dropdown-content z-50 mt-3 w-56 rounded-box border border-slate-200 bg-white p-2 shadow-xl shadow-slate-900/10">
        {links.map(([to, label]) => <li key={to}><NavLink to={to} end={to === "/dashboard"} className={navLink}>{label}</NavLink></li>)}
        {dashboard ? <><li className="my-1 border-t border-slate-100" /><li><button type="button" onClick={logout} className="text-rose-700 hover:bg-rose-50">Sign out</button></li></> : <><li className="my-1 border-t border-slate-100" /><li><NavLink to="/auth/admin-login" className={navLink}>Admin</NavLink></li><li><NavLink to="/auth/login" className={navLink}>Shop sign in</NavLink></li></>}
      </ul>
    </details>
  );

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
      <nav className="navbar mx-auto min-h-20 max-w-7xl px-5 sm:px-8 lg:px-10" aria-label="Main navigation">
        <div className="navbar-start">
          <Link to="/" className="group flex items-center gap-3" aria-label="CloudPrint home">
            <VelqoMark compact className="transition duration-200 group-hover:-rotate-3 group-hover:scale-105" />
            <span className="leading-none"><span className="block text-lg font-black tracking-tight text-slate-950">Cloud<span className="text-blue-600">Print</span></span><span className="mt-1 hidden text-[10px] font-bold tracking-[.12em] text-slate-400 uppercase sm:block">by Velqo</span></span>
          </Link>
        </div>

        {isDashboard ? (
          <>
            <div className="navbar-center hidden lg:flex"><div className="flex items-center rounded-box border border-slate-200 bg-white p-1 shadow-sm">{dashboardLinks.map(([to, label]) => <NavLink key={to} to={to} end={to === "/dashboard"} className={navLink}>{label}</NavLink>)}</div></div>
            <div className="navbar-end gap-2"><span className="hidden rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-700 xl:inline-flex">{isAdminSection ? "Platform admin" : "Shop dashboard"}</span><button type="button" onClick={logout} className="btn btn-sm hidden border-slate-200 bg-white text-slate-700 shadow-none hover:border-slate-300 hover:bg-slate-50 lg:inline-flex">Sign out</button>{mobileMenu(dashboardLinks, true)}</div>
          </>
        ) : (
          <>
            <div className="navbar-center hidden lg:flex"><div className="flex items-center gap-1"><a href="/#how-it-works" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">How it works</a><a href="/#services" className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50 hover:text-slate-950">For print shops</a></div></div>
            <div className="navbar-end gap-2"><NavLink to="/auth/admin-login" className="btn btn-ghost btn-sm hidden text-slate-700 lg:inline-flex">Admin</NavLink><NavLink to="/auth/login" className="btn btn-sm border-0 bg-slate-950 px-4 text-white shadow-lg shadow-slate-900/15 hover:bg-slate-800">Shop sign in</NavLink>{mobileMenu([["/#how-it-works", "How it works"], ["/#services", "For print shops"]])}</div>
          </>
        )}
      </nav>
    </header>
  );
};

export default Navbar;
