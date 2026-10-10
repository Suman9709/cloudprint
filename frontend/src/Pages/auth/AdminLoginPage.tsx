import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api, apiError, ensureCsrf } from "../../lib/api";

type LoginResponse = { user: { is_platform_admin: boolean } };

const AdminLoginPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const login = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const { data } = await api.post<LoginResponse>("/api/accounts/login/", { email, password });
      if (!data.user.is_platform_admin) {
        await api.post("/api/accounts/logout/", {}, { headers: await ensureCsrf() });
        setError("This account is a shop account. Use the shop owner sign-in instead.");
        return;
      }
      navigate("/admin/shops");
    } catch (requestError) {
      setError(apiError(requestError, "We could not sign you in as a platform administrator."));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-13rem)] bg-slate-50 px-6 py-12 sm:px-8 sm:py-16"><div className="mx-auto max-w-md rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/60 sm:p-10"><div className="flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-xl font-bold text-white">C</div><p className="mt-8 text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Platform administration</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Admin sign in</h1><p className="mt-2 text-sm leading-6 text-slate-600">Create shop pages, generate their public URLs, and set up owner accounts.</p><form className="mt-8 space-y-5" onSubmit={login}><label className="block text-sm font-medium text-slate-700">Admin email<input required type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label><label className="block text-sm font-medium text-slate-700">Password<input required type="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="current-password" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /></label>{error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}<button disabled={submitting} className="w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 hover:bg-blue-700 disabled:bg-slate-300">{submitting ? "Signing in…" : "Open admin dashboard"}</button></form><p className="mt-6 text-center text-sm text-slate-500">Shop owner? <Link to="/auth/login" className="font-semibold text-blue-600">Use shop sign in</Link></p></div></section>
  );
};

export default AdminLoginPage;
