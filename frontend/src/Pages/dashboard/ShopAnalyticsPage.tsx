import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiError } from "../../lib/api";

type Day = { date: string; orders: number; paid_orders: number; revenue: string };
type Analytics = { today: { orders: number; paid_orders: number; ready_orders: number; revenue: string }; last_seven_days: Day[] };
const money = (value: string) => `₹${Number(value).toFixed(2)}`;

const ShopAnalyticsPage = () => {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [error, setError] = useState("");
  useEffect(() => {
    api.get<Analytics>("/api/orders/dashboard/analytics/")
      .then(({ data }) => setAnalytics(data))
      .catch((requestError) => setError(apiError(requestError, "Please sign in with your shop account to view analytics.")));
  }, []);
  const maxRevenue = Math.max(1, ...(analytics?.last_seven_days.map((day) => Number(day.revenue)) ?? []));
  return <section className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-5xl"><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Shop dashboard</p><h1 className="mt-2 text-3xl font-bold">Daily analytics</h1><p className="mt-2 text-slate-600">Today’s payment-marked revenue and the last seven days of order activity.</p>{error && <div className="mt-6 rounded-2xl bg-rose-50 p-5 text-rose-800"><p className="font-semibold">{error}</p><Link to="/auth/login" className="mt-2 inline-block font-bold underline">Shop sign in</Link></div>}{!analytics ? <p className="py-12 text-slate-500">Loading analytics…</p> : <><div className="mt-7 grid gap-4 sm:grid-cols-3"><div className="rounded-3xl bg-slate-950 p-6 text-white"><p className="text-sm text-slate-300">Today’s revenue</p><p className="mt-2 text-3xl font-bold">{money(analytics.today.revenue)}</p><p className="mt-2 text-xs text-slate-300">Only demo-payment confirmed orders</p></div><div className="rounded-3xl border border-slate-200 bg-white p-6"><p className="text-sm text-slate-500">Orders today</p><p className="mt-2 text-3xl font-bold">{analytics.today.orders}</p><p className="mt-2 text-xs text-slate-500">{analytics.today.paid_orders} marked paid</p></div><div className="rounded-3xl border border-emerald-100 bg-emerald-50 p-6"><p className="text-sm text-emerald-800">Ready today</p><p className="mt-2 text-3xl font-bold text-emerald-950">{analytics.today.ready_orders}</p><p className="mt-2 text-xs text-emerald-800">Orders ready for collection</p></div></div><section className="mt-7 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-xl font-bold">Last seven days</h2><div className="mt-6 space-y-4">{analytics.last_seven_days.map((day) => <div key={day.date} className="grid grid-cols-[5.5rem_minmax(0,1fr)_5rem] items-center gap-3 text-sm"><span className="text-slate-600">{new Intl.DateTimeFormat("en-IN", { weekday: "short", day: "numeric", month: "short" }).format(new Date(`${day.date}T00:00:00`))}</span><div className="h-3 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-blue-600" style={{ width: `${(Number(day.revenue) / maxRevenue) * 100}%` }} /></div><span className="text-right font-semibold text-slate-800">{money(day.revenue)}</span><span className="col-start-2 text-xs text-slate-500">{day.orders} orders · {day.paid_orders} paid</span></div>)}</div></section></>}</div></section>;
};

export default ShopAnalyticsPage;
