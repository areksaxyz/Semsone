import { jsPDF } from "jspdf";
import * as XLSX from "xlsx";
import type { AttRow, MoneyRow } from "../types";

export function buildAttendanceCSV(date: string, rows: AttRow[]) {
  const header = ["Tanggal", "Nama", "NIM", "Status"].join(",");
  const body = rows.map(r => [date, `"${r.name}"`, r.nim, r.status].join(",")).join("\n");
  return [header, body].filter(Boolean).join("\n");
}

export function exportAttendanceCSV(date: string, rows: AttRow[]) {
  const csv = buildAttendanceCSV(date, rows);
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `absensi_${date}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export function exportAttendanceXLSX(date: string, rows: AttRow[]) {
  const wb = XLSX.utils.book_new();
  const data = [["Tanggal", "Nama", "NIM", "Status"], ...rows.map(r => [date, r.name, r.nim, r.status])];
  const ws = XLSX.utils.aoa_to_sheet(data);
  XLSX.utils.book_append_sheet(wb, ws, `Absensi_${date}`);
  XLSX.writeFile(wb, `absensi_${date}.xlsx`);
}

export function exportFinanceXLSX(params: { income: MoneyRow[]; expense: MoneyRow[]; capital: MoneyRow[] }) {
  const { income, expense, capital } = params;
  const wb = XLSX.utils.book_new();
  const toSheet = (rows: MoneyRow[]) =>
    [["Tanggal", "Deskripsi", "Nominal"], ...rows.map(r => [r.date, r.desc, r.amount])];
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(toSheet(income)), "Pemasukan");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(toSheet(expense)), "Pengeluaran");
  XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(toSheet(capital)), "Modal");
  XLSX.writeFile(wb, "keuangan.xlsx");
}

export function exportMinutesPDF(minute: { title: string; date: string; notes: string }) {
  const doc = new jsPDF({ unit: "pt", format: "a4" });
  const margin = 48;
  let y = margin;
  doc.setFont("Times", "normal");

  doc.setFontSize(14);
  doc.setFont(undefined, "bold");
  doc.text("NOTULEN RAPAT", 297, y, { align: "center" });
  y += 24;

  doc.setFontSize(12);
  doc.setFont(undefined, "normal");
  doc.text(`Judul: ${minute.title || ""}`, margin, y); y += 18;
  doc.text(`Tanggal: ${minute.date || ""}`, margin, y); y += 18;

  const maxWidth = 595 - margin * 2;
  const lines = doc.splitTextToSize(minute.notes || "", maxWidth);
  y += 12;
  doc.text(lines, margin, y);

  doc.save(`Notulen_${(minute.title || "").replace(/\s+/g, "_")}.pdf`);
}
