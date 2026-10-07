import { useRef, useState, type ChangeEvent, type DragEvent } from "react";
import { useNavigate } from "react-router-dom";

const UploadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-6" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 16V4m0 0L7.5 8.5M12 4l4.5 4.5M5 14v4.25A1.75 1.75 0 006.75 20h10.5A1.75 1.75 0 0019 18.25V14" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="size-5" aria-hidden="true">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14.5 3.75H6.75a1.5 1.5 0 00-1.5 1.5v13.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V7.5l-3.25-3.75z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 3.75V8h3.75M8.5 13h7M8.5 16h5" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="size-4" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" d="M9 18l6-6-6-6" /></svg>
);

const formatCurrency = (value: number) => `₹${value.toFixed(2)}`;

const StudentDashboard = () => {
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [printMode, setPrintMode] = useState<"Black & white" | "Colour">("Black & white");
  const [sides, setSides] = useState<"Single-sided" | "Double-sided">("Double-sided");
  const [copies, setCopies] = useState(1);
  const [binding, setBinding] = useState<"None" | "Staple" | "Spiral bind">("None");

  const pageCount = selectedFile ? 12 : 0;
  const printRate = printMode === "Colour" ? 4.5 : 1.5;
  const sideSaving = sides === "Double-sided" ? 0.9 : 1;
  const printCost = pageCount * copies * printRate * sideSaving;
  const bindingCost = binding === "Spiral bind" ? 25 : binding === "Staple" ? 5 : 0;
  const convenienceFee = printCost ? 5 + Math.round(printCost * 0.02) : 0;
  const total = printCost + bindingCost + convenienceFee;

  const receiveFiles = (files: FileList | null) => {
    const file = files?.[0];
    if (file) setSelectedFile(file);
  };

  const handleInput = (event: ChangeEvent<HTMLInputElement>) => receiveFiles(event.target.files);
  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    receiveFiles(event.dataTransfer.files);
  };

  const checkout = () => {
    if (!selectedFile) {
      inputRef.current?.click();
      return;
    }
    navigate("/student/payment", {
      state: { documentName: selectedFile.name, pageCount, printMode, sides, copies, binding, printCost, bindingCost, convenienceFee, total },
    });
  };

  return (
    <section className="min-h-screen bg-slate-50/80 px-6 py-10 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-5 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between">
          <div><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Student workspace</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">Print something great, Aisha.</h1><p className="mt-2 text-slate-600">Upload your document, select your preferences, and collect it when it is ready.</p></div>
          <div className="inline-flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm text-emerald-800"><span className="size-2 rounded-full bg-emerald-500" /><span><strong className="font-semibold">Central Library</strong> is accepting orders</span></div>
        </div>

        <div className="mt-8 grid gap-7 lg:grid-cols-[minmax(0,1fr)_23rem] lg:items-start">
          <div className="space-y-6">
            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div className="flex items-start justify-between gap-4"><div><p className="text-sm font-bold text-blue-600">01</p><h2 className="mt-1 text-xl font-bold text-slate-950">Upload your document</h2><p className="mt-1 text-sm text-slate-600">PDF, Word, PowerPoint, Excel, JPG, PNG and more.</p></div><span className="rounded-xl bg-blue-50 p-3 text-blue-600"><UploadIcon /></span></div>
              <input ref={inputRef} id="print-file" type="file" accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.jpg,.jpeg,.png" className="hidden" onChange={handleInput} />
              <div role="button" tabIndex={0} onClick={() => inputRef.current?.click()} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") inputRef.current?.click(); }} onDragOver={(event) => { event.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={handleDrop} className={`mt-6 cursor-pointer rounded-2xl border-2 border-dashed p-7 text-center transition sm:p-9 ${isDragging ? "border-blue-500 bg-blue-50" : selectedFile ? "border-emerald-200 bg-emerald-50/50" : "border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-blue-50/40"}`}>
                {selectedFile ? <div className="mx-auto flex max-w-md items-center gap-4 rounded-xl bg-white p-4 text-left shadow-sm"><span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FileIcon /></span><div className="min-w-0 flex-1"><p className="truncate text-sm font-semibold text-slate-900">{selectedFile.name}</p><p className="mt-1 text-xs text-slate-500">Ready for print · estimated 12 pages</p></div><span className="text-xs font-semibold text-blue-600">Replace</span></div> : <><span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600"><UploadIcon /></span><p className="mt-4 font-semibold text-slate-800">Drop your file here or <span className="text-blue-600">browse files</span></p><p className="mt-2 text-sm text-slate-500">Maximum file size: 50 MB</p></>}
              </div>
            </section>

            <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
              <div><p className="text-sm font-bold text-blue-600">02</p><h2 className="mt-1 text-xl font-bold text-slate-950">Choose print options</h2><p className="mt-1 text-sm text-slate-600">Fine-tune the order before you pay.</p></div>
              <div className="mt-7 grid gap-6 sm:grid-cols-2">
                <fieldset><legend className="text-sm font-semibold text-slate-700">Print mode</legend><div className="mt-3 grid grid-cols-2 gap-2">{(["Black & white", "Colour"] as const).map((option) => <button key={option} type="button" onClick={() => setPrintMode(option)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${printMode === option ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>{option}</button>)}</div></fieldset>
                <fieldset><legend className="text-sm font-semibold text-slate-700">Print sides</legend><div className="mt-3 grid grid-cols-2 gap-2">{(["Single-sided", "Double-sided"] as const).map((option) => <button key={option} type="button" onClick={() => setSides(option)} className={`rounded-xl border px-3 py-3 text-sm font-semibold transition ${sides === option ? "border-blue-600 bg-blue-50 text-blue-700 ring-2 ring-blue-100" : "border-slate-200 text-slate-600 hover:border-slate-300"}`}>{option}</button>)}</div></fieldset>
                <label className="block text-sm font-semibold text-slate-700">Number of copies<select value={copies} onChange={(event) => setCopies(Number(event.target.value))} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option value={1}>1 copy</option><option value={2}>2 copies</option><option value={3}>3 copies</option><option value={5}>5 copies</option></select></label>
                <label className="block text-sm font-semibold text-slate-700">Finishing<select value={binding} onChange={(event) => setBinding(event.target.value as typeof binding)} className="mt-3 w-full rounded-xl border border-slate-200 bg-white px-3 py-3 text-sm font-medium text-slate-800 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100"><option>None</option><option>Staple</option><option>Spiral bind</option></select></label>
              </div>
              <div className="mt-6 flex items-center gap-3 rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-800"><span className="text-base">💡</span><span>We will confirm the exact page count after the file is processed. Your final total may adjust slightly.</span></div>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg shadow-slate-200/50">
              <div className="bg-slate-950 px-6 py-5 text-white"><p className="text-sm font-semibold text-blue-200">Order summary</p><p className="mt-1 text-lg font-bold">Your print estimate</p></div>
              <div className="p-6">
                <div className="flex items-start gap-3 border-b border-slate-100 pb-5"><span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600"><FileIcon /></span><div className="min-w-0"><p className="truncate text-sm font-semibold text-slate-900">{selectedFile?.name ?? "No document selected"}</p><p className="mt-1 text-xs text-slate-500">{pageCount ? `${pageCount} pages · ${copies} ${copies === 1 ? "copy" : "copies"}` : "Upload a file to calculate pages"}</p></div></div>
                <div className="space-y-3 py-5 text-sm"><div className="flex justify-between text-slate-600"><span>Print ({printMode})</span><span>{formatCurrency(printCost)}</span></div><div className="flex justify-between text-slate-600"><span>Finishing{binding !== "None" ? ` · ${binding}` : ""}</span><span>{formatCurrency(bindingCost)}</span></div><div className="flex justify-between text-slate-600"><span>Convenience fee <span title="Covers order processing and live updates" className="cursor-help rounded-full border border-slate-300 px-1 text-[10px]">i</span></span><span>{formatCurrency(convenienceFee)}</span></div></div>
                <div className="border-t border-slate-200 pt-5"><div className="flex items-end justify-between"><span className="font-semibold text-slate-900">Estimated total</span><span className="text-2xl font-bold tracking-tight text-slate-950">{formatCurrency(total)}</span></div><p className="mt-1 text-right text-xs text-slate-500">Taxes included</p></div>
                <button type="button" onClick={checkout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3.5 text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-200">{selectedFile ? "Continue to payment" : "Choose a file to continue"} <ChevronIcon /></button>
                <p className="mt-4 text-center text-xs leading-5 text-slate-500">You will review your order and select a payment method next.</p>
              </div>
            </div>
            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-500"><span className="text-emerald-600">●</span> Secure payment · Your files stay private</div>
          </aside>
        </div>

        <section id="recent-orders" className="mt-10 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><div className="flex items-center justify-between"><div><h2 className="text-xl font-bold text-slate-950">Recent orders</h2><p className="mt-1 text-sm text-slate-600">Reorder a document in one click.</p></div><button type="button" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View all orders</button></div><div className="mt-6 grid gap-3 md:grid-cols-2"><div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-white p-2.5 text-blue-600 shadow-sm"><FileIcon /></span><div><p className="text-sm font-semibold text-slate-900">Data Structures Notes.pdf</p><p className="mt-1 text-xs text-slate-500">28 pages · Black & white</p></div></div><span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-semibold text-emerald-700">Collected</span></div><div className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center gap-3"><span className="rounded-xl bg-white p-2.5 text-violet-600 shadow-sm"><FileIcon /></span><div><p className="text-sm font-semibold text-slate-900">Seminar Presentation.pptx</p><p className="mt-1 text-xs text-slate-500">14 slides · Colour</p></div></div><span className="rounded-full bg-blue-100 px-2.5 py-1 text-xs font-semibold text-blue-700">Ready</span></div></div></section>
      </div>
    </section>
  );
};

export default StudentDashboard;
