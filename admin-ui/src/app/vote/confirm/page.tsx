"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, clearVoterSession, getStoredVoter } from "@/lib/api";

interface Candidate {
  id: number;
  candidateNumber: number;
  chairmanName: string;
  viceChairmanName: string;
  vision: string;
  mission: string;
  photoUrl: string | null;
}

function ConfirmVoteContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [voter, setVoter] = useState<any>(null);

  useEffect(() => {
    const storedVoter = getStoredVoter();
    setVoter(storedVoter);

    const candidateId = Number(searchParams.get("candidate"));

    if (!candidateId) {
      setLoading(false);
      return;
    }

    const fetchCandidate = async () => {
      const response = await apiFetch("/candidates", {
        requiresAuth: false,
      });

      if (response.success && Array.isArray(response.data)) {
        const selected = response.data.find((item) => Number(item.id) === candidateId) || null;
        setCandidate(selected);
      }

      setLoading(false);
    };

    fetchCandidate();
  }, [searchParams]);

  const handleSubmit = async () => {
    if (!candidate || !voter?.id) {
      setErrorMessage("Data pemilih atau kandidat tidak valid.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");

    const response = await apiFetch("/votes", {
      method: "POST",
      body: JSON.stringify({
        user_id: Number(voter.id),
        candidate_id: Number(candidate.id),
      }),
      requiresAuth: true,
      authType: "voter",
    });

    setSubmitting(false);

    if (response.success) {
      router.push("/vote/success");
      return;
    }

    const message = response.message || "Gagal mengirim suara. Silakan coba lagi.";
    setErrorMessage(message);
  };

  const handleExit = () => {
    clearVoterSession();
    router.push("/login");
    router.refresh();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-6 py-4 shadow-sm">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-indigo-600 border-t-transparent" />
          <span className="text-sm font-semibold text-slate-700">Mengecek pilihan Anda...</span>
        </div>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="min-h-[70vh] px-4 py-12">
        <div className="mx-auto max-w-lg rounded-3xl border border-red-200 bg-red-50 p-8 text-center shadow-sm">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-red-600">Error</p>
          <h1 className="mt-3 text-2xl font-black text-slate-900">Kandidat Tidak Ditemukan</h1>
          <p className="mt-3 text-sm text-slate-600">Silakan pilih kandidat kembali dari halaman utama voting.</p>
          <button
            type="button"
            onClick={() => router.push("/vote")}
            className="mt-6 rounded-full bg-slate-900 px-5 py-3 text-sm font-bold text-white"
          >
            Kembali ke Pemilihan
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600">Konfirmasi</p>
            <h1 className="mt-2 text-3xl font-black text-slate-900">Review Pilihan Anda</h1>
          </div>
          <button
            type="button"
            onClick={() => router.push("/vote")}
            className="rounded-full border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
          >
            Ubah Pilihan
          </button>
        </div>

        <div className="mt-8 grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
            <div className="flex items-center gap-4">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-2xl font-black text-white shadow-lg shadow-indigo-200">
                {candidate.candidateNumber}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Pasangan Calon</p>
                <h2 className="mt-2 text-2xl font-black text-slate-900">
                  {candidate.chairmanName}
                </h2>
                <p className="text-sm font-semibold text-indigo-600">& {candidate.viceChairmanName}</p>
              </div>
            </div>

            <div className="mt-6 space-y-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Visi</p>
                <p className="mt-2 text-sm leading-6 text-slate-700">{candidate.vision}</p>
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">Misi</p>
                <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
                  {candidate.mission
                    .split(/\n|;|\d\.\s/)
                    .filter(Boolean)
                    .map((item, index) => (
                      <li key={`${candidate.id}-${index}`} className="flex gap-2">
                        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-500" />
                        <span>{item.trim()}</span>
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-700">Peringatan</p>
            <h3 className="mt-3 text-xl font-black text-slate-900">Pilihanmu tidak bisa diubah setelah submit</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">
              Pastikan Anda sudah membaca profil kandidat dan yakin dengan pilihan yang akan dikirimkan.
            </p>

            {errorMessage && (
              <div className="mt-5 space-y-3 rounded-2xl border border-red-200 bg-red-100 px-4 py-3 text-sm font-medium text-red-700">
                <div>{errorMessage}</div>
                {errorMessage.includes("Voter hanya bisa vote sekali") && (
                  <button
                    type="button"
                    onClick={handleExit}
                    className="w-full rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-500"
                  >
                    Keluar
                  </button>
                )}
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full rounded-2xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {submitting ? "Mengirim suara..." : "Konfirmasi Pilih"}
              </button>
              <button
                type="button"
                onClick={() => router.push("/vote")}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Batal
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ConfirmVotePage() {
  return (
    <Suspense fallback={<div className="min-h-[70vh] flex items-center justify-center">Memuat konfirmasi...</div>}>
      <ConfirmVoteContent />
    </Suspense>
  );
}
