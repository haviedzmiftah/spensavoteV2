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

export default function DashboardPage() {
  const [totalUsers, setTotalUsers] = useState<number>(0);
  const [candidates, setCandidates] = useState<CandidateCount[]>([]);
  const [recentVotes, setRecentVotes] = useState<VoteLog[]>([]);
  const [loading, setLoading] = useState(true);

  const totalVotesCount = candidates.reduce((sum, c) => sum + Number(c.totalVotes || 0), 0);
  const participationRate = totalUsers > 0 ? ((totalVotesCount / totalUsers) * 100).toFixed(1) : "0";

  const loadData = async () => {
    setLoading(true);
    const [usersRes, countRes, votesListRes] = await Promise.all([
      apiFetch("/users"),
      apiFetch("/votes/count"),
      apiFetch("/votes/admin/list"),
    ]);

    if (usersRes.success && Array.isArray(usersRes.data)) {
      setTotalUsers(usersRes.data.length);
    }
    if (countRes.success && Array.isArray(countRes.data)) {
      setCandidates(countRes.data);
    }
    if (votesListRes.success && Array.isArray(votesListRes.data)) {
      // Sort newest first
      const sorted = [...votesListRes.data].reverse();
      setRecentVotes(sorted.slice(0, 5));
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header Refresh status */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-800">Ringkasan Sistem</h2>
        <button
          onClick={loadData}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-all shadow-sm active:scale-95 disabled:opacity-50"
        >
          <svg className={`h-4 w-4 ${loading ? "animate-spin text-indigo-600" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
          Segarkan Data
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          {
            label: "Total Pemilih",
            value: loading ? "..." : totalUsers.toLocaleString(),
            sub: "Total akun terdaftar",
            color: "from-blue-500 to-blue-600",
            icon: "M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z",
          },
          {
            label: "Suara Masuk",
            value: loading ? "..." : totalVotesCount.toLocaleString(),
            sub: `${participationRate}% partisipasi`,
            color: "from-emerald-500 to-emerald-600",
            icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z",
          },
          {
            label: "Kandidat Terdaftar",
            value: loading ? "..." : candidates.length.toString(),
            sub: "Pasangan calon aktif",
            color: "from-purple-500 to-purple-600",
            icon: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
          },
          {
            label: "Belum Memilih",
            value: loading ? "..." : Math.max(0, totalUsers - totalVotesCount).toLocaleString(),
            sub: "Hak suara tersisa",
            color: "from-amber-500 to-amber-600",
            icon: "M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z",
          },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-bold text-gray-500">{kpi.label}</p>
              <div className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${kpi.color} text-white flex items-center justify-center shadow-md`}>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={kpi.icon} />
                </svg>
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-800 tracking-tight">{kpi.value}</h3>
              <p className="text-xs font-semibold text-gray-400 mt-2">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Quick Count Overview */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-bold text-gray-800">Perolehan Suara Paslon</h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">Ringkasan hasil quick count real-time</p>
              </div>
              <Link href="/suara" className="text-sm font-bold text-indigo-600 hover:text-indigo-700">
                Detail Monitoring &rarr;
              </Link>
            </div>

            {candidates.length === 0 ? (
              <div className="py-12 text-center text-gray-400 font-medium text-sm">
                Belum ada data kandidat atau belum ada suara masuk.
              </div>
            ) : (
              <div className="space-y-6">
                {candidates.map((cand) => {
                  const percentage = totalVotesCount > 0
                    ? ((Number(cand.totalVotes) / totalVotesCount) * 100).toFixed(1)
                    : "0";
                  return (
                    <div key={cand.candidateId} className="space-y-2">
                      <div className="flex justify-between items-center text-sm">
                        <div className="flex items-center gap-2">
                          <span className="h-6 w-6 rounded-lg bg-indigo-50 text-indigo-600 font-black text-xs flex items-center justify-center">
                            #{cand.candidateNumber}
                          </span>
                          <span className="font-bold text-gray-800">
                            {cand.chairmanName} & {cand.viceChairmanName}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-gray-900">{cand.totalVotes} suara</span>
                          <span className="text-xs font-semibold text-gray-400 ml-2">({percentage}%)</span>
                        </div>
                      </div>
                      <div className="w-full h-3 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full transition-all duration-700"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Recent Votes Log */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-gray-800">Suara Terbaru</h3>
            <span className="text-xs font-bold px-2 py-1 bg-emerald-50 text-emerald-600 rounded-lg">Realtime</span>
          </div>

          {recentVotes.length === 0 ? (
            <div className="py-12 text-center text-gray-400 font-medium text-sm">
              Belum ada aktivitas voting yang tercatat.
            </div>
          ) : (
            <div className="space-y-5">
              {recentVotes.map((log) => (
                <div key={log.id} className="flex gap-4 items-start pb-4 border-b border-gray-50 last:border-0 last:pb-0">
                  <div className="mt-1 flex h-3 w-3 flex-none items-center justify-center">
                    <div className="h-2.5 w-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                  </div>
                  <div className="flex-auto">
                    <p className="text-sm font-bold text-gray-800">
                      {log.user?.username || "Pemilih"} <span className="text-xs font-normal text-gray-500">memberikan suara untuk</span> Paslon #{log.candidate?.candidateNumber}
                    </p>
                    <p className="text-xs font-semibold text-gray-400 mt-1">
                      {log.voteDate ? new Date(log.voteDate).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) : "Baru saja"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
