import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  return (
    <section className="min-h-[calc(100vh-14rem)] bg-slate-50 px-6 py-12 sm:px-8 lg:py-20">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/70 lg:grid-cols-[.9fr_1.1fr]">
        <aside className="relative hidden overflow-hidden bg-slate-950 p-10 text-white lg:block">
          <div className="absolute -right-24 -top-20 size-64 rounded-full bg-blue-500/30 blur-2xl" />
          <div className="absolute -bottom-28 -left-20 size-72 rounded-full bg-violet-500/20 blur-2xl" />
          <div className="relative flex h-full flex-col justify-between">
            <div><div className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">C</div><p className="mt-8 text-sm font-semibold tracking-[.16em] text-blue-200 uppercase">CloudPrint student</p><h1 className="mt-3 text-3xl font-bold leading-tight">Welcome back to simpler campus printing.</h1></div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-5"><p className="text-sm leading-6 text-slate-200">“I can upload my notes before leaving the hostel and collect them between lectures.”</p><p className="mt-4 text-sm font-semibold">— Aisha, Computer Science</p></div>
          </div>
        </aside>
        <div className="p-7 sm:p-10 lg:p-12">
          <div className="mx-auto max-w-md">
            <p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Student sign in</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">Welcome back</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">Sign in to place an order or check your print status.</p>
            <form className="mt-8 space-y-5" onSubmit={(event) => { event.preventDefault(); navigate("/student/dashboard"); }}>
              <label className="block text-sm font-medium text-slate-700" htmlFor="email">University email<input id="email" type="email" placeholder="you@university.edu" autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>
              <div><div className="flex items-center justify-between"><label className="text-sm font-medium text-slate-700" htmlFor="password">Password</label><a href="#forgot-password" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Forgot password?</a></div><input id="password" type="password" placeholder="Enter your password" autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></div>
              <label className="flex items-center gap-2 text-sm text-slate-600"><input type="checkbox" className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500" /> Keep me signed in</label>
              <button type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">Sign in to CloudPrint</button>
            </form>
            <p className="mt-7 text-center text-sm text-slate-600">New to CloudPrint? <Link to="/auth/register" className="font-semibold text-blue-600 hover:text-blue-700">Create a student account</Link></p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
