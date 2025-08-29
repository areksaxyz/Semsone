import React, { useEffect, useState } from "react";
import { Button, Card, Chip, Field, Input } from "../../components/primitives";
import { storage } from "../../utils/storage";

type StockRow = { id: string; sku: string; name: string; qty: number; unit: string };

export default function Stock() {
  const [stocks, setStocks] = useState<StockRow[]>(storage.get("stocks", []));
  const [form, setForm] = useState({ sku: "", name: "", qty: 0, unit: "pcs" });
  useEffect(() => storage.set("stocks", stocks), [stocks]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Stok Barang</h3>
        <Chip tone="slate">{stocks.reduce((a, b) => a + Number(b.qty || 0), 0)} total</Chip>
      </div>
      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <Field label="SKU"><Input value={form.sku} onChange={(e) => setForm({ ...form, sku: (e.target as HTMLInputElement).value })} placeholder="SKU-001" /></Field>
        <Field label="Nama"><Input value={form.name} onChange={(e) => setForm({ ...form, name: (e.target as HTMLInputElement).value })} placeholder="Produk" /></Field>
        <Field label="Qty"><Input type="number" value={form.qty} onChange={(e) => setForm({ ...form, qty: Number((e.target as HTMLInputElement).value) })} /></Field>
        <Field label="Unit"><Input value={form.unit} onChange={(e) => setForm({ ...form, unit: (e.target as HTMLInputElement).value })} placeholder="pcs / kg" /></Field>
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => { if (!form.name) return; setStocks([{ id: crypto.randomUUID(), ...form }, ...stocks]); }}>Tambah</Button>
        <Button variant="ghost" onClick={() => setForm({ sku: "", name: "", qty: 0, unit: "pcs" })}>Reset</Button>
      </div>
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-sm">
          <thead><tr className="text-left text-slate-500"><th className="py-2">SKU</th><th>Nama</th><th>Qty</th><th>Unit</th><th></th></tr></thead>
          <tbody>
            {stocks.map(item => (
              <tr key={item.id} className="border-t border-slate-100">
                <td className="py-2">{item.sku}</td><td className="font-medium">{item.name}</td><td>{item.qty}</td><td>{item.unit}</td>
                <td className="text-right"><Button variant="ghost" onClick={() => setStocks(stocks.filter(s => s.id !== item.id))}>Hapus</Button></td>
              </tr>
            ))}
            {stocks.length === 0 && <tr><td colSpan={5} className="py-3 text-slate-500">Belum ada stok.</td></tr>}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
