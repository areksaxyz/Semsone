import React from "react";
import { Button, fmt } from "../../components/primitives";
import type { MoneyRow } from "../../types";

export default function MoneyTable({ rows, onDelete }: { rows: MoneyRow[]; onDelete: (id: string) => void }) {
  return (
    <div className="mt-3 overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-slate-600">
            <th className="py-2">Tanggal</th>
            <th>Deskripsi</th>
            <th className="text-right">Nominal</th>
            <th></th>
          </tr>
        </thead>
        <tbody className="text-slate-800">
          {rows.map((r) => (
            <tr key={r.id} className="border-t border-slate-100">
              <td className="py-2">{r.date}</td>
              <td className="font-medium">{r.desc}</td>
              <td className="text-right">Rp {fmt(r.amount)}</td>
              <td className="text-right">
                <Button variant="ghost" onClick={() => onDelete(r.id)}>Hapus</Button>
              </td>
            </tr>
          ))}
          {rows.length === 0 && (
            <tr>
              <td colSpan={4} className="py-3 text-slate-500">Belum ada data.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
