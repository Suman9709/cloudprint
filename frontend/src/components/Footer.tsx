import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-10 sm:px-8 md:flex-row md:items-end md:justify-between lg:px-10">
        <div><Link to="/" className="text-lg font-bold tracking-tight text-slate-950">Cloud<span className="text-blue-600">Print</span></Link><p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">A simpler way for students to send, track, and collect campus print orders.</p></div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm font-medium text-slate-600"><a href="/#how-it-works" className="hover:text-blue-600">How it works</a><a href="/#services" className="hover:text-blue-600">Services</a><Link to="/auth/login" className="hover:text-blue-600">Sign in</Link><Link to="/auth/register" className="hover:text-blue-600">Create account</Link><Link to="/terms-of-use" className="hover:text-blue-600">Terms of use</Link><Link to="/privacy-policy" className="hover:text-blue-600">Privacy policy</Link><Link to="/cookie-policy" className="hover:text-blue-600">Cookie policy</Link><Link to="/refund-policy" className="hover:text-blue-600">Refund policy</Link></div>
      </div>
      <div className="border-t border-slate-100 px-6 py-4 text-center text-xs text-slate-500">© {new Date().getFullYear()} CloudPrint. Made for better student days.</div>
    </footer>
  );
};

export default Footer;
