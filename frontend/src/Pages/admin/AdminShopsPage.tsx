import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiError, ensureCsrf } from "../../lib/api";
import AdminPageHeader from "./AdminPageHeader";
import { AdminPage, ErrorMessage, PageLoading } from "./AdminOverviewPage";
import type { Shop } from "./types";
import { useAdminAccess } from "./useAdminAccess";

const AdminShopsPage = () => {
  const checking = useAdminAccess();
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (checking) return;
    let active = true;
    api.get<Shop[]>("/api/shops/admin/shops/")
      .then(({ data }) => { if (active) setShops(data); })
      .catch((requestError: unknown) => { if (active) setError(apiError(requestError, "Could not load shops.")); });
    return () => { active = false; };
  }, [checking]);

  const deleteShop = async (shop: Shop) => {
    if (!window.confirm(`Retire ${shop.name}? Its public upload URL will stop working, but paid-order history remains.`)) return;
    setDeletingId(shop.id); setError(""); setNotice("");
    try {
      await api.delete(`/api/shops/admin/shops/${shop.id}/`, { headers: await ensureCsrf() });
      setShops((current) => current?.filter((item) => item.id !== shop.id) ?? null);
      setNotice(`${shop.name} was retired. Its financial history is still visible in Earnings.`);
    } catch (requestError) { setError(apiError(requestError, "The shop could not be retired.")); }
    finally { setDeletingId(null); }
  };

  if (checking) return <PageLoading />;
  return <AdminPage><AdminPageHeader eyebrow="Platform administration" title="Manage shops" description="View public links, copy URLs, and retire a shop when it should stop accepting new orders." action={<Link to="/admin/shops/new" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Create shop</Link>} />
    {error && <ErrorMessage message={error} />}{notice && <p className="mt-6 rounded-xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{notice}</p>}
    {!shops && !error ? <PageLoading /> : <div className="mt-7 grid gap-4">{shops?.map((shop) => <article key={shop.id} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><div className="flex flex-wrap items-center gap-2"><h2 className="font-bold text-slate-950">{shop.name}</h2><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${shop.is_accepting_orders ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{shop.is_accepting_orders ? "Accepting orders" : "Paused"}</span></div><p className="mt-1 text-sm text-slate-500">{shop.address || "No address added"} · Owner: {shop.owner_name}</p><a href={shop.public_url} target="_blank" rel="noreferrer" className="mt-3 block break-all text-sm font-semibold text-blue-600 hover:text-blue-700">{shop.public_url}</a></div><div className="flex shrink-0 flex-wrap gap-2"><button type="button" onClick={() => { void navigator.clipboard?.writeText(shop.public_url); setNotice("Shop URL copied to clipboard."); }} className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50">Copy URL</button><button type="button" disabled={deletingId === shop.id} onClick={() => void deleteShop(shop)} className="rounded-lg border border-rose-200 px-3 py-2 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:opacity-50">{deletingId === shop.id ? "Retiring…" : "Retire shop"}</button></div></div></article>)}{shops?.length === 0 && <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center"><h2 className="text-xl font-bold text-slate-900">No active shops yet</h2><p className="mt-2 text-slate-600">Create your first shop to generate a public upload URL.</p><Link to="/admin/shops/new" className="mt-5 inline-block font-semibold text-blue-600">Create shop</Link></div>}</div>}
  </AdminPage>;
};

export default AdminShopsPage;
