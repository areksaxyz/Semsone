export type Role = "admin" | "sekretaris" | "bendahara" | null;

export type AttStatus = "Hadir" | "Izin" | "Sakit" | "Tanpa Keterangan";
export type AttRow = { name: string; nim: string; status: AttStatus };

export type MoneyRow = { id: string; date: string; desc: string; amount: number };

export type FeatureKey = "sekretaris" | "bendahara" | "produksi";
