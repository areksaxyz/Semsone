import React, { useEffect, useState } from "react";
import { Button, Card, Chip, Field, Input } from "../../components/primitives";
import { storage } from "../../utils/storage";

type S = { id: string; product: string; date: string; note: string };

export default function ProductionSchedule() {
  const [items, setItems] = useState<S[]>(storage.get("production", []));
  const [form, setForm] = useState({ product: "", date: new Date().toISOString().slice(0, 10), note: "" });
  useEffect(() => storage.set("production", items), [items]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Jadwal Produksi</h3>
        <Chip tone="slate">{items.length} jadwal</Chip>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Produk"><Input value={form.product} onChange={(e) => setForm({ ...form, product: (e.target as HTMLInputElement).value })} placeholder="Nama Produk" /></Field>
        <Field label="Tanggal"><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: (e.target as HTMLInputElement).value })} /></Field>
        <Field label="Catatan"><Input value={form.note} onChange={(e) => setForm({ ...form, note: (e.target as HTMLInputElement).value })} placeholder="Batch, mesin, dll" /></Field>
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => { if (!form.product) return; setItems([{ id: crypto.randomUUID(), ...form }, ...items]); }}>Tambah</Button>
        <Button variant="ghost" onClick={() => setForm({ product: "", date: new Date().toISOString().slice(0, 10), note: "" })}>Reset</Button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th className="py-2">Produk</th><th>Tanggal</th><th>Catatan</th><th></th></tr></thead>
          <tbody>
            {items.map(item => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="py-2 font-medium">{item.product}</td><td>{item.date}</td><td>{item.note}</td>
                <td className="text-right"><Button variant="ghost" onClick={() => setItems(items.filter(i => i.id !== item.id))}>Hapus</Button></td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="py-3 text-slate-500">Belum ada jadwal produksi.</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
