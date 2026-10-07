import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

type OrderDetails = {
  documentName: string;
  pageCount: number;
  printMode: string;
  sides: string;
  copies: number;
  binding: string;
  printCost: number;
  bindingCost: number;
  convenienceFee: number;
  total: number;
};

const defaultOrder: OrderDetails = {
  documentName: "Your document",
  pageCount: 0,
  printMode: "Black & white",
  sides: "Double-sided",
  copies: 1,
  binding: "None",
  printCost: 0,
  bindingCost: 0,
  convenienceFee: 0,
  total: 0,
};

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

const PaymentPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const order = (location.state as OrderDetails | null) ?? defaultOrder;
  const [method, setMethod] = useState<"UPI" | "Card" | "Wallet">("UPI");
  const [isPaid, setIsPaid] = useState(false);

  if (isPaid) {
    return (
      <section className="min-h-[calc(100vh-14rem)] bg-slate-50 px-6 py-16 sm:px-8">
        <div className="mx-auto max-w-lg rounded-3xl border border-emerald-100 bg-white p-8 text-center shadow-xl shadow-slate-200/60 sm:p-12">
          <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">✓</span>
          <p className="mt-6 text-sm font-bold tracking-[.16em] text-emerald-600 uppercase">Order confirmed</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-950">You are all set.</h1>
          <p className="mt-3 leading-7 text-slate-600">Your order has been sent to Central Library Print Desk. We will notify you as soon as it is ready to collect.</p>
          <div className="mt-7 rounded-2xl bg-slate-50 p-4 text-left"><div className="flex justify-between text-sm"><span className="text-slate-500">Order ID</span><span className="font-semibold text-slate-900">CP-48291</span></div><div className="mt-3 flex justify-between text-sm"><span className="text-slate-500">Amount paid</span><span className="font-semibold text-slate-900">{formatCurrency(order.total)}</span></div></div>
          <button type="button" onClick={() => navigate("/student/dashboard")} className="mt-7 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700">Back to my workspace</button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-slate-50/80 px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-6xl">
        <Link to="/student/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-blue-600"><span aria-hidden="true">←</span> Back to print options</Link>
        <div className="mt-6 grid gap-7 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Secure checkout</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950">Choose a payment method</h1>
            <p className="mt-2 text-slate-600">You will only be charged once your print order is confirmed.</p>
            <div className="mt-8 space-y-3">
              {(["UPI", "Card", "Wallet"] as const).map((option) => (
                <button key={option} type="button" onClick={() => setMethod(option)} className={`flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition ${method === option ? "border-blue-600 bg-blue-50 ring-2 ring-blue-100" : "border-slate-200 hover:border-slate-300"}`}>
                  <span className={`flex size-10 items-center justify-center rounded-xl text-sm font-bold ${method === option ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-600"}`}>{option === "UPI" ? "₹" : option === "Card" ? "▣" : "W"}</span>
                  <span className="flex-1"><span className="block text-sm font-semibold text-slate-900">{option === "UPI" ? "UPI" : option === "Card" ? "Debit or credit card" : "Wallet"}</span><span className="mt-0.5 block text-xs text-slate-500">{option === "UPI" ? "Pay securely with any UPI app" : option === "Card" ? "Visa, Mastercard, RuPay and more" : "Use your available wallet balance"}</span></span>
                  <span className={`flex size-5 items-center justify-center rounded-full border ${method === option ? "border-blue-600" : "border-slate-300"}`}>{method === option && <span className="size-2.5 rounded-full bg-blue-600" />}</span>
                </button>
              ))}
            </div>
            <div className="mt-7 rounded-2xl border border-slate-100 bg-slate-50 p-5">
              {method === "UPI" ? <><label className="text-sm font-semibold text-slate-800" htmlFor="upi-id">UPI ID</label><input id="upi-id" type="text" placeholder="name@bank" className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100" /><p className="mt-3 text-xs leading-5 text-slate-500">We will open your UPI app after you confirm this order.</p></> : <p className="text-sm leading-6 text-slate-600">{method === "Card" ? "Card details will be entered in our secure payment window after you continue." : "You will be asked to choose a wallet and confirm payment next."}</p>}
            </div>
            <button type="button" onClick={() => setIsPaid(true)} disabled={!order.total} className="mt-7 w-full rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none">Pay {formatCurrency(order.total)} with {method}</button>
            {!order.total && <p className="mt-3 text-center text-xs text-amber-700">Return to the workspace and upload a document before payment.</p>}
            <p className="mt-5 text-center text-xs leading-5 text-slate-500">By continuing, you agree to our <Link className="font-semibold text-blue-600" to="/terms-of-use">Terms of Use</Link>, <Link className="font-semibold text-blue-600" to="/privacy-policy">Privacy Policy</Link>, and <Link className="font-semibold text-blue-600" to="/refund-policy">Refund Policy</Link>.</p>
            <p className="mt-3 text-center text-xs text-slate-500">🔒 Payments are encrypted and securely processed.</p>
          </div>

          <aside className="lg:sticky lg:top-24"><div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-950">Review your order</h2><div className="mt-5 rounded-2xl bg-slate-50 p-4"><p className="truncate text-sm font-semibold text-slate-900">{order.documentName}</p><p className="mt-1 text-xs leading-5 text-slate-500">{order.pageCount ? `${order.pageCount} pages · ${order.copies} ${order.copies === 1 ? "copy" : "copies"}` : "No document selected"}</p><div className="mt-3 flex flex-wrap gap-2"><span className="rounded-md bg-white px-2 py-1 text-xs text-slate-600">{order.printMode}</span><span className="rounded-md bg-white px-2 py-1 text-xs text-slate-600">{order.sides}</span>{order.binding !== "None" && <span className="rounded-md bg-white px-2 py-1 text-xs text-slate-600">{order.binding}</span>}</div></div><div className="space-y-3 py-5 text-sm"><div className="flex justify-between text-slate-600"><span>Print</span><span>{formatCurrency(order.printCost)}</span></div><div className="flex justify-between text-slate-600"><span>Finishing</span><span>{formatCurrency(order.bindingCost)}</span></div><div className="flex justify-between text-slate-600"><span>Convenience fee</span><span>{formatCurrency(order.convenienceFee)}</span></div></div><div className="border-t border-slate-200 pt-5"><div className="flex justify-between"><span className="font-semibold text-slate-900">Total payable</span><span className="text-xl font-bold text-slate-950">{formatCurrency(order.total)}</span></div><p className="mt-1 text-right text-xs text-slate-500">Includes all taxes</p></div></div><p className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-xs leading-5 text-blue-800">Your order will be available at <strong>Central Library Print Desk</strong> after payment confirmation.</p></aside>
        </div>
      </div>
    </section>
  );
};

export default PaymentPage;
