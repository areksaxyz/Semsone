import React, { useMemo, useState } from "react";
import { Card, Field, Input, rupiah } from "../../components/primitives";
import { hargaJualPerUnit } from "../../utils/pricing";

export default function PricingCalculator() {
  const [form, setForm] = useState({
    modal: "",
    biayaOp: "",
    keuntungan: "",      
    jumlahProduk: "1"
  });

  const harga = useMemo(() => {
    return hargaJualPerUnit({
      modal: Number(form.modal),
      biayaOp: Number(form.biayaOp),
      keuntungan: Number(form.keuntungan),
      jumlahProduk: Number(form.jumlahProduk)
    });
  }, [form]);

  const totalBiaya =
    Number(form.modal || 0) + Number(form.biayaOp || 0) + Number(form.keuntungan || 0);

  return (
    <Card>
      <h3 className="text-lg font-bold text-slate-900">Kalkulator Harga Jual</h3>
      <p className="text-sm text-slate-600">
        Rumus: <b>(Modal + Biaya Operasional + Keuntungan) ÷ Jumlah Produk</b>
      </p>

      <div className="mt-3 grid gap-3 sm:grid-cols-4">
        <Field label="Modal">
          <Input
            type="number" step="0.01" inputMode="decimal"
            value={form.modal}
            onChange={(e) => setForm({ ...form, modal: (e.target as HTMLInputElement).value })}
            placeholder="100000"
          />
        </Field>

        <Field label="Biaya Operasional">
          <Input
            type="number" step="0.01" inputMode="decimal"
            value={form.biayaOp}
            onChange={(e) => setForm({ ...form, biayaOp: (e.target as HTMLInputElement).value })}
            placeholder="50000"
          />
        </Field>

        <Field label="Keuntungan (Nominal)">
          <Input
            type="number" step="0.01" inputMode="decimal"
            value={form.keuntungan}
            onChange={(e) => setForm({ ...form, keuntungan: (e.target as HTMLInputElement).value })}
            placeholder="30000"
          />
        </Field>

        <Field label="Jumlah Produk">
          <Input
            type="number" step="1" inputMode="numeric" min={1}
            value={form.jumlahProduk}
            onChange={(e) => setForm({ ...form, jumlahProduk: (e.target as HTMLInputElement).value })}
            placeholder="50"
          />
        </Field>
      </div>

      <div className="mt-3 text-sm text-slate-700 space-y-1">
        <div>Total biaya + keuntungan: <b>{rupiah(totalBiaya)}</b></div>
        <div>Perkiraan harga jual / pcs: <b>{rupiah(Number(harga || 0))}</b></div>
      </div>
    </Card>
  );
}
