import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { api, apiError, ensureCsrf } from "../../lib/api";

type ShopSettings = {
  id: number;
  name: string;
  slug: string;
  address: string;
  phone: string;
  is_accepting_orders: boolean;
  black_white_price_per_page: string;
  colour_price_per_page: string;
  spiral_bind_cost: string;
};

const ShopSettingsPage = () => {
  const [shops, setShops] = useState<ShopSettings[]>([]);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [savingId, setSavingId] = useState<number | null>(null);

  useEffect(() => {
    api.get<ShopSettings[]>("/api/shops/dashboard/settings/")
      .then(({ data }) => setShops(data))
      .catch((requestError) => setError(apiError(requestError, "Please sign in with your shop account to edit settings.")));
  }, []);

  const updateField = <K extends keyof ShopSettings>(shopId: number, field: K, value: ShopSettings[K]) => {
    setShops((current) => current.map((shop) => shop.id === shopId ? { ...shop, [field]: value } : shop));
  };

  const save = async (event: FormEvent<HTMLFormElement>, shop: ShopSettings) => {
    event.preventDefault();
    setSavingId(shop.id);
    setError("");
    setNotice("");
    try {
      const { data } = await api.patch<ShopSettings>(`/api/shops/dashboard/settings/${shop.id}/`, shop, { headers: await ensureCsrf() });
      setShops((current) => current.map((item) => item.id === data.id ? data : item));
      setNotice(`${data.name} profile and prices were saved.`);
    } catch (requestError) {
      setError(apiError(requestError, "Shop settings could not be saved."));
    } finally {
      setSavingId(null);
    }
  };

  return <section className="min-h-screen bg-slate-50 px-6 py-10"><div className="mx-auto max-w-4xl"><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">Shop dashboard</p><h1 className="mt-2 text-3xl font-bold">Profile and prices</h1><p className="mt-2 text-slate-600">Update the public shop details and the prices shown to guest customers before they submit an order.</p>{error && <div className="mt-6 rounded-2xl bg-rose-50 p-5 text-rose-800"><p className="font-semibold">{error}</p><Link to="/auth/login" className="mt-2 inline-block font-bold underline">Shop sign in</Link></div>}{notice && <p className="mt-6 rounded-2xl bg-emerald-50 p-4 font-semibold text-emerald-700">{notice}</p>}<div className="mt-7 space-y-6">{shops.map((shop) => <form key={shop.id} onSubmit={(event) => void save(event, shop)} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"><div className="flex flex-col gap-2 border-b border-slate-100 pb-5 sm:flex-row sm:items-start sm:justify-between"><div><h2 className="text-xl font-bold">{shop.name}</h2><p className="mt-1 text-sm text-slate-500">Public link: <span className="font-semibold">/shop/{shop.slug}</span></p></div><label className="flex items-center gap-2 text-sm font-semibold"><input checked={shop.is_accepting_orders} onChange={(event) => updateField(shop.id, "is_accepting_orders", event.target.checked)} type="checkbox" className="size-4" /> Accepting orders</label></div><div className="mt-6 grid gap-4 sm:grid-cols-2"><label className="text-sm font-semibold">Shop name<input value={shop.name} onChange={(event) => updateField(shop.id, "name", event.target.value)} required className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="text-sm font-semibold">Phone<input value={shop.phone} onChange={(event) => updateField(shop.id, "phone", event.target.value)} placeholder="Shop phone number" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label><label className="text-sm font-semibold sm:col-span-2">Address<input value={shop.address} onChange={(event) => updateField(shop.id, "address", event.target.value)} placeholder="Shop address" className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-3 font-normal" /></label></div><div className="mt-7 border-t border-slate-100 pt-6"><h3 className="font-bold">Public print pricing</h3><p className="mt-1 text-sm text-slate-600">These three prices are visible on your public upload page.</p><div className="mt-4 grid gap-4 sm:grid-cols-3"><label className="text-sm font-semibold">Black & white / page<div className="mt-2 flex items-center rounded-xl border border-slate-200 px-3"><span className="text-slate-500">₹</span><input min="0.01" step="0.01" type="number" value={shop.black_white_price_per_page} onChange={(event) => updateField(shop.id, "black_white_price_per_page", event.target.value)} className="w-full px-2 py-3 font-normal outline-none" /></div></label><label className="text-sm font-semibold">Colour / page<div className="mt-2 flex items-center rounded-xl border border-slate-200 px-3"><span className="text-slate-500">₹</span><input min="0.01" step="0.01" type="number" value={shop.colour_price_per_page} onChange={(event) => updateField(shop.id, "colour_price_per_page", event.target.value)} className="w-full px-2 py-3 font-normal outline-none" /></div></label><label className="text-sm font-semibold">Spiral binding<div className="mt-2 flex items-center rounded-xl border border-slate-200 px-3"><span className="text-slate-500">₹</span><input min="0" step="0.01" type="number" value={shop.spiral_bind_cost} onChange={(event) => updateField(shop.id, "spiral_bind_cost", event.target.value)} className="w-full px-2 py-3 font-normal outline-none" /></div></label></div></div><button disabled={savingId === shop.id} className="mt-7 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300">{savingId === shop.id ? "Saving…" : "Save profile and prices"}</button></form>)}{shops.length === 0 && !error && <p className="py-10 text-slate-500">Loading shop settings…</p>}</div></div></section>;
};

export default ShopSettingsPage;
