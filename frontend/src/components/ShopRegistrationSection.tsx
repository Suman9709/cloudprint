import { Link } from "react-router-dom";
import ContactIcon from "./ContactIcon";

const ArrowIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className={className}>
    <path d="M5 12h14m-6-6 6 6-6 6" />
  </svg>
);

const ShopRegistrationSection = () => (
  <section id="register-shop" aria-labelledby="register-shop-title" className="scroll-mt-28 bg-white px-6 pb-20 sm:px-8 sm:pb-24 lg:px-10">
    <div className="mx-auto grid max-w-[75rem] overflow-hidden rounded-3xl border border-slate-200 lg:grid-cols-2">
      <div className="flex flex-col items-start p-7 sm:p-10 lg:p-12">
        <p className="inline-flex items-center gap-2 text-sm font-semibold text-blue-700">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-5">
            <path d="m4 3-2 6a3 3 0 0 0 5 2 3 3 0 0 0 5 0 3 3 0 0 0 5 0 3 3 0 0 0 5-2l-2-6H4Zm0 10v8h16v-8M9 21v-6h6v6M7 3v6m5-6v6m5-6v6" />
          </svg>
          Bring your shop to CloudPrint
        </p>
        <h2 id="register-shop-title" className="mt-6 text-4xl font-bold leading-[1.12] tracking-tight text-slate-950 sm:text-5xl">
          Your print shop.<br />
          <span className="text-blue-600">One simple link.</span>
        </h2>
        <p className="mt-5 max-w-sm text-base leading-7 text-slate-600">Get a dedicated order page for your shop. Contact us to set up your shop profile, pricing, and owner account.</p>
        <div className="mt-8 flex flex-wrap gap-x-5 gap-y-3 text-sm text-slate-600">
          {["Your own shop link", "Orders in one dashboard"].map((benefit) => (
            <span key={benefit} className="inline-flex items-center gap-2">
              <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" className="size-4 shrink-0 text-blue-600"><path d="m4 10 4 4 8-8" /></svg>
              {benefit}
            </span>
          ))}
        </div>
        <p className="mt-10 text-sm text-slate-500">Already registered? <Link to="/auth/login" className="font-semibold text-slate-950 underline decoration-slate-300 underline-offset-4 transition hover:text-blue-700 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">Sign in to your shop</Link></p>
      </div>

      <div className="flex flex-col justify-center border-t border-slate-200 bg-slate-50 p-7 sm:p-10 lg:border-t-0 lg:border-l lg:p-12">
        <h3 className="text-xl font-semibold tracking-tight text-slate-950">Let’s get your shop set up.</h3>
        <p className="mt-2 text-sm leading-6 text-slate-500">Choose whichever way works best for you.</p>

        <a href="https://wa.me/917488788522?text=Hi%2C%20I%27d%20like%20to%20register%20my%20shop%20on%20CloudPrint." target="_blank" rel="noopener noreferrer" className="group mt-6 flex items-center gap-4 rounded-2xl bg-[#15803d] p-5 text-white transition-colors hover:bg-[#166534] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-700">
          <ContactIcon name="whatsapp" className="size-8 shrink-0" />
          <span className="min-w-0 flex-1">
            <span className="block text-base font-semibold">Chat on WhatsApp</span>
            <span className="mt-1 block text-sm text-green-100">+91 74887 88522</span>
          </span>
          <ArrowIcon className="size-5 shrink-0 transition-transform motion-safe:group-hover:translate-x-1" />
        </a>

        <div className="my-6 flex items-center gap-4" aria-hidden="true"><span className="h-px flex-1 bg-slate-200" /><span className="text-xs text-slate-400">or contact us directly</span><span className="h-px flex-1 bg-slate-200" /></div>

        <div className="divide-y divide-slate-200">
          <a href="mailto:suman.k9709@gmail.com?subject=CloudPrint%20shop%20registration" className="group -mx-2 flex items-center gap-4 rounded-lg px-2 pt-1 pb-5 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
            <ContactIcon name="email" className="size-5 shrink-0 text-slate-500" />
            <span className="min-w-0 flex-1"><span className="block text-xs text-slate-500">Email us</span><span className="mt-1 block break-all text-sm font-semibold text-slate-900 sm:text-base">suman.k9709@gmail.com</span></span>
            <ArrowIcon className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600" />
          </a>
          <a href="tel:+917488788522" className="group -mx-2 flex items-center gap-4 rounded-lg px-2 pt-5 pb-1 transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-blue-600">
            <ContactIcon name="phone" className="size-5 shrink-0 text-slate-500" />
            <span className="min-w-0 flex-1"><span className="block text-xs text-slate-500">Give us a call</span><span className="mt-1 block text-sm font-semibold text-slate-900 sm:text-base">+91 74887 88522</span></span>
            <ArrowIcon className="size-4 shrink-0 text-slate-400 transition-colors group-hover:text-blue-600" />
          </a>
        </div>
      </div>
    </div>
  </section>
);

export default ShopRegistrationSection;
