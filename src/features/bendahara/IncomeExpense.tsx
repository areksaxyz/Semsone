import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Field, Input, sum } from "../../components/primitives";
import MoneyTable from "./MoneyTable";
import PricingCalculator from "./PricingCalculator";
import { storage } from "../../utils/storage";
import type { MoneyRow } from "../../types";
import { exportFinanceXLSX } from "../../utils/export";
import { rupiah } from "../../components/primitives";

export default function IncomeExpense() {
  const [income, setIncome] = useState<MoneyRow[]>(storage.get("income", []));
  const [expense, setExpense] = useState<MoneyRow[]>(storage.get("expense", []));
  const [capital, setCapital] = useState<MoneyRow[]>(storage.get("capital", []));

  useEffect(() => storage.set("income", income), [income]);
  useEffect(() => storage.set("expense", expense), [expense]);
  useEffect(() => storage.set("capital", capital), [capital]);

  const today = new Date().toISOString().slice(0, 10);
  const [inc, setInc] = useState({ date: today, desc: "", amount: "" });
  const [exp, setExp] = useState({ date: today, desc: "", amount: "" });
  const [cap, setCap] = useState({ date: today, desc: "Modal Awal", amount: "" });

  const totalIncome = useMemo(() => sum(income), [income]);
  const totalExpense = useMemo(() => sum(expense), [expense]);
  const totalCapital = useMemo(() => sum(capital), [capital]);

  const grossProfit = totalIncome - totalExpense;
  const profitVsCapital = grossProfit - totalCapital;
  const roi = totalCapital > 0 ? (grossProfit / totalCapital) * 100 : 0;

  return (
    <div className="grid gap-6">
      {/* Ringkasan */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card><div className="text-xs text-slate-500">Pendapatan</div><div className="mt-1 text-2xl font-black">{rupiah(totalIncome)}</div></Card>
        <Card><div className="text-xs text-slate-500">Pengeluaran</div><div className="mt-1 text-2xl font-black">{rupiah(totalExpense)}</div></Card>
        <Card><div className="text-xs text-slate-500">Modal</div><div className="mt-1 text-2xl font-black">{rupiah(totalCapital)}</div></Card>
        <Card>
          <div className="text-xs text-slate-500">Laba</div>
          <div className="mt-1 text-2xl font-black text-emerald-600">{rupiah(grossProfit)}</div>
          <div className="text-xs text-slate-500">
            Laba - Modal:{" "}
            <b className={profitVsCapital >= 0 ? "text-emerald-600" : "text-rose-600"}>
              {rupiah(profitVsCapital)}
            </b>{" "}
            ({roi.toFixed(2)}%)
          </div>
        </Card>
      </div>

      {/* Pemasukan */}
      <Card>
        <h3 className="text-lg font-bold text-slate-900">Pemasukan</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <Field label="Tanggal"><Input type="date" value={inc.date} onChange={(e) => setInc({ ...inc, date: (e.target as HTMLInputElement).value })} /></Field>
          <Field label="Deskripsi"><Input value={inc.desc} onChange={(e) => setInc({ ...inc, desc: (e.target as HTMLInputElement).value })} placeholder="Penjualan Online" /></Field>
          <Field label="Nominal (Rp.)">
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={inc.amount}
              onChange={(e) => setInc({ ...inc, amount: (e.target as HTMLInputElement).value })}
              placeholder="0.00"
            />
          </Field>
          <div className="flex items-end">
            <Button onClick={() => {
              const val = parseFloat(inc.amount);
              if (!inc.desc || isNaN(val)) return;
              setIncome([{ id: crypto.randomUUID(), date: inc.date, desc: inc.desc, amount: val }, ...income]);
              setInc({ ...inc, desc: "", amount: "" });
            }}>Tambah</Button>
          </div>
        </div>
        <MoneyTable rows={income} onDelete={(id) => setIncome(income.filter(r => r.id !== id))} />
      </Card>

      {/* Pengeluaran */}
      <Card>
        <h3 className="text-lg font-bold text-slate-900">Pengeluaran</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <Field label="Tanggal"><Input type="date" value={exp.date} onChange={(e) => setExp({ ...exp, date: (e.target as HTMLInputElement).value })} /></Field>
          <Field label="Deskripsi"><Input value={exp.desc} onChange={(e) => setExp({ ...exp, desc: (e.target as HTMLInputElement).value })} placeholder="Beli Bahan" /></Field>
          <Field label="Nominal (Rp.)">
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={exp.amount}
              onChange={(e) => setExp({ ...exp, amount: (e.target as HTMLInputElement).value })}
              placeholder="0.00"
            />
          </Field>
          <div className="flex items-end">
            <Button variant="ghost" onClick={() => {
              const val = parseFloat(exp.amount);
              if (!exp.desc || isNaN(val)) return;
              setExpense([{ id: crypto.randomUUID(), date: exp.date, desc: exp.desc, amount: val }, ...expense]);
              setExp({ ...exp, desc: "", amount: "" });
            }}>Tambah</Button>
          </div>
        </div>
        <MoneyTable rows={expense} onDelete={(id) => setExpense(expense.filter(r => r.id !== id))} />
      </Card>

      {/* Modal */}
      <Card>
        <h3 className="text-lg font-bold text-slate-900">Modal</h3>
        <div className="mt-3 grid gap-2 sm:grid-cols-4">
          <Field label="Tanggal"><Input type="date" value={cap.date} onChange={(e) => setCap({ ...cap, date: (e.target as HTMLInputElement).value })} /></Field>
          <Field label="Keterangan"><Input value={cap.desc} onChange={(e) => setCap({ ...cap, desc: (e.target as HTMLInputElement).value })} placeholder="Modal Awal / Tambahan" /></Field>
          <Field label="Nominal (Rp.)">
            <Input
              type="number"
              step="0.01"
              inputMode="decimal"
              value={cap.amount}
              onChange={(e) => setCap({ ...cap, amount: (e.target as HTMLInputElement).value })}
              placeholder="0.00"
            />
          </Field>
          <div className="flex items-end">
            <Button variant="ghost" onClick={() => {
              const val = parseFloat(cap.amount);
              if (!cap.desc || isNaN(val)) return;
              setCapital([{ id: crypto.randomUUID(), date: cap.date, desc: cap.desc, amount: val }, ...capital]);
              setCap({ ...cap, desc: "Modal Awal", amount: "" });
            }}>Tambah</Button>
          </div>
        </div>
        <MoneyTable rows={capital} onDelete={(id) => setCapital(capital.filter(r => r.id !== id))} />
      </Card>

      {/* Export */}
      <div className="flex items-center gap-2">
        <Button variant="ghost" onClick={() => exportFinanceXLSX({ income, expense, capital })}>
          Export Keuangan (XLSX)
        </Button>
      </div>

      {/* Kalkulator Harga Jual */}
      <PricingCalculator />
    </div>
  );
}
