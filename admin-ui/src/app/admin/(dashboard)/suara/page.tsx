"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface CandidateCount {
  candidateId: number;
  candidateNumber: number;
  chairmanName: string;
  viceChairmanName: string;
  photoUrl: string | null;
  totalVotes: number;
}

interface VoteLog {
  id: number;
  voteDate: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
  candidate: {
    id: number;
    candidateNumber: number;
    chairmanName: string;
    viceChairmanName: string;
  };
}

export default function SuaraPage() {
  const [candidates, setCandidates] = useState<CandidateCount[]>([]);
  const [voteLogs, setVoteLogs] = useState<VoteLog[]>([]);
  const [totalDPT, setTotalDPT] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  const colors = [
    { bar: "from-blue-500 to-indigo-600", bg: "bg-blue-50" },
    { bar: "from-emerald-500 to-teal-600", bg: "bg-emerald-50" },
    { bar: "from-purple-500 to-pink-600", bg: "bg-purple-50" },
    { bar: "from-amber-500 to-orange-600", bg: "bg-amber-50" },
  ];

  const loadData = async () => {
    setLoading(true);
    const [countRes, logsRes, usersRes] = await Promise.all([
      apiFetch("/votes/count"),
      apiFetch("/votes/admin/list"),
      apiFetch("/users"),
    ]);

    if (countRes.success && Array.isArray(countRes.data)) {
      const sorted = [...countRes.data].sort((a, b) => a.candidateNumber - b.candidateNumber);
      setCandidates(sorted);
    }
    if (logsRes.success && Array.isArray(logsRes.data)) {
      const sorted = [...logsRes.data].reverse();
      setVoteLogs(sorted);
    }
    if (usersRes.success && Array.isArray(usersRes.data)) {
      const votersOnly = usersRes.data.filter((u: any) => u.role === "voters");
      setTotalDPT(votersOnly.length);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 5000); // 5s live polling
    return () => clearInterval(interval);
  }, []);

  const totalVotes = candidates.reduce((sum, c) => sum + Number(c.totalVotes || 0), 0);
  const totalPercentage = totalDPT > 0 ? ((totalVotes / totalDPT) * 100).toFixed(1) : "0";
  const unvotedCount = Math.max(0, totalDPT - totalVotes);

  const exportCSV = () => {
    if (voteLogs.length === 0) {
      alert("Belum ada data suara untuk di-export.");
      return;
    }
    const headers = "ID Suara,Waktu,Username Pemilih,Pilihan Paslon,Nama Paslon\n";
    const rows = voteLogs.map((l) => 
      `"${l.id}","${l.voteDate}","${l.user?.username || ''}","Paslon 0${l.candidate?.candidateNumber}","${l.candidate?.chairmanName} & ${l.candidate?.viceChairmanName}"`
    ).join("\n");

    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `laporan_suara_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Monitoring Suara</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Pantau hasil perolehan suara secara real-time</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={exportCSV}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Export Laporan CSV
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
            </span>
            <span className="text-sm font-bold text-emerald-600">Live Auto-Sync (5s)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Perolehan Suara Sementara</h3>
          <p className="text-sm text-gray-500 font-medium mb-8">
            Berdasarkan {loading ? "..." : totalVotes} suara yang sudah masuk ({totalPercentage}%)
          </p>

          {candidates.length === 0 ? (
            <div className="py-16 text-center text-gray-400 font-medium">
              Belum ada data kandidat yang terdaftar.
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-center gap-8">
              {candidates.map((kandidat, index) => {
                const percent = totalVotes > 0 ? ((Number(kandidat.totalVotes) / totalVotes) * 100).toFixed(1) : "0";
                const colorTheme = colors[index % colors.length];

                return (
                  <div key={kandidat.candidateId}>
                    <div className="flex justify-between items-end mb-2">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-700 text-sm">
                          0{kandidat.candidateNumber}
                        </div>
                        <span className="font-bold text-gray-800 text-lg">
                          {kandidat.chairmanName} & {kandidat.viceChairmanName}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="font-black text-2xl text-gray-900">{kandidat.totalVotes}</span>
                        <span className="text-sm font-bold text-gray-500 ml-1">suara</span>
                      </div>
                    </div>
                    <div className={`w-full h-4 ${colorTheme.bg} rounded-full overflow-hidden`}>
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${colorTheme.bar} transition-all duration-1000 ease-out`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                    <div className="mt-1 flex justify-end">
                      <span className="text-sm font-bold text-gray-600">{percent}%</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Info & Log Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Statistik Voting</h3>

          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
              <span className="text-sm font-bold text-gray-600">Total DPT (Voters)</span>
              <span className="text-lg font-black text-gray-900">{loading ? "..." : totalDPT}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
              <span className="text-sm font-bold text-indigo-600">Suara Masuk</span>
              <span className="text-lg font-black text-indigo-900">{loading ? "..." : totalVotes}</span>
            </div>
            <div className="flex justify-between items-center p-4 rounded-2xl bg-red-50/50 border border-red-100">
              <span className="text-sm font-bold text-red-600">Belum Memilih</span>
              <span className="text-lg font-black text-red-900">{loading ? "..." : unvotedCount}</span>
            </div>
          </div>

          <h3 className="text-md font-bold text-gray-800 mb-4">Log Masuk Suara</h3>
          <div className="flex-1 overflow-y-auto max-h-72 space-y-4 pr-1">
            {voteLogs.length === 0 ? (
              <p className="text-xs text-gray-400 text-center py-6">Belum ada aktivitas suara.</p>
            ) : (
              voteLogs.slice(0, 10).map((log) => (
                <div key={log.id} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
                  <div>
                    <p className="text-sm font-bold text-gray-700">{log.user?.username || "Pemilih"}</p>
                    <p className="text-xs font-semibold text-gray-400">Paslon #{log.candidate?.candidateNumber}</p>
                  </div>
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
                    {log.voteDate ? new Date(log.voteDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Baru saja"}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
