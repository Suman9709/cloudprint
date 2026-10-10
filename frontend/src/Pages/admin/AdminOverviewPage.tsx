import { useEffect, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { api, apiError } from "../../lib/api";
import AdminPageHeader from "./AdminPageHeader";
import { money, type EarningsReport } from "./types";
import { useAdminAccess } from "./useAdminAccess";

const AdminOverviewPage = () => {
  const checking = useAdminAccess();
  const [report, setReport] = useState<EarningsReport | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (checking) return;
    let active = true;
    api.get<EarningsReport>("/api/shops/admin/analytics/")
      .then(({ data }) => { if (active) setReport(data); })
      .catch((requestError: unknown) => { if (active) setError(apiError(requestError, "Could not load platform earnings.")); });
    return () => { active = false; };
  }, [checking]);

  if (checking) return <PageLoading />;
  return <AdminPage><AdminPageHeader eyebrow="Platform administration" title="Earnings overview" description="Revenue is split per paid order: the shop receives the print amount and CloudPrint retains the convenience fee." action={<Link to="/admin/shops/new" className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700">Create shop</Link>} />
    {error && <ErrorMessage message={error} />}
    {!report && !error ? <PageLoading /> : report && <><section className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"><Metric label="Customer payments" value={money(report.summary.customer_payments)} tone="slate" /><Metric label="Shop earnings" value={money(report.summary.shop_earnings)} tone="emerald" /><Metric label="CloudPrint fees" value={money(report.summary.platform_earnings)} tone="blue" /><Metric label="Paid orders" value={String(report.summary.paid_orders)} tone="violet" /></section><section className="mt-7 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm"><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-bold text-slate-950">Earnings by shop</h2><p className="mt-1 text-sm text-slate-500">Retired shops remain for accurate financial history.</p></div><div className="overflow-x-auto"><table className="min-w-full text-left text-sm"><thead className="bg-slate-50 text-xs font-bold tracking-wide text-slate-500 uppercase"><tr><th className="px-5 py-3">Shop</th><th className="px-5 py-3 text-right">Paid / total</th><th className="px-5 py-3 text-right">Customer paid</th><th className="px-5 py-3 text-right">Shop earns</th><th className="px-5 py-3 text-right">CloudPrint earns</th></tr></thead><tbody className="divide-y divide-slate-100">{report.shops.map((shop) => <tr key={shop.shop_id}><td className="px-5 py-4"><p className="font-semibold text-slate-950">{shop.shop_name} {!shop.is_active && <span className="ml-2 rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-500">Retired</span>}</p><p className="mt-1 text-xs text-slate-500">{shop.owner_name} · /shop/{shop.shop_slug}</p></td><td className="px-5 py-4 text-right"><strong>{shop.paid_orders}</strong><span className="text-slate-400"> / {shop.total_orders}</span></td><td className="px-5 py-4 text-right">{money(shop.customer_payments)}</td><td className="px-5 py-4 text-right font-semibold text-emerald-700">{money(shop.shop_earnings)}</td><td className="px-5 py-4 text-right font-semibold text-blue-700">{money(shop.platform_earnings)}</td></tr>)}{report.shops.length === 0 && <tr><td colSpan={5} className="px-5 py-10 text-center text-slate-500">No shop data yet.</td></tr>}</tbody></table></div></section></>}
  </AdminPage>;
};

export const AdminPage = ({ children }: { children: ReactNode }) => <section className="min-h-screen bg-slate-50/80 px-6 py-10 sm:px-8 lg:px-10"><div className="mx-auto max-w-7xl">{children}</div></section>;
export const PageLoading = () => <p className="py-12 text-center text-slate-500">Loading…</p>;
export const ErrorMessage = ({ message }: { message: string }) => <p role="alert" className="mt-6 rounded-xl bg-rose-50 px-4 py-3 text-sm font-medium text-rose-700">{message}</p>;

const Metric = ({ label, value, tone }: { label: string; value: string; tone: "slate" | "emerald" | "blue" | "violet" }) => {
  const colours = { slate: "bg-slate-900 text-white", emerald: "bg-emerald-50 text-emerald-950", blue: "bg-blue-50 text-blue-950", violet: "bg-violet-50 text-violet-950" };
  return <article className={`rounded-2xl p-5 ${colours[tone]}`}><p className="text-xs font-bold tracking-[.12em] uppercase opacity-65">{label}</p><p className="mt-2 text-2xl font-bold tracking-tight">{value}</p></article>;
};

export default AdminOverviewPage;
