import { useEffect, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, apiError, ensureCsrf } from "../../lib/api";

type Shop = {
  id: number;
  name: string;
  slug: string;
  address: string;
  is_accepting_orders: boolean;
  owner_name: string;
  owner_email: string;
  public_url: string;
};

const initialForm = { name: "", slug: "", address: "", owner_name: "", owner_email: "", owner_password: "" };

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [shops, setShops] = useState<Shop[]>([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [deletingShopId, setDeletingShopId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    let active = true;
    const loadAdminDashboard = async () => {
      try {
        const { data: session } = await api.get<{ user: { is_platform_admin: boolean } }>("/api/accounts/me/");
        if (!session.user.is_platform_admin) {
          navigate("/auth/admin-login", { replace: true });
          return;
        }
        const { data } = await api.get<Shop[]>("/api/shops/admin/shops/");
        if (active) setShops(data);
      } catch {
        navigate("/auth/admin-login", { replace: true });
      } finally {
        if (active) setLoading(false);
      }
    };
    void loadAdminDashboard();
    return () => { active = false; };
  }, [navigate]);

  const update = (field: keyof typeof initialForm, value: string) => setForm((current) => ({ ...current, [field]: value }));
  const makeSlug = () => {
    if (!form.slug) update("slug", form.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""));
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitting(true);
    setError("");
    setNotice("");
    try {
      const { data } = await api.post<Shop>("/api/shops/admin/shops/", form, { headers: await ensureCsrf() });
      setShops((current) => [...current, data].sort((a, b) => a.name.localeCompare(b.name)));
      setForm(initialForm);
      setNotice(`${data.name} is ready at ${data.public_url}`);
    } catch (requestError) {
      setError(apiError(requestError, "The shop could not be created."));
    } finally {
      setSubmitting(false);
    }
  };

  const deleteShop = async (shop: Shop) => {
    if (!window.confirm(`Delete ${shop.name}? Its public upload URL will stop working. Paid-order history is kept.`)) return;
    setDeletingShopId(shop.id);
    setError("");
    setNotice("");
    try {
      await api.delete(`/api/shops/admin/shops/${shop.id}/`, { headers: await ensureCsrf() });
      setShops((current) => current.filter((item) => item.id !== shop.id));
      setNotice(`${shop.name} was deleted and its public upload page is no longer available.`);
    } catch (requestError) {
      setError(apiError(requestError, "The shop could not be deleted."));
    } finally {
      setDeletingShopId(null);
    }
  };

  return <section className="min-h-screen bg-slate-50/80 px-6 py-10 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-3 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Platform administration</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Create and manage shop pages</h1><p className="mt-2 max-w-2xl text-slate-600">Each shop gets a public upload URL and its own owner account.</p></div><span className="rounded-full bg-blue-100 px-3 py-1.5 text-sm font-semibold text-blue-700">{shops.length} {shops.length === 1 ? "shop" : "shops"}</span></header>
    <div className="mt-8 grid gap-7 lg:grid-cols-[24rem_minmax(0,1fr)]"><form onSubmit={submit} className="h-fit rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold text-slate-950">New print shop</h2><p className="mt-1 text-sm leading-6 text-slate-600">This also creates the shop owner sign-in account.</p><div className="mt-6 space-y-4"><label className="block text-sm font-semibold text-slate-700">Shop name<input required value={form.name} onChange={(event) => update("name", event.target.value)} onBlur={makeSlug} placeholder="Campus Copy Centre" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="block text-sm font-semibold text-slate-700">Shop URL slug<input required value={form.slug} onChange={(event) => update("slug", event.target.value.toLowerCase())} pattern="[a-z0-9]+(?:-[a-z0-9]+)*" placeholder="campus-copy-centre" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /><span className="mt-1 block text-xs font-normal text-slate-500">cloudprint / shop / {form.slug || "your-shop"}</span></label><label className="block text-sm font-semibold text-slate-700">Address <span className="font-normal text-slate-400">(optional)</span><input value={form.address} onChange={(event) => update("address", event.target.value)} placeholder="Library ground floor" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><div className="border-t border-slate-100 pt-4"><p className="text-sm font-bold text-slate-900">Shop owner account</p><label className="mt-3 block text-sm font-semibold text-slate-700">Owner name<input required value={form.owner_name} onChange={(event) => update("owner_name", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="mt-3 block text-sm font-semibold text-slate-700">Owner email<input required type="email" value={form.owner_email} onChange={(event) => update("owner_email", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="mt-3 block text-sm font-semibold text-slate-700">Temporary password<input required minLength={8} type="password" value={form.owner_password} onChange={(event) => update("owner_password", event.target.value)} className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label></div></div><button disabled={submitting} type="submit" className="mt-6 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">{submitting ? "Creating shop…" : "Create shop and URL"}</button></form>
      <div><h2 className="text-xl font-bold text-slate-950">Shop links</h2><p className="mt-1 text-sm text-slate-600">Delete retires the public page while retaining paid-order records for audit.</p>{error && <p role="alert" className="mt-5 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{error}</p>}{notice && <p className="mt-5 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</p>}{loading ? <p className="mt-6 text-slate-500">Loading shops…</p> : <div className="mt-5 grid gap-4">{shops.map((shop) => <article key={shop.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h3 className="font-bold text-slate-950">{shop.name}</h3><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${shop.is_accepting_orders ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{shop.is_accepting_orders ? "Accepting orders" : "Paused"}</span></div><p className="mt-1 text-sm text-slate-500">{shop.address || "No address added"} · Owner: {shop.owner_name}</p><a href={shop.public_url} target="_blank" rel="noreferrer" className="mt-3 block break-all text-sm font-semibold text-blue-600 hover:text-blue-700">{shop.public_url}</a></div><div className="flex shrink-0 gap-2"><button type="button" onClick={() => { void navigator.clipboard?.writeText(shop.public_url); setNotice("Shop URL copied to clipboard."); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Copy URL</button><button type="button" disabled={deletingShopId === shop.id} onClick={() => void deleteShop(shop)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">{deletingShopId === shop.id ? "Deleting…" : "Delete shop"}</button></div></div></article>)}{shops.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">Create the first shop to generate its public upload URL.</div>}</div>}</div></div></div></section>;
};

export default AdminDashboard;
