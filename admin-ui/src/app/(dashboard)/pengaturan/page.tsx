"use client";

import { useState } from "react";
import { apiFetch, getStoredUser } from "@/lib/api";

export default function PengaturanPage() {
  const [resettingVotes, setResettingVotes] = useState(false);
  const [resettingSystem, setResettingSystem] = useState(false);
  const [updatingPassword, setUpdatingPassword] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passMsg, setPassMsg] = useState<{ text: string; isError: boolean } | null>(null);

  const handleResetVotes = async () => {
    const confirmation = prompt(
      "PERINGATAN: Semua suara voting yang masuk akan dikosongkan secara permanen.\n\nKetik 'RESET SUARA' untuk mengonfirmasi:"
    );

    if (confirmation !== "RESET SUARA") {
      if (confirmation !== null) {
        alert("Konfirmasi tidak sesuai. Pembatalan dilakukan.");
      }
      return;
    }

    setResettingVotes(true);
    const res = await apiFetch("/system/reset-votes", {
      method: "DELETE",
    });
    setResettingVotes(false);

    if (res.success) {
      alert("Berhasil mengosongkan seluruh data suara voting.");
    } else {
      alert(res.message || "Gagal mengosongkan data suara.");
    }
  };

  const handleResetFullDatabase = async () => {
    const confirmation = prompt(
      "PERINGATAN TINGKAT TINGGI: Seluruh data (Kandidat, Akun Pemilih, & Suara) akan DIHAPUS BERSIH.\n\nKetik 'RESET TOTAL' untuk mengonfirmasi:"
    );

    if (confirmation !== "RESET TOTAL") {
      if (confirmation !== null) {
        alert("Konfirmasi tidak sesuai. Pembatalan dilakukan.");
      }
      return;
    }

    setResettingSystem(true);
    const res = await apiFetch("/system/reset", {
      method: "DELETE",
    });
    setResettingSystem(false);

    if (res.success) {
      alert("Database sistem telah berhasil di-reset sepenuhnya.");
      window.location.reload();
    } else {
      alert(res.message || "Gagal melakukan reset database.");
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPassword) {
      setPassMsg({ text: "Password baru tidak boleh kosong", isError: true });
      return;
    }
    if (newPassword !== confirmPassword) {
      setPassMsg({ text: "Konfirmasi password tidak cocok", isError: true });
      return;
    }

    const user = getStoredUser();
    if (!user || !user.id) {
      setPassMsg({ text: "Gagal mendeteksi akun aktif. Silakan login ulang.", isError: true });
      return;
    }

    setUpdatingPassword(true);
    setPassMsg(null);

    const res = await apiFetch(`/users/${user.id}`, {
      method: "PUT",
      body: JSON.stringify({ password: newPassword }),
    });

    setUpdatingPassword(false);

    if (res.success) {
      setPassMsg({ text: "Password akun admin berhasil diperbarui!", isError: false });
      setNewPassword("");
      setConfirmPassword("");
    } else {
      setPassMsg({ text: res.message || "Gagal memperbarui password", isError: true });
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Pengaturan Sistem</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Konfigurasi pemilu dan tindakan sistem tingkat lanjut</p>
      </div>

      {/* Akun & Keamanan */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Ganti Password Admin</h3>

        {passMsg && (
          <div
            className={`mb-4 p-4 rounded-2xl text-sm font-semibold ${
              passMsg.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-600 border border-emerald-200"
            }`}
          >
            {passMsg.text}
          </div>
        )}

        <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Password Baru</label>
            <input
              type="password"
              required
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border-0 bg-gray-50 px-5 py-3.5 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Konfirmasi Password Baru</label>
            <input
              type="password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-2xl border-0 bg-gray-50 px-5 py-3.5 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={updatingPassword}
            className="rounded-2xl bg-indigo-600 px-6 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50"
          >
            {updatingPassword ? "Menyimpan..." : "Perbarui Password"}
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-3xl p-8 shadow-sm border border-red-100">
        <h3 className="text-lg font-bold text-red-600 mb-6 border-b border-red-200 pb-4">Zona Berbahaya (Danger Zone)</h3>

        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-800">Reset Seluruh Data Suara Masuk</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">
                Mengosongkan semua data voting pemilih untuk memulai pemungutan baru. Data kandidat dan akun pemilih tetap aman.
              </p>
            </div>
            <button
              onClick={handleResetVotes}
              disabled={resettingVotes}
              className="whitespace-nowrap rounded-2xl bg-white px-5 py-3 text-sm font-bold text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-50 hover:ring-red-300 transition-colors disabled:opacity-50"
            >
              {resettingVotes ? "Mereset..." : "Reset Suara"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-red-100 pt-6">
            <div>
              <p className="font-bold text-gray-800">Reset Total Database Sistem</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">
                Mengosongkan seluruh tabel suara, kandidat, dan akun pengguna dari database. <strong className="text-red-500">Tindakan ini tidak dapat dibatalkan.</strong>
              </p>
            </div>
            <button
              onClick={handleResetFullDatabase}
              disabled={resettingSystem}
              className="whitespace-nowrap rounded-2xl bg-red-600 px-5 py-3 text-sm font-bold text-white shadow-md hover:bg-red-500 transition-colors disabled:opacity-50"
            >
              {resettingSystem ? "Mereset..." : "Reset Total"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
