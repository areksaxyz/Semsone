// src/features/Beranda.tsx
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { BRAND } from "../data/constants";
import { Button, Card } from "../components/primitives";
import type { FeatureKey, Role } from "../types";

export default function Beranda({
  onNavigate,
  onGoFeature,
  role,
  authed,
}: {
  onNavigate: (k: string) => void;
  onGoFeature: (k: FeatureKey) => void;
  role: Role;
  authed: boolean;
}) {
  const canSeeSek = role === "admin" || role === "sekretaris" || !role;
  const canSeeBen = role === "admin" || role === "bendahara" || !role;
  const canSeeProd = role === "admin" || role === "bendahara" || !role;
  const canSeeProduk = role === "admin" || !role;
  const canSeeKasir = role === "admin" || role === "bendahara" || !role;

  const items = useMemo(
    () =>
      [
        canSeeSek && {
          title: "Sekretaris",
          desc: "Presensi & Notulen rapat",
          icon: "📝",
          key: "sekretaris" as const,
        },
        canSeeBen && {
          title: "Bendahara",
          desc: "Pendapatan, pengeluaran & modal",
          icon: "💰",
          key: "bendahara" as const,
        },
        canSeeProd && {
          title: "Produksi",
          desc: "Stok, belanja & jadwal produksi",
          icon: "🏭",
          key: "produksi" as const,
        },
        canSeeProduk && {
          title: "Menu Produk",
          desc: "Katalog & order",
          icon: "🍱",
          key: "produk" as const,
        },
        canSeeKasir && {
          title: "Kasir",
          desc: "Transaksi & struk",
          icon: "🧾",
          key: "kasir" as const,
        },
      ].filter(Boolean) as {
        title: string;
        desc: string;
        icon: string;
        key: FeatureKey;
      }[],
    [canSeeSek, canSeeBen, canSeeProd, canSeeProduk, canSeeKasir]
  );

  return (
    <>
      {/* HERO */}
      <div
        className="relative overflow-hidden"
        style={{ background: BRAND.primary }}
      >
        <div className="absolute inset-0 -z-10 opacity-20" aria-hidden>
          <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/20 blur-3xl" />
          <div className="absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-white/10 blur-3xl" />
        </div>

        <div className="mx-auto max-w-7xl px-4 py-20">
          <div className="mt-0 flex flex-col items-start justify-between gap-8 sm:flex-row sm:items-center">
            <div>
              {/* Judul */}
              <h1 className="text-5xl font-black leading-tight text-white sm:text-6xl">
                MANAJEMEN SISTEM{" "}
                <span className="underline decoration-white/40">SemsOne</span>
              </h1>

              {/* Tagline */}
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="inline-block mt-5 rounded-full bg-white/10 px-6 py-2 text-lg sm:text-xl text-white/95 ring-1 ring-white/20 backdrop-blur"
              >
                <span className="font-semibold text-white">Small price</span>,{" "}
                <span className="font-semibold text-yellow-300">big taste.</span>
              </motion.div>

              {!authed && (
                <div className="mt-8 flex flex-wrap gap-3">
                  <Button
                    onClick={() => onNavigate("login")}
                    className="shadow-lg shadow-black/10"
                  >
                    Login
                  </Button>
                  <Button
                    variant="ghost"
                    onClick={() =>
                      window.scrollTo({
                        top: document.body.scrollHeight,
                        behavior: "smooth",
                      })
                    }
                  >
                    Lihat Fitur ↓
                  </Button>
                </div>
              )}
            </div>

            {/* Logo kanan */}
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="SemsOne"
                className="h-52 sm:h-72 md:h-96 w-auto object-contain"
              />
            </div>
          </div>
        </div>
      </div>

      {/* GRID FITUR */}
      <div className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((f, i) => (
            <motion.button
              key={f.title}
              onClick={() => onGoFeature(f.key)}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.08 }}
              className="text-left"
            >
              <Card className="group hover:shadow-md transition will-change-transform hover:-translate-y-0.5 hover:scale-[1.01] duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">{f.icon}</div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-slate-600">{f.desc}</p>
                  </div>
                </div>
                <div className="mt-6 h-1 w-16 rounded-full bg-brand group-hover:w-24 transition-all" />
              </Card>
            </motion.button>
          ))}
        </div>
      </div>
    </>
  );
}
