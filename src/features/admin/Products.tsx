import React, { useMemo, useState } from "react";
import { Card, Input, SelectEl, Button, rupiah, Chip } from "../../components/primitives";
import { PRODUCTS as DEFAULTS } from "../../data/products";
import { storage } from "../../utils/storage";
import type { CartItem } from "../../types";

type CustomProduct = {
  id: string;
  name: string;
  category: "Makanan" | "Minuman";
  image?: string;  // data URL hasil upload
  price?: number;
  desc?: string;
};

const CUSTOM_KEY = "products_custom";

function readCustom(): CustomProduct[] { return storage.get<CustomProduct[]>(CUSTOM_KEY, []); }
function writeCustom(list: CustomProduct[]) { storage.set(CUSTOM_KEY, list); }

export default function Products({ onGoKasir }: { onGoKasir: () => void }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<"ALL" | "Makanan" | "Minuman">("ALL");
  const [orders, setOrders] = useState<Record<string, number>>({});
  const [customs, setCustoms] = useState<CustomProduct[]>(readCustom());
  const [openAdd, setOpenAdd] = useState(false);

  // form tambah produk
  const [newP, setNewP] = useState<CustomProduct>({
    id: "",
    name: "",
    category: "Makanan",
    price: undefined,
    image: "",
    desc: ""
  });

  const all = useMemo(() => {
    // gabungkan default + custom
    return [
      ...DEFAULTS,
      ...customs.map(c => ({ ...c })) // cast ke bentuk Product sederhana (tanpa varian)
    ];
  }, [customs]);

  const categories: Array<"ALL" | "Makanan" | "Minuman"> = ["ALL", "Makanan", "Minuman"];

  const filtered = useMemo(() => {
    return all.filter(p => {
      const okCat = cat === "ALL" ? true : p.category === cat;
      const query = q.trim().toLowerCase();
      const okSearch =
        !query ||
        p.name.toLowerCase().includes(query) ||
        (p.desc?.toLowerCase().includes(query) ?? false) ||
        (Array.isArray((p as any).variants) && (p as any).variants?.some((v: any) => v.name.toLowerCase().includes(query)));
      return okCat && okSearch;
    });
  }, [q, cat, all]);

  function pushToCart(items: CartItem[]) {
    const existing = storage.get<CartItem[]>("cart", []);
    const merged = [...existing];
    for (const it of items) {
      const idx = merged.findIndex(m => m.id === it.id);
      if (idx >= 0) merged[idx] = { ...merged[idx], qty: merged[idx].qty + it.qty };
      else merged.push(it);
    }
    storage.set("cart", merged);
  }

  function orderProduct(p: any) {
    const qty = Math.max(1, orders[p.id] || 1);
    const items: CartItem[] = [];

    if (p.variants?.length) {
      // default: ambil varian pertama (bisa dikembangkan dropdown varian)
      const v = p.variants[0];
      items.push({ id: v.id, name: `${p.name} - ${v.name}`, price: v.price, qty });
    } else if (typeof p.price === "number") {
      items.push({ id: p.id, name: p.name, price: p.price, qty });
    }

    if (items.length) {
      pushToCart(items);
      onGoKasir();
    }
  }

  async function handlePickImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setNewP(prev => ({ ...prev, image: String(reader.result || "") }));
    reader.readAsDataURL(file); // simpan sebagai data URL (aman dipreview & disimpan di localStorage)
  }

  function addCustom() {
    if (!newP.name || (!newP.price && newP.price !== 0)) return;
    const prod: CustomProduct = {
      ...newP,
      id: `custom-${Date.now()}`
    };
    const list = [prod, ...customs];
    writeCustom(list);
    setCustoms(list);
    setOpenAdd(false);
    setNewP({ id: "", name: "", category: "Makanan", price: undefined, image: "", desc: "" });
  }

  return (
    <section className="zoom-surface">
      {/* Headbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between text-white">
        <div>
          <h3 className="text-2xl font-black leading-tight">Menu Produk</h3>
          <div className="mt-1 flex gap-2">
            <Chip tone="primary">Katalog</Chip>
            <Chip tone="slate">Tambah Produk</Chip>
          </div>
        </div>
        <div className="flex w-full gap-2 sm:w-auto">
          <Input placeholder="Cari produk / varian…" value={q} onChange={(e) => setQ((e.target as HTMLInputElement).value)} />
          <SelectEl value={cat} onChange={(e) => setCat((e.target as HTMLSelectElement).value as any)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </SelectEl>
          <Button variant="slate" onClick={() => setOpenAdd(true)}>+ Tambah Produk</Button>
        </div>
      </div>

      {/* Form tambah (inline sederhana) */}
      {openAdd && (
        <Card className="mb-4 bg-white text-slate-900">
          <div className="grid gap-3 sm:grid-cols-5">
            <div className="sm:col-span-2">
              <div className="text-sm font-medium text-slate-700 mb-1">Foto (galeri)</div>
              <input type="file" accept="image/*" onChange={handlePickImage} />
              {newP.image && <img src={newP.image} alt="preview" className="mt-2 h-24 w-auto rounded-xl object-cover" />}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Nama</div>
              <Input value={newP.name} onChange={(e)=>setNewP(p=>({...p, name:(e.target as HTMLInputElement).value}))} placeholder="Nama produk" />
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Kategori</div>
              <SelectEl value={newP.category} onChange={(e)=>setNewP(p=>({...p, category:(e.target as HTMLSelectElement).value as any}))}>
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
              </SelectEl>
            </div>
            <div>
              <div className="text-sm font-medium text-slate-700 mb-1">Harga (Rp)</div>
              <Input type="number" inputMode="decimal" value={newP.price ?? ""} onChange={(e)=>setNewP(p=>({...p, price:Number((e.target as HTMLInputElement).value)}))} placeholder="0" />
            </div>
          </div>
          <div className="mt-3 flex gap-2">
            <Button onClick={addCustom}>Simpan</Button>
            <Button variant="ghost" onClick={()=>{ setOpenAdd(false); setNewP({ id:"", name:"", category:"Makanan", price:undefined, image:"", desc:"" }); }}>Batal</Button>
          </div>
        </Card>
      )}

      {/* Grid kartu */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <Card
            key={p.id}
            className="product-card group overflow-hidden bg-white text-slate-900 ring-1 ring-black/5 hover:shadow-lg transition
                       will-change-transform hover:-translate-y-0.5 hover:scale-[1.02] duration-300"
          >
            <div className="aspect-[4/3] w-full overflow-hidden rounded-2xl bg-slate-100">
              <img
                src={p.image || "/images/placeholder.jpg"}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110 cursor-zoom-in"
                onError={(e) => { (e.currentTarget as HTMLImageElement).src = "/images/placeholder.jpg"; }}
              />
            </div>

            <div className="mt-3">
              <h4 className="text-lg font-extrabold tracking-tight">{p.name}</h4>

              {Array.isArray((p as any).variants) && (p as any).variants.length ? (
                <ul className="mt-2 space-y-1">
                  {(p as any).variants.map((v: any) => (
                    <li key={v.id} className="flex items-center justify-between text-sm">
                      <span className="text-slate-700">{v.name}</span>
                      <span className="font-semibold text-slate-900">{rupiah(v.price)}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 font-semibold text-slate-900">
                  {typeof (p as any).price === "number" ? rupiah((p as any).price) : "-"}
                </p>
              )}

              {p.desc && <p className="mt-2 text-sm text-slate-600">{p.desc}</p>}

              <div className="mt-4 flex items-center gap-2">
                <Input
                  type="number"
                  min={1}
                  value={orders[p.id] || 1}
                  onChange={(e) => setOrders(prev => ({ ...prev, [p.id]: Number((e.target as HTMLInputElement).value) }))}
                  className="w-24"
                />
                <Button onClick={() => orderProduct(p)}>Order</Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card className="mt-4 bg-white text-slate-700">Tidak ada produk yang cocok dengan filter.</Card>
      )}
    </section>
  );
}
