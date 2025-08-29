import React, { useEffect, useState } from "react";
import { Button, Card, Chip, Field, Input } from "../../components/primitives";
import { storage } from "../../utils/storage";

type Item = { id: string; name: string; qty: number; neededBy: string };

export default function PurchaseList() {
  const [items, setItems] = useState<Item[]>(storage.get("purchaseList", []));
  const [form, setForm] = useState({ name: "", qty: 1, neededBy: new Date().toISOString().slice(0, 10) });
  useEffect(() => storage.set("purchaseList", items), [items]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">List Barang yang Harus Dibeli</h3>
        <Chip tone="slate">{items.length} item</Chip>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-3">
        <Field label="Nama Barang"><Input value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} placeholder="Tepung, Kemasan, dll" /></Field>
        <Field label="Qty"><Input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number((e.target as HTMLInputElement).value) })} /></Field>
        <Field label="Dibutuhkan Tgl"><Input type="date" value={form.neededBy} onChange={(e) => setForm({ ...form, neededBy: (e.target as HTMLInputElement).value })} /></Field>
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => { if (!form.name) return; setItems([{ id: crypto.randomUUID(), ...form }, ...items]); }}>Tambah</Button>
        <Button variant="ghost" onClick={() => setForm({ name: "", qty: 1, neededBy: new Date().toISOString().slice(0, 10) })}>Reset</Button>
      </div>
      <ul className="mt-4 space-y-2">
        {items.map(it => (
          <li key={it.id} className="flex items-center justify-between rounded-xl border border-slate-200 p-3 text-sm">
            <div>
              <div className="font-semibold">{it.name} <span className="ml-1 text-slate-500">× {it.qty}</span></div>
              <div className="text-xs text-slate-500">Butuh: {it.neededBy}</div>
            </div>
            <Button variant="ghost" onClick={() => setItems(items.filter(x => x.id !== it.id))}>Selesai</Button>
          </li>
        ))}
        {items.length === 0 && <li className="text-sm text-slate-500">Belum ada daftar belanja.</li>}
      </ul>
    </Card>
  );
}
