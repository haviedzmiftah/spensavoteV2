"use client";

import { useRouter } from "next/navigation";
import { clearVoterSession } from "@/lib/api";

export default function VoteSuccessPage() {
  const router = useRouter();

  const handleLogout = () => {
    clearVoterSession();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl rounded-[32px] border border-emerald-200 bg-white p-8 text-center shadow-sm sm:p-10">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl shadow-inner shadow-emerald-200">
          ✓
        </div>

        <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-emerald-600">Terima Kasih</p>
        <h1 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Suara Anda Telah Tersimpan</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Proses pemilihan Anda selesai dan pilihan sudah kami catat secara aman. Anda dapat keluar dari sesi voting sekarang.
        </p>

        <div className="mt-8 rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm font-medium text-emerald-700">
          Status: suara berhasil dikirim dan tercatat dalam sistem.
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="mt-8 inline-flex items-center justify-center rounded-full bg-slate-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-slate-700"
        >
          Logout & Kembali ke Login
        </button>
      </div>
    </div>
  );
}
