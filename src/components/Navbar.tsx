import React, { useState } from "react";
import { Button, Chip, Logo, SelectEl } from "./primitives";

export default function Navbar({
  onNavigate,
  menu,
  authed,
  onLogout
}: {
  onNavigate: (k: string) => void;
  menu: string;
  authed: boolean;
  onLogout: () => void;
}) {
  const [imgOk, setImgOk] = useState(true);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200/60 bg-white/80 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {imgOk ? (
              <img
                src="/logo.png"
                alt="SemsOne"
                title="SemsOne"
                className="h-14 w-auto drop-shadow-md ring-2 ring-white/90 rounded-md bg-white/90 p-1"
                onError={() => setImgOk(false)}
              />
            ) : (
              <div className="flex items-center gap-2">
                <Logo size={40} />
                <span className="sr-only">SemsOne</span>
              </div>
            )}
            <Chip tone="slate">Manajemen Sistem</Chip>
          </div>

          <nav className="hidden gap-2 sm:flex items-center">
            {!authed && (
              <Button
                variant={menu === "login" ? "solid" : "ghost"}
                onClick={() => onNavigate("login")}
              >
                Login
              </Button>
            )}
            <Button
              variant={menu === "beranda" ? "solid" : "ghost"}
              onClick={() => onNavigate("beranda")}
            >
              Beranda
            </Button>
            {authed && (
              <Button
                variant={menu === "dashboard" ? "solid" : "ghost"}
                onClick={() => onNavigate("dashboard")}
              >
                Dashboard
              </Button>
            )}
            {authed && (
              <Button variant="ghost" onClick={onLogout}>
                Logout
              </Button>
            )}
          </nav>

          <div className="sm:hidden">
            <SelectEl
              aria-label="Navigasi"
              value={menu}
              onChange={(e) => onNavigate((e.target as HTMLSelectElement).value)}
            >
              {!authed && <option value="login">Login</option>}
              <option value="beranda">Beranda</option>
              {authed && <option value="dashboard">Dashboard</option>}
            </SelectEl>
          </div>
        </div>
      </div>
    </header>
  );
}
