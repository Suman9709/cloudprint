import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

type StudentAccountMenuProps = {
  onLogout: () => void;
};

const StudentAccountMenu = ({ onLogout }: StudentAccountMenuProps) => (
  <details className="relative">
    <summary className="flex cursor-pointer list-none items-center gap-2 rounded-xl px-2 py-1.5 transition hover:bg-slate-100 [&::-webkit-details-marker]:hidden">
      <span className="hidden text-right sm:block"><span className="block text-sm font-semibold text-slate-800">Aisha Khan</span><span className="block text-xs text-slate-500">Student account</span></span>
      <span className="flex size-9 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">A</span>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4 text-slate-500" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="m7 10 5 5 5-5" /></svg>
    </summary>
    <div className="absolute right-0 z-40 mt-2 w-56 overflow-hidden rounded-2xl border border-slate-200 bg-white p-2 shadow-xl shadow-slate-200/70">
      <div className="border-b border-slate-100 px-3 py-2.5"><p className="text-sm font-semibold text-slate-900">Aisha Khan</p><p className="mt-0.5 truncate text-xs text-slate-500">aisha@university.edu</p></div>
      <Link to="/auth/profile" className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50"><span aria-hidden="true">◉</span> My profile</Link>
      <button type="button" onClick={onLogout} className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-left text-sm font-semibold text-rose-600 transition hover:bg-rose-50"><span aria-hidden="true">↪</span> Log out</button>
    </div>
  </details>
);

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const isStudentWorkspace = location.pathname.startsWith("/student");
  const logout = () => navigate("/");

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-lg">
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between px-6 sm:px-8 lg:px-10" aria-label="Main navigation">
        <Link to="/" className="flex items-center gap-2.5 text-lg font-bold tracking-tight text-slate-950" aria-label="CloudPrint home">
          <span className="flex size-9 items-center justify-center rounded-xl bg-blue-600 text-sm font-black text-white shadow-lg shadow-blue-600/25">C</span>
          Cloud<span className="text-blue-600">Print</span>
        </Link>
        {isStudentWorkspace ? <><div className="hidden items-center gap-6 md:flex"><NavLink to="/student/dashboard" className="text-sm font-semibold text-slate-700 transition hover:text-blue-600">New print order</NavLink><Link to="/student/dashboard#recent-orders" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">My orders</Link><StudentAccountMenu onLogout={logout} /></div><div className="flex items-center gap-3 md:hidden"><Link to="/student/dashboard" className="text-sm font-semibold text-blue-600">New order</Link><StudentAccountMenu onLogout={logout} /></div></> : <><div className="hidden items-center gap-7 md:flex"><a href="/#how-it-works" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">How it works</a><a href="/#services" className="text-sm font-medium text-slate-600 transition hover:text-blue-600">Print services</a><NavLink to="/auth/login" className="text-sm font-semibold text-slate-700 transition hover:text-blue-600">Sign in</NavLink><NavLink to="/auth/register" className="rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700">Create account</NavLink></div><div className="flex items-center gap-3 md:hidden"><Link to="/auth/login" className="text-sm font-semibold text-slate-700">Sign in</Link><Link to="/auth/register" className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white">Join</Link></div></>}
      </nav>
    </header>
  );
};

export default Navbar;
