import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, apiError, ensureCsrf } from "../../lib/api";
import AdminPageHeader, { AdminBackToShops } from "./AdminPageHeader";
import { AdminPage, ErrorMessage, PageLoading } from "./AdminOverviewPage";
import type { Shop } from "./types";
import { useAdminAccess } from "./useAdminAccess";

const initialForm = { name: "", slug: "", address: "", owner_name: "", owner_email: "", owner_password: "" };

const CreateShopPage = () => {
  const checking = useAdminAccess();
  const navigate = useNavigate();
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const update = (field: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const makeSlug = () => { if (!form.slug) update("slug", form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")); };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setSubmitting(true); setError("");
    try {
      await api.post<Shop>("/api/shops/admin/shops/", form, { headers: await ensureCsrf() });
      navigate("/admin/shops", { replace: true });
    } catch (requestError) { setError(apiError(requestError, "The shop could not be created.")); }
    finally { setSubmitting(false); }
  };

  if (checking) return <PageLoading />;
  return <AdminPage><AdminPageHeader eyebrow="Platform administration" title="Create a print shop" description="This creates a dedicated public upload page and a shop-owner sign-in account." action={<AdminBackToShops />} />
    <form onSubmit={submit} className="mt-8 max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"><h2 className="text-xl font-bold text-slate-950">Shop details</h2><div className="mt-6 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Shop name<input required value={form.name} onChange={(event) => update("name", event.target.value)} onBlur={makeSlug} placeholder="Campus Copy Centre" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Shop URL slug<input required value={form.slug} onChange={(event) => update("slug", event.target.value.toLowerCase())} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="campus-copy-centre" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /><span className="mt-1 block text-xs font-normal text-slate-500">/shop/{form.slug || "your-shop"}</span></label><label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Address <span className="font-normal text-slate-400">(optional)</span><input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Library ground floor" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label></div><div className="mt-8 border-t border-slate-100 pt-6"><h2 className="text-xl font-bold text-slate-950">Owner account</h2><p className="mt-1 text-sm text-slate-600">Give these credentials to the shop owner so they can manage orders and pricing.</p><div className="mt-5 grid gap-5 sm:grid-cols-2"><label className="block text-sm font-semibold text-slate-700">Owner name<input required value={form.owner_name} onChange={(event) => update("owner_name", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="block text-sm font-semibold text-slate-700">Owner email<input required type="email" value={form.owner_email} onChange={(event) => update("owner_email", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="block text-sm font-semibold text-slate-700 sm:col-span-2">Temporary password<input required minLength={8} type="password" value={form.owner_password} onChange={(event) => update("owner_password", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label></div></div>{error && <ErrorMessage message={error} />}<div className="mt-7 flex gap-3"><button disabled={submitting} className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">{submitting ? "Creating…" : "Create shop and URL"}</button><AdminBackToShops /></div></form>
  </AdminPage>;
};

export default CreateShopPage;
