import type { AttRow } from "../types";

type Member = { name: string; nim: string };

const RAW_MEMBERS: Member[] = [
  { name: "Adrian", nim: "24552011294" },
  { name: "Ahmad Farhannudin", nim: "24552011295" },
  { name: "Alif", nim: "24552011299" },
  { name: "Alifa Halim Rasyidin", nim: "24552011300" },
  { name: "Ariq", nim: "24552011302" },
  { name: "Arya", nim: "24552011303" },
  { name: "As'ad Miftahul Haq", nim: "24552011304" },
  { name: "Bintang Dwi R", nim: "24552011305" },
  { name: "Dafa Irsyad", nim: "24552011306" },
  { name: "Dafa Ahmad (Dafsoel)", nim: "24552011307" },
  { name: "Davin Darmawan", nim: "24552011310" },
  { name: "Dhenia", nim: "24552011311" },
  { name: "Ega Silfhia", nim: "24552011313" },
  { name: "Fahridzal Nur Sidiq", nim: "24552011315" },
  { name: "Feisal", nim: "24552011317" },
  { name: "Fitri", nim: "24552011318" },
  { name: "M Dafa Dwi Saputra", nim: "24552011320" },
  { name: "Fajar", nim: "24552011322" },
  { name: "Muhamad Arga", nim: "24552011324" },
  { name: "Desta Putra Nur Fauzan", nim: "24552011136" },
  { name: "Zul Fikri Nugroho", nim: "24552011361" }
];

export const MEMBERS: Member[] = RAW_MEMBERS.slice().sort((a, b) =>
  a.name.localeCompare(b.name, "id", { sensitivity: "base" })
);

export function hydrateRows(saved: AttRow[] = []): AttRow[] {
  const map = new Map(saved.map((r) => [r.nim, r] as const));
  return MEMBERS.map((m) => ({
    name: m.name,
    nim: m.nim,
    status: (map.get(m.nim)?.status || "Tanpa Keterangan") as AttRow["status"]
  }));
}
