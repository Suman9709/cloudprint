import type { ReactNode } from "react";

type CardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  accent?: "blue" | "violet" | "emerald";
};

const accentClasses = {
  blue: "bg-blue-50 text-blue-600 ring-blue-100",
  violet: "bg-violet-50 text-violet-600 ring-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 ring-emerald-100",
};

const Card = ({ icon, title, description, accent = "blue" }: CardProps) => {
  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60">
      <div className={`mb-5 flex size-12 items-center justify-center rounded-2xl ring-1 ${accentClasses[accent]}`}>
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
    </article>
  );
};

export default Card;
