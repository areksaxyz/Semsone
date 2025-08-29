import React, { useState } from "react";
import { Button, Field, SelectEl } from "../components/primitives";
import type { Role } from "../types";

export default function Login({ onSuccess }: { onSuccess: (role: Exclude<Role, null>) => void }) {
  const [role, setRole] = useState<Exclude<Role, null>>("admin");
  return (
    <div className="mx-auto grid min-h-[70vh] max-w-md place-items-center px-4">
      <form onSubmit={(e) => { e.preventDefault(); onSuccess(role); }} className="w-full rounded-3xl bg-white p-6 shadow-sm ring-1 ring-black/5">
        <div className="mb-5 text-center">
          <div className="mx-auto mb-2 h-10 w-10 rounded-2xl brand-gradient grid place-items-center text-white font-black">S</div>
          <h2 className="text-xl font-black text-slate-900">Masuk</h2>
          <p className="text-sm text-slate-600">Pilih peran untuk masuk.</p>
        </div>
        <div className="grid gap-3">
          <Field label="Peran">
            <SelectEl value={role} onChange={(e) => setRole((e.target as HTMLSelectElement).value as any)}>
              <option value="admin">Admin</option>
              <option value="sekretaris">Sekretaris</option>
              <option value="bendahara">Bendahara</option>
            </SelectEl>
          </Field>
          <Button type="submit" className="mt-1">Masuk</Button>
        </div>
      </form>
    </div>
  );
}
