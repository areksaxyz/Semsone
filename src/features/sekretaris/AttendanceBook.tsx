import React, { useEffect, useMemo, useState } from "react";
import { Card, Chip, Field, Input, SelectEl, Button } from "../../components/primitives";
import { ATT_STATUSES } from "../../data/constants";
import { hydrateRows } from "../../data/members";
import { exportAttendanceCSV, exportAttendanceXLSX } from "../../utils/export";
import { storage } from "../../utils/storage";

export type AttRow = {
  nim: string;
  name: string;
  status: "Hadir" | "Izin" | "Sakit" | "Tanpa Keterangan";
};

export default function AttendanceBook() {
  const today = new Date().toISOString().slice(0, 10);
  const [date, setDate] = useState(today);

  const [book, setBook] = useState<Record<string, AttRow[]>>(storage.get("attendanceBook", {}));
  const [rows, setRows] = useState<AttRow[]>(() => hydrateRows(book[date]));

  useEffect(() => { storage.set("attendanceBook", book); }, [book]);
  useEffect(() => { setRows(hydrateRows(book[date])); }, [date]);

  function setAll(status: AttRow["status"]) {
    setRows(rows.map(r => ({ ...r, status })));
  }
  function save() {
    setBook({ ...book, [date]: rows });
  }

  const summary = useMemo(() => {
    const c: Record<string, number> = { Hadir: 0, Izin: 0, Sakit: 0, "Tanpa Keterangan": 0 };
    rows.forEach(r => { c[r.status] = (c[r.status] || 0) + 1; });
    return c;
  }, [rows]);

  // ==== Riwayat ====
  const [histDate, setHistDate] = useState(today);
  const hist: AttRow[] = book[histDate] ?? [];

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Presensi — Input Cepat</h3>
          <Chip tone="slate">{rows.length} anggota</Chip>
        </div>

        <div className="mt-3 grid gap-3 sm:grid-cols-4">
          <Field label="Tanggal">
            <Input type="date" value={date} onChange={(e) => setDate((e.target as HTMLInputElement).value)} />
          </Field>
          <div className="flex items-end gap-2 sm:col-span-3">
            <Button onClick={() => setAll("Hadir")}>Set Semua Hadir</Button>
            <Button variant="ghost" onClick={() => setAll("Izin")}>Semua Izin</Button>
            <Button variant="ghost" onClick={() => setAll("Sakit")}>Semua Sakit</Button>
            <Button variant="ghost" onClick={() => setAll("Tanpa Keterangan")}>Kosongkan</Button>
          </div>
        </div>

        <div className="mt-3 overflow-x-auto max-h-[50vh]">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-500">
                <th className="py-2">Nama</th>
                <th>NIM</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, idx) => (
                <tr key={r.nim} className="border-t border-slate-100">
                  <td className="py-2 font-medium">{idx + 1}. {r.name}</td>
                  <td>{r.nim}</td>
                  <td>
                    <SelectEl
                      value={r.status}
                      onChange={(e) => {
                        const v = (e.target as HTMLSelectElement).value as AttRow["status"];
                        setRows(rows.map(x => x.nim === r.nim ? { ...x, status: v } : x));
                      }}
                    >
                      {ATT_STATUSES.map(s => <option key={s}>{s}</option>)}
                    </SelectEl>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Button onClick={save}>Simpan Presensi</Button>
          <Button variant="ghost" onClick={() => exportAttendanceCSV(date, rows)}>Export CSV</Button>
          <Button variant="ghost" onClick={() => exportAttendanceXLSX(date, rows)}>Export XLSX</Button>
          <div className="ml-auto flex gap-2 text-xs text-slate-600">
            <span>Hadir: <b className="text-emerald-700">{summary.Hadir}</b></span>
            <span>Izin: <b>{summary.Izin}</b></span>
            <span>Sakit: <b>{summary.Sakit}</b></span>
            <span>Tanpa Ket.: <b className="text-rose-700">{summary["Tanpa Keterangan"]}</b></span>
          </div>
        </div>
      </Card>

      {/* RIWAYAT */}
      <Card>
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900">Riwayat Kehadiran</h3>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Tanggal">
            <Input type="date" value={histDate} onChange={(e) => setHistDate((e.target as HTMLInputElement).value)} />
          </Field>
          <div className="sm:col-span-2 flex items-end gap-2">
            <Button variant="ghost" onClick={() => exportAttendanceCSV(histDate, hist)}>Export CSV Tanggal Ini</Button>
            <Button variant="ghost" onClick={() => exportAttendanceXLSX(histDate, hist)}>Export XLSX Tanggal Ini</Button>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <List title="Hadir" items={hist.filter(x => x.status === "Hadir")} tone="success" />
          <List title="Izin" items={hist.filter(x => x.status === "Izin")} />
          <List title="Sakit" items={hist.filter(x => x.status === "Sakit")} />
          <List title="Tanpa Keterangan" items={hist.filter(x => x.status === "Tanpa Keterangan")} tone="danger" />
        </div>
      </Card>
    </div>
  );
}

function List({ title, items, tone }: { title: string; items: AttRow[]; tone?: "success" | "danger" }) {
  return (
    <div className="rounded-2xl border border-slate-200 p-3">
      <div className="mb-2 flex items-center justify-between">
        <div className="text-sm font-semibold text-slate-700">{title}</div>
        <Chip tone={tone as any}>{items.length}</Chip>
      </div>
      <ul className="text-sm text-slate-700 space-y-1 max-h-64 overflow-auto">
        {items.map((x, i) => <li key={x.nim}>{i + 1}. {x.name} ({x.nim})</li>)}
        {items.length === 0 && <li className="text-slate-400">—</li>}
      </ul>
    </div>
  );
}