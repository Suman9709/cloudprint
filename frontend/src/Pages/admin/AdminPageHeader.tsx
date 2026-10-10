import { Link } from "react-router-dom";
import type { ReactNode } from "react";

type Props = { eyebrow: string; title: string; description: string; action?: ReactNode };

const AdminPageHeader = ({ eyebrow, title, description, action }: Props) => <header className="flex flex-col gap-4 border-b border-slate-200 pb-8 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-bold tracking-[.16em] text-blue-600 uppercase">{eyebrow}</p><h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-950 sm:text-4xl">{title}</h1><p className="mt-2 max-w-2xl text-slate-600">{description}</p></div>{action}</header>;

export const AdminBackToShops = () => <Link to="/admin/shops" className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50">Back to shops</Link>;

export default AdminPageHeader;
