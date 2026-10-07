import { Link, useNavigate } from "react-router-dom";

const SignupPage = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-[calc(100vh-14rem)] bg-slate-50 px-6 py-12 sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[1.08fr_.92fr]">
        <div className="order-2 p-7 sm:p-10 lg:order-1 lg:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Create your account</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Ready when your deadline is.</h1>
            <p className="mt-2 text-sm leading-6 text-slate-600">Create your free student account and place your first print order in minutes.</p>
            <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); navigate("/student/dashboard"); }}>
              <div className="grid gap-5 sm:grid-cols-2"><label className="block text-sm font-medium text-slate-700" htmlFor="first-name">First name<input id="first-name" type="text" placeholder="Alex" autoComplete="given-name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label><label className="block text-sm font-medium text-slate-700" htmlFor="last-name">Last name<input id="last-name" type="text" placeholder="Morgan" autoComplete="family-name" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label></div>
              <label className="block text-sm font-medium text-slate-700" htmlFor="signup-email">University email<input id="signup-email" type="email" placeholder="you@university.edu" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <label className="block text-sm font-medium text-slate-700" htmlFor="signup-password">Create password<input id="signup-password" type="password" placeholder="At least 8 characters" autoComplete="new-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <label className="flex items-start gap-2 text-sm leading-5 text-slate-600"><input type="checkbox" className="mt-0.5 size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> <span>I agree to CloudPrint’s terms and understand that I will confirm pricing before placing an order.</span></label>
              <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">Create student account</button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-600">Already have an account? <Link to="/auth/login" className="font-semibold text-blue-600 hover:text-blue-700">Sign in</Link></p>
          </div>
        </div>
        <aside className="relative order-1 overflow-hidden bg-blue-600 p-8 text-white lg:order-2 lg:p-10">
          <div className="absolute -right-12 top-6 size-52 rounded-full border-[28px] border-white/10" />
          <div className="absolute -bottom-16 -left-16 size-56 rounded-full bg-violet-500/30 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between gap-12"><div><div className="flex size-12 items-center justify-center rounded-2xl bg-white text-xl font-bold text-blue-600">C</div><p className="mt-8 text-sm font-semibold tracking-[.16em] text-blue-100 uppercase">Your print companion</p><h2 className="mt-3 text-3xl font-bold leading-tight">Spend less time waiting in line.</h2></div><ul className="space-y-4 text-sm text-blue-50"><li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold">✓</span> Upload documents whenever it suits you</li><li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold">✓</span> Compare options before you order</li><li className="flex gap-3"><span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-white/15 font-bold">✓</span> Collect only when your order is ready</li></ul></div>
        </aside>
      </div>
    </section>
  );
};

export default SignupPage;
