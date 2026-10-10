import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, apiError } from "../../lib/api";

type LoginResponse = {
  user: { role: string; is_platform_admin: boolean };
};

const LoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      const { data } = await api.post<LoginResponse>("/api/accounts/login/", { email, password });
      navigate(data.user.is_platform_admin ? "/admin/shops" : "/dashboard");
    } catch (requestError) {
      setError(apiError(requestError, "We could not sign you in. Check your email and password."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-13rem)] bg-slate-50 px-6 py-12 sm:px-8 sm:py-16">
      <div className="mx-auto grid max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/60 lg:grid-cols-[.85fr_1.15fr]">
        <aside className="bg-slate-950 p-8 text-white sm:p-10"><span className="flex size-12 items-center justify-center rounded-2xl bg-white/10 text-xl font-bold">C</span><p className="mt-10 text-sm font-bold tracking-[.16em] text-blue-200 uppercase">CloudPrint staff</p><h1 className="mt-3 text-3xl font-bold leading-tight">Manage every guest print order in one place.</h1><p className="mt-5 text-sm leading-6 text-slate-300">Student customers do not need an account. Shop owners receive files and pickup codes in their dashboard.</p></aside>
        <div className="p-8 sm:p-10"><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Staff access</p><h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Sign in to your dashboard</h2><p className="mt-2 text-sm leading-6 text-slate-600">For shop owners and platform administrators only.</p>
          <form className="mt-8 space-y-5" onSubmit={login}><label className="block text-sm font-medium text-slate-700">Email<input value={email} onChange={(event) => setEmail(event.target.value)} required type="email" autoComplete="email" placeholder="you@shop.com" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label><label className="block text-sm font-medium text-slate-700">Password<input value={password} onChange={(event) => setPassword(event.target.value)} required type="password" autoComplete="current-password" placeholder="Enter your password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>{error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}<button disabled={submitting} type="submit" className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:bg-slate-300">{submitting ? "Signing in…" : "Sign in"}</button></form>
          <p className="mt-6 text-center text-sm leading-6 text-slate-500">Need a shop page? Ask your CloudPrint platform administrator to create the shop and owner account.</p>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
