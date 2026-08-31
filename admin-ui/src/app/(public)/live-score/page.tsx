"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface CandidateCount {
  candidateId: number;
  candidateNumber: number;
  chairmanName: string;
  viceChairmanName: string;
  photoUrl: string | null;
  totalVotes: number;
}

export default function PublicLiveScorePage() {
  const [candidates, setCandidates] = useState<CandidateCount[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string>("");

  const colorThemes = [
    { bar: "from-blue-600 to-indigo-600", text: "text-indigo-600", bg: "bg-indigo-50", ring: "ring-indigo-100" },
    { bar: "from-purple-600 to-pink-600", text: "text-purple-600", bg: "bg-purple-50", ring: "ring-purple-100" },
    { bar: "from-emerald-600 to-teal-600", text: "text-emerald-600", bg: "bg-emerald-50", ring: "ring-emerald-100" },
    { bar: "from-amber-600 to-orange-600", text: "text-amber-600", bg: "bg-amber-50", ring: "ring-amber-100" },
  ];

  const loadData = async () => {
    const res = await apiFetch("/votes/count", { requiresAuth: false });
    if (res.success && Array.isArray(res.data)) {
      const sorted = [...res.data].sort((a, b) => a.candidateNumber - b.candidateNumber);
      setCandidates(sorted);
      setLastUpdated(new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // 5s realtime polling
    return () => clearInterval(interval);
  }, []);

  const totalVotesCount = candidates.reduce((sum, c) => sum + Number(c.totalVotes || 0), 0);

  // Cari paslon unggul sementara
  const leadingCandidate = [...candidates].sort((a, b) => Number(b.totalVotes) - Number(a.totalVotes))[0];

  return (
    <div className="min-h-screen py-12 lg:py-16 bg-gradient-to-b from-slate-50 via-indigo-50/20 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold uppercase tracking-wider">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Quick Count
            </div>
            <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight">
              Hasil Suara Sementara
            </h1>
            <p className="text-slate-600 text-sm sm:text-base">
              Perolehan suara diperbarui secara otomatis setiap 5 detik langsung dari server.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-xs text-xs font-bold text-slate-700 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              <svg className={`h-4 w-4 ${loading ? "animate-spin text-indigo-600" : "text-slate-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Refresh</span>
            </button>
            <div className="px-4 py-2 rounded-2xl bg-slate-100 text-xs font-semibold text-slate-500">
              Sinkronisasi: <span className="font-bold text-slate-700">{lastUpdated || "Menghubungkan..."}</span>
            </div>
          </div>
        </div>

        {/* Top Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 shadow-xs">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Suara Masuk</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{loading ? "..." : totalVotesCount.toLocaleString()}</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-purple-50 flex items-center justify-center text-purple-600 shadow-xs">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Total Kandidat</p>
              <h3 className="text-3xl font-black text-slate-900 mt-1">{candidates.length} Paslon</h3>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600 shadow-xs">
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-500">Unggul Sementara</p>
              <h3 className="text-xl font-black text-slate-900 mt-1 truncate max-w-[180px]">
                {leadingCandidate && totalVotesCount > 0 ? `Paslon #0${leadingCandidate.candidateNumber}` : "-"}
              </h3>
            </div>
          </div>
        </div>

        {/* Realtime Bar Chart Cards */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 shadow-sm border border-slate-100 space-y-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">Perolehan Suara Seluruh Paslon</h2>
            <span className="text-xs font-semibold text-slate-500">Persentase perolehan suara total</span>
          </div>

          {candidates.length === 0 ? (
            <div className="py-20 text-center text-slate-400 font-medium">
              Belum ada data kandidat atau belum ada suara yang masuk.
            </div>
          ) : (
            <div className="space-y-8">
              {candidates.map((cand, index) => {
                const percentage = totalVotesCount > 0
                  ? ((Number(cand.totalVotes) / totalVotesCount) * 100).toFixed(1)
                  : "0";
                const theme = colorThemes[index % colorThemes.length];

                return (
                  <div key={cand.candidateId} className="space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-3">
                        <div className={`h-10 w-10 rounded-2xl flex items-center justify-center font-black text-sm ${theme.bg} ${theme.text} shadow-xs border`}>
                          0{cand.candidateNumber}
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-base">
                            {cand.chairmanName} & {cand.viceChairmanName}
                          </h4>
                          <p className="text-xs font-semibold text-slate-500">Pasangan Calon Nomor Urut 0{cand.candidateNumber}</p>
                        </div>
                      </div>

                      <div className="text-right flex items-baseline justify-end gap-2">
                        <span className="text-2xl font-black text-slate-900">{cand.totalVotes.toLocaleString()}</span>
                        <span className="text-xs font-semibold text-slate-500">suara</span>
                        <span className={`text-sm font-black px-2.5 py-0.5 rounded-lg ${theme.bg} ${theme.text} ml-2`}>
                          {percentage}%
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar with Glow */}
                    <div className="w-full h-5 bg-slate-100 rounded-full overflow-hidden p-1 shadow-inner">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${theme.bar} transition-all duration-1000 ease-out shadow-xs`}
                        style={{ width: `${Math.max(Number(percentage), 1)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Call to action at bottom */}
        <div className="text-center bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 rounded-3xl p-8 sm:p-12 text-white shadow-xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="text-left space-y-1">
            <h3 className="text-2xl font-black">Belum Menggunakan Hak Suara Anda?</h3>
            <p className="text-indigo-100 text-sm">Masuk dengan akun yang telah diberikan untuk memberikan suara pilihan Anda.</p>
          </div>
          <Link
            href="/login"
            className="px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-all shadow-lg hover:scale-105 active:scale-95 whitespace-nowrap"
          >
            Login & Coblos Sekarang &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
