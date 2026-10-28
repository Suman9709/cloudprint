import { Link } from "react-router-dom";
import ShopRegistrationSection from "../components/ShopRegistrationSection";
import VelqoMark from "../components/VelqoMark";

const flow = [
  ["Shop link", "Every print shop gets one shareable order page."],
  ["Guest upload", "Customers choose files and print options without an account."],
  ["Pickup code", "A four-digit code keeps collection simple at the counter."],
];

const HomePage = () => (
  <div className="bg-white text-slate-950">
    <section className="relative isolate overflow-hidden bg-slate-950">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(37,99,235,.45),transparent_28rem),radial-gradient(circle_at_85%_40%,rgba(124,58,237,.3),transparent_25rem)]" />
      <div className="hero mx-auto min-h-[38rem] max-w-7xl px-6 py-16 sm:px-8 lg:px-10 lg:py-24">
        <div className="hero-content grid w-full max-w-none gap-14 p-0 lg:grid-cols-[1.05fr_.95fr] lg:items-center">
          <div className="max-w-2xl">
            <div className="badge border-blue-300/20 bg-blue-400/10 px-3 py-3 text-xs font-bold tracking-[.14em] text-blue-100 uppercase">Guest-first print ordering</div>
            <h1 className="mt-6 text-4xl font-black leading-[1.03] tracking-tight text-white sm:text-5xl lg:text-6xl">One link for every print shop.<span className="block text-blue-300">One easy pickup.</span></h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">CloudPrint turns a shop URL into a clear order flow: upload, choose print options, and collect with a four-digit code.</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row"><a href="#how-it-works" className="btn border-0 bg-blue-500 px-6 text-white shadow-lg shadow-blue-500/20 hover:bg-blue-400">See how it works</a><a href="#register-shop" className="btn border-white/20 bg-white/5 px-6 text-white hover:border-white/30 hover:bg-white/10">Register your shop</a></div>
            <div className="mt-10 flex items-center gap-4 border-t border-white/10 pt-6"><VelqoMark /><div><p className="text-sm font-semibold text-white">A product by Velqo</p><p className="mt-1 text-xs text-slate-400">Build. Brand. Grow.</p></div></div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-8 -z-10 rounded-full bg-blue-500/20 blur-3xl" />
            <div className="card overflow-hidden border border-white/10 bg-white shadow-2xl shadow-black/30">
              <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4"><div><p className="text-xs font-bold tracking-[.14em] text-blue-600 uppercase">Live order flow</p><p className="mt-1 text-sm font-semibold text-slate-950">Campus Copy Centre</p></div><span className="badge border-emerald-200 bg-emerald-50 text-emerald-700">Ready to print</span></div>
              <div className="space-y-5 p-6"><div className="rounded-2xl border border-slate-200 bg-slate-50 p-4"><div className="flex items-start gap-3"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-700">PDF</span><div className="min-w-0 flex-1"><p className="truncate font-semibold text-slate-950">semester-notes.pdf</p><p className="mt-1 text-sm text-slate-500">24 pages · Double-sided · 2 copies</p></div><span className="text-sm font-bold text-slate-900">₹51</span></div></div><div className="rounded-2xl bg-slate-950 p-5 text-center text-white"><p className="text-xs font-bold tracking-[.16em] text-blue-200 uppercase">Pickup code</p><p className="mt-2 font-mono text-5xl font-bold tracking-[.28em]">4821</p><p className="mt-3 text-sm text-slate-300">Show this code at the counter.</p></div><div className="grid grid-cols-3 divide-x divide-slate-100 text-center"><div><p className="text-lg font-black text-slate-950">1</p><p className="mt-1 text-[11px] font-medium text-slate-500">shop link</p></div><div><p className="text-lg font-black text-slate-950">0</p><p className="mt-1 text-[11px] font-medium text-slate-500">accounts</p></div><div><p className="text-lg font-black text-slate-950">4</p><p className="mt-1 text-[11px] font-medium text-slate-500">digits</p></div></div></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section className="border-b border-slate-100 bg-slate-50/80 py-12">
      <div className="mx-auto grid max-w-7xl gap-4 px-6 sm:grid-cols-3 sm:px-8 lg:px-10">{flow.map(([title, description], index) => <article key={title} className="card border border-slate-200 bg-white shadow-sm"><div className="card-body gap-3 p-5"><span className="text-xs font-black tracking-[.14em] text-blue-600">0{index + 1}</span><h2 className="text-base font-bold text-slate-950">{title}</h2><p className="text-sm leading-6 text-slate-600">{description}</p></div></article>)}</div>
    </section>

    <section id="how-it-works" className="py-20 sm:py-24">
      <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
        <div className="max-w-2xl"><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">The customer journey</p><h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl">From file selection to a smooth handover.</h2><p className="mt-4 text-lg leading-8 text-slate-600">No customer account, password, or student dashboard gets in the way.</p></div>
        <ul className="steps steps-vertical mt-12 w-full lg:steps-horizontal"><li className="step step-primary text-left"><div className="max-w-48 pb-6 lg:pb-0"><p className="font-bold text-slate-950">Open the shop link</p><p className="mt-2 text-sm leading-6 text-slate-500">Each shop has its own order page.</p></div></li><li className="step step-primary text-left"><div className="max-w-48 pb-6 lg:pb-0"><p className="font-bold text-slate-950">Upload and choose options</p><p className="mt-2 text-sm leading-6 text-slate-500">Select files, copies, colour, sides, and finishing.</p></div></li><li className="step step-primary text-left"><div className="max-w-48 pb-6 lg:pb-0"><p className="font-bold text-slate-950">Receive the pickup code</p><p className="mt-2 text-sm leading-6 text-slate-500">The order is tied to a simple four-digit code.</p></div></li><li className="step step-primary text-left"><div className="max-w-48"><p className="font-bold text-slate-950">Collect at the counter</p><p className="mt-2 text-sm leading-6 text-slate-500">Shop staff process the order and confirm payment.</p></div></li></ul>
      </div>
    </section>

    <section id="services" className="pb-20 sm:pb-24">
      <div className="mx-auto grid max-w-7xl gap-6 px-6 sm:px-8 lg:grid-cols-[.9fr_1.1fr] lg:px-10">
        <div className="card border border-slate-200 bg-slate-50"><div className="card-body p-8"><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">For print shops</p><h2 className="mt-2 text-3xl font-black tracking-tight text-slate-950">A dashboard that stays out of the way.</h2><p className="mt-4 leading-7 text-slate-600">Review submitted files, see print preferences, update progress, and match pickup codes without forcing customers to create an account.</p><Link to="/auth/login" className="btn btn-primary mt-6 w-fit border-0 bg-blue-600 hover:bg-blue-700">Shop owner sign in</Link></div></div>
        <div className="card overflow-hidden bg-slate-950 text-white"><div className="card-body relative p-8"><div className="absolute right-0 top-0 size-40 rounded-full bg-blue-500/20 blur-3xl" /><p className="relative text-sm font-bold tracking-[.16em] text-blue-200 uppercase">Built with Velqo</p><h2 className="relative mt-2 max-w-lg text-3xl font-black tracking-tight">A precise product experience for the moment a file becomes a print order.</h2><div className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-6"><div><p className="text-sm font-semibold">CloudPrint × Velqo</p><p className="mt-1 text-sm text-slate-400">Designed and developed by Velqo.</p></div><VelqoMark /></div></div></div>
      </div>
    </section>

    <ShopRegistrationSection />
  </div>
);

export default HomePage;
