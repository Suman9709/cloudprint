import { Link } from "react-router-dom";
import VelqoMark from "./VelqoMark";

const Footer = () => (
  <footer className="bg-slate-950 text-slate-300">
    <div className="mx-auto grid max-w-7xl gap-10 px-6 py-14 sm:px-8 md:grid-cols-[1.15fr_.7fr_1fr] lg:px-10">
      <div>
        <Link to="/" className="inline-flex items-center gap-3"><VelqoMark compact /><span className="text-xl font-black tracking-tight text-white">Cloud<span className="text-blue-400">Print</span></span></Link>
        <p className="mt-5 max-w-sm text-sm leading-6 text-slate-400">Guest ordering for local print shops. Customers upload at the shop link and collect with a four-digit code.</p>
        <Link to="/auth/login" className="btn btn-sm mt-6 border-0 bg-white text-slate-950 shadow-none hover:bg-blue-50">Open shop dashboard</Link>
      </div>
      <div>
        <p className="text-xs font-bold tracking-[.16em] text-slate-500 uppercase">CloudPrint</p>
        <div className="mt-4 space-y-3 text-sm font-medium"><a href="/#how-it-works" className="block transition hover:text-white">How it works</a><a href="/#services" className="block transition hover:text-white">For print shops</a><Link to="/auth/login" className="block transition hover:text-white">Shop sign in</Link><Link to="/auth/admin-login" className="block transition hover:text-white">Platform admin</Link></div>
      </div>
      <div>
        <p className="text-xs font-bold tracking-[.16em] text-slate-500 uppercase">A Velqo product</p>
        <div className="mt-4"><VelqoMark /></div>
        <p className="mt-4 max-w-xs text-sm leading-6 text-slate-400">CloudPrint is designed and developed by Velqo.</p>
        <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium text-slate-500"><Link to="/terms-of-use" className="hover:text-white">Terms</Link><Link to="/privacy-policy" className="hover:text-white">Privacy</Link><Link to="/cookie-policy" className="hover:text-white">Cookies</Link><Link to="/refund-policy" className="hover:text-white">Refunds</Link></div>
      </div>
    </div>
    <div className="border-t border-white/10"><div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-10"><span>© {new Date().getFullYear()} CloudPrint</span><span>Built with care by Velqo</span></div></div>
  </footer>
);

export default Footer;
