import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Beranda from "../pages/Beranda";
import Login from "../pages/Login";
import IncomeExpense from "../features/bendahara/IncomeExpense";
import AttendanceBook from "../features/sekretaris/AttendanceBook";
import Minutes from "../features/sekretaris/Minutes";
import PurchaseList from "../features/produksi/PurchaseList";
import ProductionSchedule from "../features/produksi/ProductionSchedule";
import Stock from "../features/produksi/Stock";
import Products from "../features/admin/Products";
import Cashier from "../features/kasir/Cashier"; // <— Kasir
import type { FeatureKey, Role } from "../types";
import { storage } from "../utils/storage";
import { motion, AnimatePresence } from "framer-motion";

export default function Router() {
  const [menu, setMenu] = useState("login");
  const [role, setRole] = useState<Role>(storage.get("role", null));
  const [desiredTab, setDesiredTab] = useState<FeatureKey | undefined>(undefined);

  useEffect(() => storage.set("role", role), [role]);
  useEffect(() => { if (!role && menu === "dashboard") setMenu("login"); }, [role, menu]);

  function goToFeature(tab: FeatureKey) {
    if (role) { setMenu("dashboard"); setDesiredTab(tab); }
    else { setDesiredTab(tab); setMenu("login"); }
  }

  const canSeeSek = role === "admin" || role === "sekretaris";
  const canSeeBen = role === "admin" || role === "bendahara";
  const canSeeProd = role === "admin" || role === "bendahara";
  const canSeeProduk = role === "admin";
  const canSeeKasir = role === "admin" || role === "bendahara";

  const defaultTab: FeatureKey =
    role === "sekretaris" ? "sekretaris" : role === "bendahara" ? "bendahara" : "sekretaris";
  const [tab, setTab] = useState<FeatureKey>(defaultTab);

  useEffect(() => {
    if (!desiredTab) return;
    if (desiredTab === "sekretaris" && canSeeSek) setTab("sekretaris");
    else if (desiredTab === "bendahara" && canSeeBen) setTab("bendahara");
    else if (desiredTab === "produksi" && canSeeProd) setTab("produksi");
    else if (desiredTab === "produk" && canSeeProduk) setTab("produk");
    else if (desiredTab === "kasir" && canSeeKasir) setTab("kasir");
  }, [desiredTab, canSeeSek, canSeeBen, canSeeProd, canSeeProduk, canSeeKasir]);

  return (
    <div className="min-h-screen bg-[#1960B0]" style={{ fontFamily: "Inter, ui-sans-serif, system-ui" }}>
      <Navbar onNavigate={setMenu} menu={menu} authed={!!role} onLogout={() => setRole(null)} />

      {menu === "beranda" && (
        <Beranda onNavigate={setMenu} onGoFeature={goToFeature} role={role} authed={!!role} />
      )}

      {menu === "login" && (
        <Login onSuccess={(r) => { setRole(r); setMenu("beranda"); }} />
      )}

      {menu === "dashboard" && role && (
        <motion.section
          key="dashboard"
          className="mx-auto max-w-7xl px-4 py-10"
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35 }}
        >
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between text-white">
            <div>
              <h2 className="text-2xl font-black">Dashboard Operasional</h2>
              <p>Peran: <b>{role}</b></p>
            </div>
            <div className="flex flex-wrap gap-2">
              {canSeeSek && (
                <button
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    tab === "sekretaris"
                      ? "bg-white text-[#1960B0]"
                      : "bg-transparent ring-1 ring-white text-white hover:bg-white/10"
                  }`}
                  onClick={() => setTab("sekretaris")}
                >Sekretaris</button>
              )}
              {canSeeBen && (
                <button
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    tab === "bendahara"
                      ? "bg-white text-[#1960B0]"
                      : "bg-transparent ring-1 ring-white text-white hover:bg-white/10"
                  }`}
                  onClick={() => setTab("bendahara")}
                >Bendahara</button>
              )}
              {canSeeProd && (
                <button
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    tab === "produksi"
                      ? "bg-white text-[#1960B0]"
                      : "bg-transparent ring-1 ring-white text-white hover:bg-white/10"
                  }`}
                  onClick={() => setTab("produksi")}
                >Produksi</button>
              )}
              {canSeeProduk && (
                <button
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    tab === "produk"
                      ? "bg-white text-[#1960B0]"
                      : "bg-transparent ring-1 ring-white text-white hover:bg-white/10"
                  }`}
                  onClick={() => setTab("produk")}
                >Menu Produk</button>
              )}
              {canSeeKasir && (
                <button
                  className={`rounded-2xl px-4 py-2 text-sm font-semibold ${
                    tab === "kasir"
                      ? "bg-white text-[#1960B0]"
                      : "bg-transparent ring-1 ring-white text-white hover:bg-white/10"
                  }`}
                  onClick={() => setTab("kasir")}
                >Kasir</button>
              )}
            </div>
          </div>

          {/* KONTEN */}
          <AnimatePresence mode="wait">
            {tab === "sekretaris" && canSeeSek && (
              <motion.div key="sekretaris" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <AttendanceBook />
                <div className="h-6" />
                <Minutes />
              </motion.div>
            )}
            {tab === "bendahara" && canSeeBen && (
              <motion.div key="bendahara" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <IncomeExpense />
              </motion.div>
            )}
            {tab === "produksi" && canSeeProd && (
              <motion.div key="produksi" className="grid gap-6 lg:grid-cols-2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <PurchaseList />
                <ProductionSchedule />
                <Stock />
              </motion.div>
            )}
            {tab === "produk" && canSeeProduk && (
              <motion.div key="produk" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Products onGoKasir={() => setTab("kasir")} />
              </motion.div>
            )}
            {tab === "kasir" && canSeeKasir && (
              <motion.div key="kasir" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <Cashier />
              </motion.div>
            )}
          </AnimatePresence>

          {/* FOOTER */}
          <footer className="mt-12 border-t border-white/30 text-white">
            <div className="mx-auto max-w-7xl px-4 py-8 text-center">
              <p className="text-base font-bold">SemsOne 2025</p>
            </div>
          </footer>
        </motion.section>
      )}
    </div>
  );
}
