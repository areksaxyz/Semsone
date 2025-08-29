// src/types.ts
export type Role = "admin" | "sekretaris" | "bendahara" | null;

export type FeatureKey = "sekretaris" | "bendahara" | "produksi" | "produk" | "kasir";

export type MoneyRow = {
  id: string;
  date: string;
  desc: string;
  amount: number;
};

export type CartItem = {
  id: string;          // id produk atau varian
  name: string;        // nama produk/varian
  price: number;       // harga satuan
  qty: number;         // jumlah pcs
};
