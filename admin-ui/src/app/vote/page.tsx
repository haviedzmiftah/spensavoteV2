"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiFetch, getMediaUrl, getStoredVoter } from "@/lib/api";

interface Candidate {
  id: number;
  candidateNumber: number;
  chairmanName: string;
  viceChairmanName: string;
  vision: string;
  mission: string;
  photoUrl: string | null;
}

export default function VotePage() {
  const router = useRouter();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [voter, setVoter] = useState<any>(null);

  useEffect(() => {
    setVoter(getStoredVoter());

    const fetchCandidates = async () => {
      const response = await apiFetch("/candidates", {
        requiresAuth: false,
      });

      if (response.success && Array.isArray(response.data)) {
        const sorted = [...response.data].sort(
          (a, b) => Number(a.candidateNumber) - Number(b.candidateNumber),
        );
        setCandidates(sorted);
      }

      setLoading(false);
    };

    fetchCandidates();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-semibold text-slate-700">
            Memuat kandidat...
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">
                Pemilihan
              </p>
              <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900">
                Daftar Pasangan Calon Ketua dan Wakil Ketua OSIS
              </h1>
            </div>

            <div className="rounded-2xl bg-indigo-50 px-4 py-2 text-sm font-semibold text-indigo-700">
              {voter?.username ? `Pemilih: ${voter.username}` : "Pemilih aktif"}
            </div>
          </div>
        </div>

        {candidates.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-slate-300 bg-white px-6 py-12 text-center">
            <p className="text-lg font-semibold text-slate-700">
              Belum ada kandidat yang tersedia.
            </p>
            <p className="mt-2 text-sm text-slate-500">
              Silakan tunggu hingga data kandidat diunggah oleh panitia.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 xl:grid-cols-3 md:grid-cols-3">
            {candidates.map((candidate) => (
              <button
                key={candidate.id}
                type="button"
                onClick={() =>
                  router.push(`/vote/confirm?candidate=${candidate.id}`)
                }
                className="group flex h-full flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-indigo-200 hover:shadow-xl"
              >
                <div className="relative h-60 bg-gradient-to-br from-indigo-50 via-slate-50 to-purple-100 p-5">
                  {candidate.photoUrl ? (
                    <img
                      src={getMediaUrl(candidate.photoUrl)}
                      alt={`${candidate.chairmanName} & ${candidate.viceChairmanName}`}
                      className="h-full w-full rounded-2xl object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-dashed border-slate-300 bg-white/80 text-center text-slate-500">
                      <div>
                        <div className="text-4xl font-black text-indigo-500">
                          {candidate.candidateNumber}
                        </div>
                        <div className="mt-2 text-xs font-semibold uppercase tracking-[0.2em]">
                          Paslon
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="absolute left-6 top-6 rounded-full bg-white/90 px-3 py-1 text-xs font-black uppercase tracking-[0.2em] text-slate-700 shadow-sm backdrop-blur-sm">
                    No. {candidate.candidateNumber}
                  </div>
                </div>

                <div className="flex flex-1 flex-col space-y-5 p-6">
                  <div>
                    <h2 className="text-2xl font-black text-slate-900">
                      {candidate.chairmanName}
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-indigo-600">
                      & {candidate.viceChairmanName}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Visi
                    </p>
                    <p className="text-sm leading-6 text-slate-600">
                      {candidate.vision}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
                      Misi
                    </p>
                    <ul className="space-y-2 text-sm text-slate-600">
                      {candidate.mission
                        .split(/\n|;|\d\.\s/)
                        .filter(Boolean)
                        .slice(0, 3)
                        .map((item, index) => (
                          <li
                            key={`${candidate.id}-${index}`}
                            className="flex gap-2 leading-6"
                          >
                            <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                            <span>{item.trim()}</span>
                          </li>
                        ))}
                    </ul>
                  </div>

                  <div className="mt-auto flex items-center justify-between pt-2">
                    <span className="text-sm font-semibold text-slate-500">
                      Siap untuk dipilih
                    </span>
                    <span className="inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-2 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-colors group-hover:bg-indigo-500">
                      Pilih Kandidat
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
