// src/data/products.ts
export type ProductVariant = {
  id: string;
  name: string;   // misal: "Ayam" / "Udang"
  price: number;
  desc?: string;
};

export type Product = {
  id: string;     // gunakan untuk "page" dimsum juga
  name: string;
  category: "Makanan" | "Minuman";
  image?: string;
  price?: number;
  desc?: string;
  variants?: ProductVariant[];
};

export const PRODUCTS: Product[] = [
  // PAGE 1 — Dimsum Original
  {
    id: "dimsum-ori",
    name: "Dimsum Original",
    category: "Makanan",
    image: "/images/dimsum1.jpg",
    desc: "Dimsum kukus klasik dengan pilihan rasa.",
    variants: [
      { id: "dimsum-ori-ayam",  name: "Ayam",  price: 3000 },
      { id: "dimsum-ori-udang", name: "Udang", price: 3000 }
    ]
  },

  // PAGE 2 — Dimsum Mentai
  {
    id: "dimsum-mentai",
    name: "Dimsum Mentai",
    category: "Makanan",
    image: "/images/dimsum2.jpg",
    desc: "Dimsum dengan saus mentai gurih & creamy.",
    variants: [
      { id: "dimsum-mentai-ayam",  name: "Ayam",  price: 3500 },
      { id: "dimsum-mentai-udang", name: "Udang", price: 3500 }
    ]
  },

  // Cireng
  {
    id: "cireng",
    name: "cireng",
    category: "Makanan",
    image: "/images/cireng.jpg",
    desc: "Cireng goreng, luar renyah dalam kenyal.",
    variants: [
      { id: "cireng-ori",   name: "Original", price: 3000 },
      { id: "cireng-pedas", name: "Pedas",    price: 3000 }
    ]
  },

  // Pastry
  {
    id: "pastry",
    name: "Pastry",
    category: "Makanan",
    image: "/images/pastry.jpg",
    desc: "Pastry butter flaky fresh baked.",
    variants: [
      { id: "pastry-manis", name: "Manis", price: 8000 },
      { id: "pastry-asin",  name: "Asin",  price: 10000 }
    ]
  },

  // Kopi
  {
    id: "kopi",
    name: "Kopi Gula Aren",
    category: "Minuman",
    image: "/images/kopi.jpg",
    desc: "Racikan kopi dari biji pilihan.",
    price: 8000
  },

  // Brownies
  {
    id: "brownies",
    name: "Brownies",
    category: "Makanan",
    image: "/images/brownies.jpg",
    desc: "Brownies cokelat fudgy premium.",
    variants: [
      { id: "brownies-pcs",  name: "Per pcs", price: 3000 },
      { id: "brownies-box",  name: "1 Box",   price: 40000 }
    ]
  }
];
