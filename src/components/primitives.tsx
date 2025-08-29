import React from "react";
import { BRAND } from "../data/constants";

export const cn = (...x: Array<string | false | undefined>) => x.filter(Boolean).join(" ");

// Formatter
export const fmt = (n: number) => Number(n || 0).toLocaleString("id-ID");
export const sum = (rows: { amount: number }[]) => rows.reduce((a, b) => a + (Number(b.amount) || 0), 0);
export const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 2, maximumFractionDigits: 2 })
    .format(Number(n || 0))
    .replace("IDR", "Rp.");

export const Chip: React.FC<{ tone?: "primary" | "slate" | "success" | "danger"; children: React.ReactNode }> = ({
  tone = "primary",
  children
}) => (
  <span
    className={cn(
      "inline-flex items-center rounded-full px-3 py-1 text-xs font-medium",
      tone === "primary" && "bg-white/10 text-white ring-1 ring-white/20",
      tone === "slate" && "bg-slate-100 text-slate-700",
      tone === "success" && "bg-emerald-100 text-emerald-700",
      tone === "danger" && "bg-rose-100 text-rose-700"
    )}
  >
    {children}
  </span>
);

type BtnVariant = "solid" | "ghost" | "slate" | "brand";

export const Button: React.FC<
  { variant?: BtnVariant; className?: string; children: React.ReactNode } & React.ButtonHTMLAttributes<HTMLButtonElement>
> = ({ variant = "solid", className, children, ...props }) => (
  <button
    {...props}
    className={cn(
      "rounded-2xl px-4 py-2 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed",
      variant === "solid" && "bg-white text-[#1960B0] hover:bg-slate-100 shadow-sm ring-1 ring-[#1960B0]/20",
      variant === "ghost" && "bg-white text-[#1960B0] ring-1 ring-[#1960B0]/30 hover:bg-[#1960B0]/5",
      variant === "slate" && "bg-slate-900 text-white hover:bg-slate-800",
      variant === "brand" && "bg-[#1960B0] text-white hover:brightness-110 shadow-sm",
      className
    )}
  >
    {children}
  </button>
);

export const Card: React.FC<{ className?: string; children: React.ReactNode }> = ({ className, children }) => (
  <div className={cn("rounded-3xl bg-white shadow-sm ring-1 ring-black/5 p-5 text-slate-900", className)}>{children}</div>
);

export const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="grid gap-1 text-sm">
    <span className="font-medium text-slate-700">{label}</span>
    {children}
  </label>
);

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input
    {...props}
    className={cn(
      "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white text-slate-900 placeholder-slate-400",
      "focus:ring-2 focus:ring-[#1960B0]/30 focus:border-[#1960B0]"
    )}
  />
);

export const SelectEl: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select
    {...props}
    className={cn(
      "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white text-slate-900",
      "focus:ring-2 focus:ring-[#1960B0]/30 focus:border-[#1960B0]"
    )}
  />
);

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea
    {...props}
    className={cn(
      "w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white text-slate-900 placeholder-slate-400",
      "focus:ring-2 focus:ring-[#1960B0]/30 focus:border-[#1960B0]"
    )}
  />
);

export const Logo: React.FC<{ size?: number }> = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <rect x="2" y="4" width="20" height="16" rx="4" fill={BRAND.primary} />
    <path d="M6 12h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M9 8h6M9 16h6" stroke="white" strokeWidth="2" strokeLinecap="round" />
  </svg>
);
