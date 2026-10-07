import { Link } from "react-router-dom";
import Card from "../components/Card";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4.25A1.75 1.75 0 006.75 20h10.5A1.75 1.75 0 0019 18.25V14" />
  </svg>
);

const PrintIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 9V4.75A.75.75 0 017.75 4h8.5a.75.75 0 01.75.75V9M7 17H5.75A1.75 1.75 0 014 15.25v-4.5C4 9.784 4.784 9 5.75 9h12.5c.966 0 1.75.784 1.75 1.75v4.5c0 .966-.784 1.75-1.75 1.75H17m-10 0v2.25a.75.75 0 00.75.75h8.5a.75.75 0 00.75-.75V17M7.5 13h.01" />
  </svg>
);

const LocationIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19 10c0 5.25-7 10-7 10s-7-4.75-7-10a7 7 0 1114 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 10a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14m-5-5l5 5-5 5" />
  </svg>
);

const HomePage = () => {
  return (
    <div className="overflow-hidden bg-white">
      <section className="relative isolate">
        <div className="absolute inset-x-0 top-0 -z-10 h-[34rem] bg-[radial-gradient(circle_at_15%_20%,rgba(191,219,254,.8),transparent_28rem),radial-gradient(circle_at_85%_25%,rgba(221,214,254,.72),transparent_25rem),linear-gradient(180deg,#f8fbff_0%,#fff_100%)]" />
        <div className="mx-auto grid max-w-7xl gap-14 px-6 pb-20 pt-16 sm:px-8 lg:grid-cols-[1.05fr_.95fr] lg:items-center lg:px-10 lg:pb-28 lg:pt-24">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/80 px-3 py-1.5 text-sm font-medium text-blue-700 shadow-sm backdrop-blur">
              <span className="size-2 rounded-full bg-emerald-500" />
              Built for campus life
            </div>
            <h1 className="mt-6 text-4xl font-bold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
              Print smarter.
              <span className="block text-blue-600">Pick up between classes.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
              Send notes, assignments, and project reports to your campus print shop in seconds. No queues, no last-minute stress.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/auth/register" className="inline-flex items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/25 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">
                Start printing free <ArrowIcon />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
                See how it works
              </a>
            </div>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-slate-600">
              <span className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Transparent pricing</span>
              <span className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Live order updates</span>
              <span className="flex items-center gap-2"><span className="text-emerald-500">✓</span> Secure file handling</span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-5 -z-10 rounded-[2.5rem] bg-blue-200/45 blur-3xl" />
            <div className="rounded-[2rem] border border-white/80 bg-white/85 p-4 shadow-2xl shadow-slate-300/50 backdrop-blur sm:p-5">
              <div className="rounded-[1.45rem] bg-slate-950 p-5 text-white sm:p-6">
                <div className="flex items-center justify-between">
                  <div><p className="text-xs font-medium tracking-[.16em] text-blue-200 uppercase">Your next order</p><h2 className="mt-1 text-xl font-semibold">Operating Systems Notes</h2></div>
                  <div className="flex size-11 items-center justify-center rounded-2xl bg-white/10 text-blue-200"><PrintIcon /></div>
                </div>
                <div className="mt-6 rounded-2xl bg-white/10 p-4">
                  <div className="flex items-center justify-between text-sm"><span className="text-slate-300">Status</span><span className="rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-semibold text-emerald-300">Ready to collect</span></div>
                  <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10"><div className="h-full w-full rounded-full bg-emerald-400" /></div>
                  <div className="mt-3 flex justify-between text-xs text-slate-300"><span>Uploaded</span><span>Printed</span><span className="text-white">Ready</span></div>
                </div>
                <div className="mt-5 flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-3">
                  <div className="flex size-9 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200"><LocationIcon /></div>
                  <div><p className="text-xs text-slate-300">Collect from</p><p className="text-sm font-medium">Central Library Print Desk</p></div>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3 px-1 pt-4 text-center">
                <div><p className="text-lg font-bold text-slate-900">2 min</p><p className="text-xs text-slate-500">to upload</p></div>
                <div className="border-x border-slate-100"><p className="text-lg font-bold text-slate-900">24/7</p><p className="text-xs text-slate-500">order online</p></div>
                <div><p className="text-lg font-bold text-slate-900">100%</p><p className="text-xs text-slate-500">paper options</p></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-y border-slate-100 bg-slate-50/70 py-20 sm:py-24">
        <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-10">
          <div className="max-w-2xl"><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Simple by design</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">From file to pickup in three easy steps.</h2></div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            <Card icon={<UploadIcon />} title="1. Upload your file" description="Add your PDF or document, choose colour, paper size, copies, and finishing." />
            <Card icon={<PrintIcon />} title="2. We prepare it" description="Your selected campus print shop receives the order and starts printing." accent="violet" />
            <Card icon={<LocationIcon />} title="3. Pick it up" description="Get a notification when it is ready, then collect it on your way to class." accent="emerald" />
          </div>
        </div>
      </section>

      <section id="services" className="py-20 sm:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 sm:px-8 lg:grid-cols-[.85fr_1.15fr] lg:items-center lg:px-10">
          <div><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Made for students</p><h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Every print job, covered.</h2><p className="mt-5 max-w-md leading-7 text-slate-600">Whether it is a last-minute assignment or a presentation worth showing off, CloudPrint keeps ordering clear and quick.</p><Link to="/auth/register" className="mt-7 inline-flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700">Create your student account <ArrowIcon /></Link></div>
          <div className="grid gap-4 sm:grid-cols-2">
            {[['Lecture notes', 'Double-sided, economical prints for revision.'], ['Assignments', 'Clean documents, ready for submission.'], ['Project reports', 'Premium finishes when presentation matters.'], ['Posters & handouts', 'Bring group work and events to life.']].map(([title, description], index) => (
              <div key={title} className={`rounded-2xl p-5 ${index === 0 ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20' : 'border border-slate-200 bg-white text-slate-900'}`}>
                <span className={`text-xs font-bold tracking-[.14em] uppercase ${index === 0 ? 'text-blue-100' : 'text-slate-400'}`}>0{index + 1}</span><h3 className="mt-7 text-lg font-semibold">{title}</h3><p className={`mt-2 text-sm leading-6 ${index === 0 ? 'text-blue-100' : 'text-slate-600'}`}>{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 pb-20 sm:px-8 lg:px-10 lg:pb-24"><div className="mx-auto flex max-w-7xl flex-col gap-6 rounded-3xl bg-slate-950 px-7 py-10 text-white sm:px-10 lg:flex-row lg:items-center lg:justify-between"><div><h2 className="text-2xl font-bold">Your next deadline is already close enough.</h2><p className="mt-2 text-slate-300">Create an account and make printing one less thing to worry about.</p></div><Link to="/auth/register" className="inline-flex shrink-0 items-center justify-center rounded-xl bg-white px-5 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-blue-50">Get started</Link></div></section>
    </div>
  );
};

export default HomePage;
