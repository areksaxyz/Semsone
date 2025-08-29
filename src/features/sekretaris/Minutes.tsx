import React, { useEffect, useState } from "react";
import { Button, Card, Chip, Field, Input, Textarea } from "../../components/primitives";
import { exportMinutesPDF } from "../../utils/export";
import { storage } from "../../utils/storage";

type Minute = { id: string; title: string; date: string; notes: string };

export default function Minutes() {
  const [minutes, setMinutes] = useState<Minute[]>(storage.get("minutes", []));
  const [form, setForm] = useState({ title: "", date: new Date().toISOString().slice(0, 10), notes: "" });
  useEffect(() => storage.set("minutes", minutes), [minutes]);

  return (
    <Card>
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900">Notulen</h3>
        <Chip tone="success">{minutes.length} dokumen</Chip>
      </div>
      <div className="mt-4 grid gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Judul">
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: (e.target as HTMLInputElement).value })} placeholder="Rapat Mingguan" />
          </Field>
          <Field label="Tanggal">
            <Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: (e.target as HTMLInputElement).value })} />
          </Field>
        </div>
        <Field label="Ringkasan">
          <Textarea rows={4} value={form.notes} onChange={(e) => setForm({ ...form, notes: (e.target as HTMLTextAreaElement).value })} placeholder="Poin penting..." />
        </Field>
      </div>
      <div className="mt-3 flex gap-2">
        <Button onClick={() => { if (!form.title) return; setMinutes([{ id: crypto.randomUUID(), ...form }, ...minutes]); }}>Simpan</Button>
        <Button variant="ghost" onClick={() => setForm({ title: "", date: new Date().toISOString().slice(0, 10), notes: "" })}>Reset</Button>
      </div>
      <ul className="mt-4 space-y-3">
        {minutes.map(item => (
          <li key={item.id} className="rounded-xl border border-slate-200 p-3">
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-xs text-slate-500">{item.date}</div>
              </div>
              <div className="flex gap-2">
                <Button variant="ghost" onClick={() => exportMinutesPDF(item)}>Download PDF</Button>
                <Button variant="ghost" onClick={() => setMinutes(minutes.filter(i => i.id !== item.id))}>Hapus</Button>
              </div>
            </div>
            <p className="mt-2 text-sm text-slate-700 whitespace-pre-wrap">{item.notes}</p>
          </li>
        ))}
        {minutes.length === 0 && <li className="text-sm text-slate-500">Belum ada notulen.</li>}
      </ul>
    </Card>
  );
}
