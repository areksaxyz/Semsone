import React from "react";

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer
}: {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-[101] w-full sm:w-[640px] max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5 animate-in fade-in zoom-in-95">
        <div className="flex items-center justify-between border-b border-slate-200/70 px-5 py-3">
          <h3 className="text-base font-bold text-slate-900">{title}</h3>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-slate-600 hover:bg-slate-100"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>
        <div className="overflow-auto px-5 py-4">{children}</div>
        {footer && (
          <div className="border-t border-slate-200/70 px-5 py-3 flex items-center justify-end gap-2">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
