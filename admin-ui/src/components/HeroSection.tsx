"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { apiFetch } from "@/lib/api";

interface Candidate {
  id: number;
  candidateNumber: number;
  chairmanName: string;
  viceChairmanName: string;
  vision: string;
  mission: string;
  photoUrl: string | null;
}

// Fallback jika API belum memiliki data kandidat
const fallbackCandidates: Candidate[] = [
  {
    id: 1,
    candidateNumber: 1,
    chairmanName: "Ahmad Rizky Pratama",
    viceChairmanName: "Budi Santoso",
    vision: "Mewujudkan OSIS yang aktif, kreatif, berakhlak mulia, dan menjunjung tinggi solidaritas sekolah.",
    mission: "1. Mengoptimalkan kegiatan ekstrakurikuler; 2. Mengadakan festival tahunan seni dan sains.",
    photoUrl: null,
  },
  {
    id: 2,
    candidateNumber: 2,
    chairmanName: "Clara Salsabila",
    viceChairmanName: "Dimas Aditya",
    vision: "Membangun lingkungan sekolah yang inklusif, inovatif, dan berwawasan digital modern.",
    mission: "1. Digitalisasi mading sekolah; 2. Gerakan peduli lingkungan & literasi digital.",
    photoUrl: null,
  },
  {
    id: 3,
    candidateNumber: 3,
    chairmanName: "Farhan Maulana",
    viceChairmanName: "Gita Permata",
    vision: "Menjadikan OSIS sebagai wadah aspirasi siswa yang transparan, progresif, dan berprestasi.",
    mission: "1. Forum diskusi terbuka bersama guru dan siswa; 2. Peningkatan prestasi akademik & olahraga.",
    photoUrl: null,
  },
];

export default function HeroSection() {
  const [candidates, setCandidates] = useState<Candidate[]>(fallbackCandidates);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch("/candidates").then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const sorted = [...res.data].sort((a, b) => a.candidateNumber - b.candidateNumber);
        setCandidates(sorted);
      }
      setLoading(false);
    });
  }, []);

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % candidates.length);
  }, [candidates.length]);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + candidates.length) % candidates.length);
  }, [candidates.length]);

  // Auto-slide effect setiap 5 detik (pause saat mouse hover)
  useEffect(() => {
    if (isPaused || candidates.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, candidates.length, nextSlide]);

  const activeCandidate = candidates[currentIndex] || candidates[0];

  return (
    <section className="relative overflow-hidden py-12 lg:py-20 bg-gradient-to-b from-white via-indigo-50/30 to-slate-50">
      {/* Background Decorative Gradients */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-tr from-indigo-200/40 via-purple-200/30 to-pink-100/20 blur-3xl rounded-full -z-10" />
      <div className="pointer-events-none absolute top-1/3 right-0 w-96 h-96 bg-indigo-100/40 blur-3xl rounded-full -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & Call To Action */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100/80 shadow-xs">
              <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-ping"></span>
              <span className="text-xs font-bold text-indigo-700 tracking-wide uppercase">
                Pemilihan Ketua & Wakil Ketua OSIS
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.15]">
              Suara Anda Menentukan{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
                Masa Depan
              </span>{" "}
              Sekolah Kita.
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto lg:mx-0">
              Gunakan hak pilih Anda secara jujur, adil, dan transparan melalui platform e-voting Spensavote. Kenali visi misi kandidat terbaik sebelum menentukan pilihan!
            </p>

            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link
                href="/login"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-base shadow-xl shadow-indigo-200 hover:shadow-indigo-300 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
                <span>Masuk & Coblos Sekarang</span>
              </Link>

              <Link
                href="/live-score"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white hover:bg-slate-50 text-slate-800 font-bold text-base border border-slate-200 shadow-sm hover:border-slate-300 transition-all"
              >
                <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span>Lihat Live Score</span>
              </Link>
            </div>

            {/* Quick Metrics */}
            <div className="pt-8 border-t border-slate-200/60 grid grid-cols-3 gap-4 max-w-lg mx-auto lg:mx-0">
              <div>
                <p className="text-2xl sm:text-3xl font-black text-slate-900">{candidates.length}</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Pasangan Calon</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-indigo-600">100%</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Aman & Rahasia</p>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-black text-emerald-600">Real-time</p>
                <p className="text-xs font-semibold text-slate-500 mt-0.5">Hasil Hitung Cepat</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Paslon Carousel Slider */}
          <div 
            className="lg:col-span-5"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <div className="relative mx-auto max-w-md bg-white rounded-3xl p-4 sm:p-6 shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden">
              
              {/* Top Tag & Progress */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="h-8 w-8 rounded-xl bg-indigo-600 text-white font-black text-sm flex items-center justify-center shadow-md shadow-indigo-200">
                    0{activeCandidate.candidateNumber}
                  </span>
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                    Kandidat Paslon
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full text-xs font-bold text-slate-600">
                  <span>{currentIndex + 1}</span>
                  <span className="text-slate-400">/</span>
                  <span>{candidates.length}</span>
                </div>
              </div>

              {/* Photo & Candidate Card Display */}
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 flex flex-col justify-end p-6 text-white shadow-inner group">
                {activeCandidate.photoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={activeCandidate.photoUrl}
                    alt={`${activeCandidate.chairmanName} & ${activeCandidate.viceChairmanName}`}
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 flex flex-col items-center justify-center text-white p-6">
                    <div className="h-20 w-20 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-3xl mb-3 shadow-lg border border-white/30">
                      0{activeCandidate.candidateNumber}
                    </div>
                    <p className="text-sm font-semibold text-indigo-100">Foto Resmi Paslon</p>
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                <div className="relative z-10 space-y-1">
                  <div className="inline-block px-2.5 py-0.5 rounded-md bg-indigo-500/80 backdrop-blur-md text-[10px] font-bold tracking-wider uppercase text-white mb-1">
                    Pasangan Calon #0{activeCandidate.candidateNumber}
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-sm">
                    {activeCandidate.chairmanName}
                  </h3>
                  <p className="text-sm font-medium text-slate-200 drop-shadow-sm">
                    & {activeCandidate.viceChairmanName}
                  </p>
                </div>
              </div>

              {/* Vision Preview */}
              <div className="mt-4 p-4 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Visi Utama</p>
                <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                  &ldquo;{activeCandidate.vision}&rdquo;
                </p>
              </div>

              {/* Slider Controls */}
              <div className="mt-5 flex items-center justify-between pt-2 border-t border-slate-100">
                {/* Dots indicator */}
                <div className="flex items-center gap-1.5">
                  {candidates.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        currentIndex === idx
                          ? "w-7 bg-indigo-600"
                          : "w-2 bg-slate-200 hover:bg-slate-300"
                      }`}
                      aria-label={`Go to slide ${idx + 1}`}
                    />
                  ))}
                </div>

                {/* Arrow navigation buttons */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={prevSlide}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
                    aria-label="Previous Candidate"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="p-2.5 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-600 transition-colors cursor-pointer"
                    aria-label="Next Candidate"
                  >
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
