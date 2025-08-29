import React, { useEffect, useMemo, useState } from "react";
import { Button, Card, Field, Input, rupiah } from "../../components/primitives";
import Modal from "../../components/Modal";
import { storage } from "../../utils/storage";
import type { CartItem } from "../../types";

const SHOP = {
  name: "SemsOne Shop",
  address1: "Jl. Soekarno-Hatta No.378",
  address2: "Kb. Lega, Kec. Bojongloa Kidul, Kota Bandung, Jawa Barat 40235",
  phone: "+62895-3852-49636",
};

// helper angka
function toNumber(s: string): number {
  if (!s) return 0;
  const cleaned = s.replace(/[^\d.,]/g, "").replace(/\./g, "").replace(",", ".");
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : 0;
}
const makeId = (d = new Date()) =>
  `${d.getFullYear()}${(d.getMonth() + 1 + "").padStart(2, "0")}${(d.getDate() + "").padStart(2, "0")}${d.getHours().toString().padStart(2, "0")}${d.getMinutes().toString().padStart(2, "0")}${d.getSeconds().toString().padStart(2, "0")}${d.getMilliseconds().toString().padStart(3, "0")}`;

/** ===== Render struk → Canvas → unduh PNG (stabil) ===== */
function drawReceiptToCanvas(data: {
  shop: { name: string; address1: string; address2: string; phone: string; };
  receiptId: string;
  date: string;
  time: string;
  buyer: string;
  items: { name: string; qty: number; price: number; }[];
  totalQty: number;
  total: number;
  pay: number;
  change: number;
  logoSrc?: string;
}) {
  const pad = 16;
  const width = 360;
  const lineH = 18;

  const baseLines = 18;
  const itemLines = data.items.length * 2;
  const height = pad*2 + (baseLines + itemLines) * lineH + 24;

  const canvas = document.createElement("canvas");
  canvas.width = width + pad*2;
  canvas.height = height;
  const ctx = canvas.getContext("2d")!;

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0,0,canvas.width,canvas.height);

  const rp = (n: number) =>
    new Intl.NumberFormat("id-ID",{style:"currency",currency:"IDR",minimumFractionDigits:2,maximumFractionDigits:2})
    .format(n).replace("IDR","Rp.");

  let y = pad;

  const drawHeaderAndBody = () => {
    ctx.textAlign = "center";
    ctx.fillStyle = "#0f172a";
    ctx.font = "bold 18px ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial";
    ctx.fillText(data.shop.name, canvas.width/2, y); y += lineH;

    ctx.font = "12px ui-sans-serif, system-ui";
    ctx.fillStyle = "#475569";
    ctx.fillText(data.shop.address1, canvas.width/2, y); y += lineH;
    ctx.fillText(data.shop.address2, canvas.width/2, y); y += lineH;
    ctx.fillText(`Telp ${data.shop.phone}`, canvas.width/2, y); y += lineH;

    ctx.strokeStyle = "#e5e7eb";
    ctx.strokeRect(canvas.width/2 - 90, y-12, 180, 20);
    ctx.fillStyle = "#0f172a";
    ctx.font = "12px ui-monospace, SFMono-Regular, Menlo, monospace";
    ctx.fillText(data.receiptId, canvas.width/2, y+3); y += lineH + 6;

    ctx.strokeStyle = "#cbd5e1"; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(canvas.width-pad, y); ctx.stroke(); ctx.setLineDash([]); y += 10;

    ctx.textAlign = "left";
    ctx.font = "12px ui-sans-serif, system-ui"; ctx.fillStyle = "#0f172a";
    drawKV("Tanggal", data.date);
    drawKV("Waktu", data.time);

    drawKV("Pembeli", data.buyer || "-");
    drawKV("Kasir", "SemsOne");

    ctx.fillStyle = "#1960B0";
    ctx.fillRect(pad, y+4, canvas.width-pad*2, 4); y += lineH;

    ctx.fillStyle = "#0f172a";
    for (let i=0;i<data.items.length;i++) {
      const it = data.items[i];
      ctx.font = "bold 12px ui-sans-serif, system-ui";
      ctx.textAlign = "left"; ctx.fillText(`${i+1}. ${it.name}`, pad, y);
      ctx.textAlign = "right"; ctx.fillText(rp(it.price * it.qty), canvas.width-pad, y);
      y += lineH;

      ctx.font = "12px ui-sans-serif, system-ui";
      ctx.fillStyle = "#64748b";
      ctx.textAlign = "left"; ctx.fillText(`${it.qty} × ${rp(it.price)}`, pad, y);
      ctx.textAlign = "right"; ctx.fillText("", canvas.width-pad, y);
      y += lineH;

      ctx.fillStyle = "#0f172a";
    }

    ctx.strokeStyle = "#cbd5e1"; ctx.setLineDash([4,4]);
    ctx.beginPath(); ctx.moveTo(pad, y); ctx.lineTo(canvas.width-pad, y); ctx.stroke(); ctx.setLineDash([]); y += 10;

    ctx.font = "12px ui-sans-serif, system-ui";
    drawKV("Total QTY", String(data.totalQty));
    drawKV("Sub Total", rp(data.total));
    ctx.font = "bold 14px ui-sans-serif, system-ui";
    drawKV("TOTAL", rp(data.total));
    ctx.font = "12px ui-sans-serif, system-ui";
    drawKV("Bayar", rp(data.pay));
    drawKV("Kembali", rp(data.change));

    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url; a.download = `Struk_${data.receiptId}.png`;
    document.body.appendChild(a); a.click(); a.remove();
  };

  function drawKV(k: string, v: string) {
    ctx.textAlign = "left"; ctx.fillText(k, pad, y);
    ctx.textAlign = "right"; ctx.fillText(v, canvas.width-pad, y);
    y += lineH;
  }

  if (data.logoSrc) {
    const img = new Image();
    img.onload = () => {
      const w = 56, h = 56;
      ctx.drawImage(img, (canvas.width - w)/2, pad-2, w, h);
      y += h - 8;
      drawHeaderAndBody();
    };
    img.src = data.logoSrc;
  } else {
    drawHeaderAndBody();
  }
}

export default function Cashier() {
  const [buyer, setBuyer] = useState("");
  const [cart, setCart] = useState<CartItem[]>(storage.get("cart", []));
  const [payStr, setPayStr] = useState("");
  const [openPreview, setOpenPreview] = useState(false);

  useEffect(() => storage.set("cart", cart), [cart]);

  const total = useMemo(() => cart.reduce((a, b) => a + b.price * b.qty, 0), [cart]);
  const totalQty = useMemo(() => cart.reduce((a, b) => a + b.qty, 0), [cart]);
  const pay = toNumber(payStr);
  const change = Math.max(0, pay - total);
  const canPreview = cart.length > 0 && total > 0 && payStr.trim().length > 0;

  function updateQty(id: string, q: number) {
    setCart((p) => p.map((it) => (it.id === id ? { ...it, qty: Math.max(1, q) } : it)));
  }
  function removeItem(id: string) {
    setCart((p) => p.filter((it) => it.id !== id));
  }
  function clearCart() {
    setCart([]);
    storage.set("cart", []);
  }

  function printFromPreview() {
    const node = document.getElementById("receipt-preview-paper");
    if (!node) return;
    const w = window.open("", "_blank", "noopener,noreferrer");
    if (!w) return;
    const css = `
      <style>
        :root{ --ink:#0f172a; --muted:#6b7280; --line:#e5e7eb; --brand:#1960B0; }
        *{ box-sizing: border-box; }
        body{ margin:0; font-family: ui-sans-serif, system-ui, Segoe UI, Roboto, Helvetica, Arial; color: var(--ink); }
        .print-wrap{ padding:16px; }
        .paper{ width: 360px; margin: 0 auto; background:#fff; border:1px solid var(--line); border-radius: 12px; padding: 16px; }
        .head{ text-align:center; }
        .logo{ height:42px; margin:0 auto 8px; display:block; }
        .name{ font-weight:800; font-size:18px; }
        .addr{ color:var(--muted); line-height:1.2; margin-top:2px; }
        .pin{ display:inline-block; border:1px dashed var(--line); border-radius:8px; padding:6px 10px; margin-top:6px; font-family:ui-monospace, SFMono-Regular, Menlo, monospace; }
        table{ width:100%; border-collapse: collapse; font-size:12px; }
        th, td{ padding:6px 0; }
        th{ text-align:left; color:#6b7280; font-weight:600; }
        td:last-child, th:last-child{ text-align:right; }
        .sum .line{ display:flex; justify-content:space-between; padding:4px 0; font-size:13px; }
        .total{ font-weight:900; font-size:16px; }
        @media print{ .paper{ border:none; } }
      </style>
    `;
    w.document.write(
      `<!doctype html><html><head><meta charset="utf-8"/><meta name="viewport" content="width=device-width, initial-scale=1"/>${css}</head><body><div class="print-wrap">${node.outerHTML}</div><script>window.print(); setTimeout(()=>window.close(), 400);</script></body></html>`
    );
    w.document.close();
  }

  function downloadPng() {
    const receiptId = makeId();
    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID");
    const timeStr = now.toLocaleTimeString("id-ID", { hour12: false });

    drawReceiptToCanvas({
      shop: { name: SHOP.name, address1: SHOP.address1, address2: SHOP.address2, phone: SHOP.phone },
      receiptId,
      date: dateStr,
      time: timeStr,
      buyer,
      items: cart.map(it => ({ name: it.name, qty: it.qty, price: it.price })),
      totalQty,
      total,
      pay,
      change,
      logoSrc: "/logo.png"
    });
  }

  const receiptId = makeId();
  const now = new Date();
  const dateStr = now.toLocaleDateString("id-ID");
  const timeStr = now.toLocaleTimeString("id-ID", { hour12: false });

  return (
    <div className="grid gap-6">
      <Card>
        <h3 className="text-lg font-bold">Kasir</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          <Field label="Nama Pembeli">
            <Input value={buyer} onChange={(e) => setBuyer((e.target as HTMLInputElement).value)} placeholder="Nama" />
          </Field>
          <Field label="Total">
            <Input value={rupiah(total)} readOnly />
          </Field>
          <Field label="Uang Pembeli">
            <input
              inputMode="decimal"
              placeholder="0"
              value={payStr}
              onChange={(e) => setPayStr((e.target as HTMLInputElement).value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#1960B0]/30 focus:border-[#1960B0] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
            />
          </Field>
        </div>
      </Card>

      <Card>
        <h4 className="text-base font-bold">Daftar Pesanan</h4>
        <div className="mt-3 overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-2">Item</th>
                <th className="text-center">Qty</th>
                <th className="text-right">Harga</th>
                <th className="text-right">Subtotal</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="text-slate-800">
              {cart.map((it) => (
                <tr key={it.id} className="border-t border-slate-100">
                  <td className="py-2">{it.name}</td>
                  <td className="text-center">
                    <input
                      inputMode="numeric"
                      className="w-20 rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none bg-white text-slate-900 placeholder-slate-400 focus:ring-2 focus:ring-[#1960B0]/30 focus:border-[#1960B0] [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                      value={String(it.qty)}
                      onChange={(e) => updateQty(it.id, Math.max(1, toNumber((e.target as HTMLInputElement).value)))}
                    />
                  </td>
                  <td className="text-right">{rupiah(it.price)}</td>
                  <td className="text-right">{rupiah(it.price * it.qty)}</td>
                  <td className="text-right">
                    <Button variant="ghost" onClick={() => removeItem(it.id)}>Hapus</Button>
                  </td>
                </tr>
              ))}
              {cart.length === 0 && (
                <tr>
                  <td colSpan={5} className="py-3 text-slate-500">Keranjang kosong.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm text-slate-700">
            <div> Total QTY: <b>{totalQty}</b></div>
            <div> Total: <b>{rupiah(total)}</b></div>
            <div> Kembalian: <b className={change >= 0 ? "text-emerald-600" : "text-rose-600"}>{rupiah(change)}</b></div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={clearCart}>Kosongkan</Button>
            <Button disabled={!canPreview} onClick={() => setOpenPreview(true)}>Preview Struk</Button>
          </div>
        </div>
      </Card>

      {/* Modal preview struk */}
      <Modal
        open={openPreview}
        onClose={() => setOpenPreview(false)}
        title="Pratinjau Struk"
        footer={
          <>
            <Button variant="ghost" onClick={() => setOpenPreview(false)}>Tutup</Button>
            <Button onClick={downloadPng}>Download PNG</Button>
            <Button onClick={printFromPreview} disabled={pay < total}>Cetak</Button>
          </>
        }
      >
        <div className="flex justify-center">
          <div id="receipt-preview-paper" className="paper w-[360px] rounded-2xl border border-slate-200 shadow-sm p-4 bg-white">
            <div className="head text-center">
              <img src="/logo.png" alt="logo" className="logo mx-auto mb-2 h-10 w-auto" />
              <div className="name text-lg font-extrabold text-slate-900">{SHOP.name}</div>
              <div className="addr text-xs text-slate-600">{SHOP.address1}</div>
              <div className="addr text-xs text-slate-600">{SHOP.address2}</div>
              <div className="text-xs text-slate-600">Telp {SHOP.phone}</div>
              <div className="mt-2 inline-block rounded-lg border border-dashed border-slate-300 px-2 py-1 text-[11px] font-mono text-slate-700">
                {receiptId}
              </div>
            </div>

            <div className="my-3 border-t border-dashed border-slate-300" />

            {/* Tanggal & Waktu */}
            <div className="space-y-1 text-[12px] text-slate-800">
              <div className="flex items-center justify-between"><span>Tanggal</span><span>{dateStr}</span></div>
              <div className="flex items-center justify-between"><span>Waktu</span><span>{timeStr}</span></div>
            </div>

            {/* Pembeli & Kasir */}
            <div className="mt-3 space-y-1 text-[12px] text-slate-800">
              <div className="flex items-center justify-between"><span>Pembeli</span><span>{buyer || "-"}</span></div>
              <div className="flex items-center justify-between"><span>Kasir</span><span>SemsOne</span></div>
            </div>

            <div className="my-3 h-1 rounded-full bg-[#1960B0]" />

            <table className="w-full text-[12px]">
              <thead>
                <tr className="text-slate-500">
                  <th className="py-1 text-left">Produk</th>
                  <th className="py-1 text-center">Qty</th>
                  <th className="py-1 text-right">Harga</th>
                  <th className="py-1 text-right">Sub</th>
                </tr>
              </thead>
              <tbody className="text-slate-900">
                {cart.map((it, i) => (
                  <tr key={i} className="border-t border-slate-100">
                    <td className="py-1 pr-1">{it.name}</td>
                    <td className="py-1 text-center">{it.qty}</td>
                    <td className="py-1 text-right">{rupiah(it.price)}</td>
                    <td className="py-1 text-right">{rupiah(it.price * it.qty)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="my-3 border-t border-dashed border-slate-300" />

            <div className="space-y-1 text-[13px]">
              <div className="flex items-center justify-between"><span className="text-slate-600">Total QTY</span><span className="font-semibold">{totalQty}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-600">Sub Total</span><span className="font-semibold">{rupiah(total)}</span></div>
              <div className="flex items-center justify-between"><span className="font-bold text-slate-900">TOTAL</span><span className="font-extrabold text-slate-900">{rupiah(total)}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-600">Bayar</span><span className="font-semibold">{rupiah(pay)}</span></div>
              <div className="flex items-center justify-between"><span className="text-slate-600">Kembali</span><span className="font-semibold">{rupiah(change)}</span></div>
            </div>

            <div className="mt-3 text-center text-[12px] text-slate-600">
              Terima kasih telah berbelanja • SemsOne
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
}
