import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api, apiError, ensureCsrf } from "../../lib/api";

type OrderStatus = "submitted" | "accepted" | "printing" | "ready" | "collected" | "cancelled";
type OrderDocument = { id: number | null; original_filename: string; page_count: number; page_count_status: "exact" | "estimated" | "review_required"; page_count_method: string; document_url: string | null };
type PrintOrder = { id: number; pickup_code: string; original_filename: string; customer_name: string; print_mode: string; sides: string; copies: number; page_count: number; page_count_status: "exact" | "estimated" | "review_required"; finishing: string; price_per_page: string; finishing_cost: string; total_amount: string; payment_status: "pending" | "marked_paid"; status: OrderStatus; status_label: string; created_at: string; documents: OrderDocument[] };
type PaginatedOrders = { count: number; next: string | null; previous: string | null; results: PrintOrder[] };

const nextStates: Partial<Record<OrderStatus, { status: OrderStatus; label: string }>> = {
  submitted: { status: "accepted", label: "Accept order" }, accepted: { status: "printing", label: "Start printing" }, printing: { status: "ready", label: "Mark ready" }, ready: { status: "collected", label: "Mark collected" },
};
const statusStyle: Record<OrderStatus, string> = { submitted: "bg-amber-100 text-amber-800", accepted: "bg-blue-100 text-blue-700", printing: "bg-violet-100 text-violet-700", ready: "bg-emerald-100 text-emerald-700", collected: "bg-slate-100 text-slate-600", cancelled: "bg-rose-100 text-rose-700" };
const money = (value: string) => `₹${Number(value).toFixed(2)}`;
const readable = (value: string) => value.replaceAll("_", " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

const ShopDashboard = ({ paidOnly = false }: { paidOnly?: boolean }) => {
  const [orders, setOrders] = useState<PaginatedOrders | null>(null);
  const [url, setUrl] = useState(paidOnly ? "/api/orders/dashboard/?payment_status=marked_paid" : "/api/orders/dashboard/");
  const [error, setError] = useState("");
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null);
  const [deletingOrderId, setDeletingOrderId] = useState<number | null>(null);

  useEffect(() => {
    let active = true;
    api.get<PaginatedOrders>(url)
      .then(({ data }) => { if (active) setOrders(data); })
      .catch((requestError) => { if (active) setError(apiError(requestError, "Please sign in with your shop account to see orders.")); });
    return () => { active = false; };
  }, [url]);

  const updateStatus = async (order: PrintOrder) => {
    const next = nextStates[order.status];
    if (!next || order.payment_status !== "marked_paid") return;
    setBusyOrderId(order.id);
    try {
      const { data } = await api.patch<PrintOrder>(`/api/orders/${order.id}/status/`, { status: next.status }, { headers: await ensureCsrf() });
      setOrders((current) => current ? { ...current, results: current.results.map((item) => item.id === data.id ? data : item) } : current);
    } catch (requestError) {
      setError(apiError(requestError, "Order status could not be updated."));
    } finally {
      setBusyOrderId(null);
    }
  };

  const deletePendingOrder = async (order: PrintOrder) => {
    if (order.payment_status !== "pending") return;
    if (!window.confirm(`Delete unpaid order ${order.pickup_code}? Its uploaded files will be removed.`)) return;
    setDeletingOrderId(order.id);
    setError("");
    try {
      await api.delete(`/api/orders/${order.id}/`, { headers: await ensureCsrf() });
      setOrders((current) => current ? {
        ...current,
        count: Math.max(0, current.count - 1),
        results: current.results.filter((item) => item.id !== order.id),
      } : current);
    } catch (requestError) {
      setError(apiError(requestError, "The unpaid order could not be deleted."));
    } finally {
      setDeletingOrderId(null);
    }
  };

  const title = paidOnly ? "Paid orders" : "Recent orders";
  const subtitle = paidOnly ? "Only orders marked paid by the customer are listed here." : "The 20 newest orders are shown here. Unpaid orders may be deleted; paid records are protected.";
  return <section className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-7xl"><header className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Shop dashboard</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">{title}</h1><p className="mt-2 text-slate-600">{subtitle}</p></div>{orders && <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-800">{orders.count} total {paidOnly ? "paid " : ""}orders</div>}</header>{error && <div className="mt-6 rounded-2xl bg-rose-50 p-5 text-rose-800"><p className="font-semibold">{error}</p><Link to="/auth/login" className="mt-2 inline-block font-bold underline">Shop sign in</Link></div>}{!orders ? <p className="py-12 text-slate-500">Loading orders…</p> : <><div className="mt-7 grid gap-4">{orders.results.map((order) => { const next = nextStates[order.status]; const paid = order.payment_status === "marked_paid"; return <article key={order.id} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6"><div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between"><div className="min-w-0 flex-1"><div className="flex flex-wrap items-center gap-2"><span className="rounded-lg bg-slate-950 px-3 py-1.5 font-mono text-sm font-bold tracking-widest text-white">{order.pickup_code}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[order.status]}`}>{order.status_label}</span><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${paid ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-800"}`}>{paid ? "Paid (demo)" : "Payment pending"}</span>{order.page_count_status !== "exact" && <span className="rounded-full bg-amber-100 px-2.5 py-1 text-xs font-semibold text-amber-900">Page review needed</span>}</div><h2 className="mt-4 truncate text-lg font-bold">{order.original_filename}</h2><p className="mt-1 text-sm text-slate-500">{order.customer_name || "Guest customer"} · {new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(order.created_at))}</p><div className="mt-3 flex flex-wrap gap-2 text-xs font-medium text-slate-600"><span className="rounded-md bg-slate-100 px-2.5 py-1">{readable(order.print_mode)}</span><span className="rounded-md bg-slate-100 px-2.5 py-1">{order.page_count} pages × {order.copies}</span><span className="rounded-md bg-slate-100 px-2.5 py-1">{money(order.price_per_page)} / page</span>{Number(order.finishing_cost) > 0 && <span className="rounded-md bg-slate-100 px-2.5 py-1">Spiral {money(order.finishing_cost)}</span>}<span className="rounded-md bg-blue-50 px-2.5 py-1 text-blue-800">Total {money(order.total_amount)}</span></div>{order.documents.length > 0 && <div className="mt-4 rounded-xl bg-slate-50 p-3"><p className="text-xs font-bold tracking-wide text-slate-500 uppercase">Files in this order</p><ul className="mt-2 space-y-1.5">{order.documents.map((document, index) => <li key={`${document.id ?? "legacy"}-${index}`} className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm"><span className="font-medium text-slate-800">{document.original_filename}</span><span className="text-slate-500">{document.page_count} page{document.page_count === 1 ? "" : "s"}</span>{document.page_count_status !== "exact" && <span className="text-amber-700">({document.page_count_status === "estimated" ? "estimated" : "review"})</span>}{document.document_url && <a href={document.document_url} className="font-semibold text-blue-700 underline">Download</a>}</li>)}</ul></div>}</div><div className="flex shrink-0 flex-col gap-2 sm:flex-row lg:w-60 lg:flex-col">{paid && next && <button disabled={busyOrderId === order.id} type="button" onClick={() => void updateStatus(order)} className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">{busyOrderId === order.id ? "Updating…" : next.label}</button>}{!paid && <button disabled={deletingOrderId === order.id} type="button" onClick={() => void deletePendingOrder(order)} className="rounded-xl border border-rose-200 px-4 py-3 text-sm font-semibold text-rose-700 hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50">{deletingOrderId === order.id ? "Deleting…" : "Delete unpaid order"}</button>}{!paid && next && <p className="text-center text-xs text-slate-500">Status changes unlock after payment.</p>}</div></div></article>; })}{orders.results.length === 0 && <div className="rounded-3xl border border-dashed border-slate-300 bg-white p-12 text-center"><h2 className="text-xl font-bold">No orders here yet</h2><p className="mt-2 text-slate-600">Public shop orders will appear here.</p></div>}</div><div className="mt-7 flex justify-between"><button disabled={!orders.previous} onClick={() => orders.previous && setUrl(orders.previous.replace("http://127.0.0.1:8001", "").replace("http://localhost:8001", ""))} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Previous</button><span className="text-sm text-slate-500">Showing up to 20 orders</span><button disabled={!orders.next} onClick={() => orders.next && setUrl(orders.next.replace("http://127.0.0.1:8001", "").replace("http://localhost:8001", ""))} className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-40">Next</button></div></>}</div></section>;
};

export default ShopDashboard;
