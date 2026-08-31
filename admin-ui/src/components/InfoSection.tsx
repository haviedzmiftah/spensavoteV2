"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { apiFetch, getMediaUrl } from "@/lib/api";

interface Candidate {
  id: number;
  candidateNumber: number;
  chairmanName: string;
  viceChairmanName: string;
  vision: string;
  mission: string;
  photoUrl: string | null;
}

const fallbackCandidates: Candidate[] = [
  {
    id: 1,
    candidateNumber: 1,
    chairmanName: "Ahmad Rizky Pratama",
    viceChairmanName: "Budi Santoso",
    vision: "Mewujudkan OSIS yang aktif, kreatif, berakhlak mulia, dan menjunjung tinggi solidaritas sekolah.",
    mission: "1. Mengoptimalkan kegiatan ekstrakurikuler sekolah.\n2. Mengadakan festival tahunan seni, budaya, dan sains antarkelas.\n3. Membangun komunikasi yang harmonis antara guru dan siswa.",
    photoUrl: null,
  },
  {
    id: 2,
    candidateNumber: 2,
    chairmanName: "Clara Salsabila",
    viceChairmanName: "Dimas Aditya",
    vision: "Membangun lingkungan sekolah yang inklusif, inovatif, dan berwawasan digital modern.",
    mission: "1. Digitalisasi majalah dinding (mading) & aspirasi siswa.\n2. Gerakan peduli lingkungan hijau dan daur ulang sampah.\n3. Pelatihan kepemimpinan dan literasi digital.",
    photoUrl: null,
  },
  {
    id: 3,
    candidateNumber: 3,
    chairmanName: "Farhan Maulana",
    viceChairmanName: "Gita Permata",
    vision: "Menjadikan OSIS sebagai wadah aspirasi siswa yang transparan, progresif, dan berprestasi.",
    mission: "1. Forum dengar pendapat terbuka siswa bersama pengurus sekolah.\n2. Program pendampingan minat & bakat kompetisi olimpiade/olahraga.\n3. Aksi sosial peduli sesama dan bakti lingkungan.",
    photoUrl: null,
  },
];

export default function InfoSection() {
  const [candidates, setCandidates] = useState<Candidate[]>(fallbackCandidates);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  useEffect(() => {
    apiFetch("/candidates").then((res) => {
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const sorted = [...res.data].sort((a, b) => a.candidateNumber - b.candidateNumber);
        setCandidates(sorted);
      }
    });
  }, []);

  const steps = [
    {
      step: "01",
      title: "Masuk dengan Akun",
      desc: "Gunakan username dan password/token yang telah dibagikan oleh panitia pemilihan.",
      icon: (
        <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      ),
      color: "bg-indigo-50 border-indigo-100",
    },
    {
      step: "02",
      title: "Kenali & Tentukan Paslon",
      desc: "Pelajari visi, misi, dan program kerja masing-masing pasangan calon sebelum menentukan suara.",
      icon: (
        <svg className="h-6 w-6 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
      ),
      color: "bg-purple-50 border-purple-100",
    },
    {
      step: "03",
      title: "Coblos & Konfirmasi",
      desc: "Klik tombol coblos pada kandidat pilihan Anda dan konfirmasi pengiriman surat suara.",
      icon: (
        <svg className="h-6 w-6 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: "bg-emerald-50 border-emerald-100",
    },
    {
      step: "04",
      title: "Pantau Hasil Real-Time",
      desc: "Setelah selesai mencoblos, pantau perolehan suara secara langsung di halaman Live Score.",
      icon: (
        <svg className="h-6 w-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
        </svg>
      ),
      color: "bg-amber-50 border-amber-100",
    },
  ];

  const timeline = [
    {
      phase: "Fase 1",
      title: "Sosialisasi & Pendaftaran",
      date: "Masa Pendaftaran & Verifikasi",
      status: "completed",
    },
    {
      phase: "Fase 2",
      title: "Masa Kampanye & Debat Paslon",
      date: "Penyampaian Visi & Misi",
      status: "completed",
    },
    {
      phase: "Fase 3",
      title: "Pemungutan Suara E-Voting",
      date: "Hari Pemilihan (Saat Ini)",
      status: "active",
    },
    {
      phase: "Fase 4",
      title: "Penetapan Ketua OSIS Terpilih",
      date: "Pengumuman & Pelantikan",
      status: "upcoming",
    },
  ];

  return (
    <div className="space-y-24 py-16 lg:py-24">
      
      {/* 1. SECTION: PANDUAN CARA MEMILIH (HOW TO VOTE) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            Panduan E-Voting
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Tata Cara Memberikan Suara
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Proses pemilihan dirancang sangat mudah, cepat, dan aman hanya dalam 4 tahapan sederhana.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-slate-100/60 to-transparent -z-0 rounded-bl-full group-hover:from-indigo-50 transition-colors" />
              <div className="relative z-10 space-y-5">
                <div className="flex items-center justify-between">
                  <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border shadow-xs ${item.color}`}>
                    {item.icon}
                  </div>
                  <span className="text-2xl font-black text-slate-300 group-hover:text-indigo-600 transition-colors">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 2. SECTION: PROFIL LENGKAP PASLON */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto space-y-4 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-50 border border-purple-100 text-purple-700 text-xs font-bold uppercase tracking-wider">
            Kandidat Resmi
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Daftar Pasangan Calon
          </h2>
          <p className="text-slate-600 text-base sm:text-lg">
            Kenali profil, visi, dan misi lengkap masing-masing kandidat calon pemimpin sekolah kita.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {candidates.map((cand) => (
            <div
              key={cand.id}
              className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                {/* Photo & Number Badge */}
                <div className="relative aspect-[16/10] bg-gradient-to-tr from-slate-900 via-indigo-950 to-slate-800 overflow-hidden flex items-center justify-center">
                  {cand.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={getMediaUrl(cand.photoUrl)}
                      alt={`${cand.chairmanName} & ${cand.viceChairmanName}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="flex flex-col items-center justify-center text-white">
                      <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center font-black text-2xl shadow-lg border border-white/30 mb-2">
                        0{cand.candidateNumber}
                      </div>
                      <span className="text-xs text-indigo-200 font-medium">Foto Kandidat</span>
                    </div>
                  )}

                  <div className="absolute top-4 left-4">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md text-white font-black text-xs border border-white/20 shadow-md">
                      <span className="h-2 w-2 rounded-full bg-indigo-400"></span>
                      PASLON #0{cand.candidateNumber}
                    </span>
                  </div>
                </div>

                {/* Candidate Content */}
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {cand.chairmanName}
                    </h3>
                    <p className="text-sm font-semibold text-slate-500">
                      & {cand.viceChairmanName}
                    </p>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">Visi</p>
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      &ldquo;{cand.vision}&rdquo;
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Button: View Details Modal */}
              <div className="p-6 pt-0">
                <button
                  onClick={() => setSelectedCandidate(cand)}
                  className="w-full py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-600 text-indigo-600 hover:text-white font-bold text-sm transition-all duration-200 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>Lihat Visi & Misi Lengkap</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SECTION: TIMELINE JADWAL PEMILU */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-2xl overflow-hidden relative">
          <div className="pointer-events-none absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-500/20 blur-3xl rounded-full" />

          <div className="max-w-3xl space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-indigo-300 text-xs font-bold uppercase tracking-wider border border-white/10">
              Jadwal Pelaksanaan
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Tahapan Pemilihan OSIS
            </h2>
            <p className="text-slate-300 text-sm sm:text-base">
              Seluruh proses pemungutan suara dilaksanakan secara tertib sesuai dengan jadwal berikut.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
            {timeline.map((item, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-2xl border transition-all duration-300 ${
                  item.status === "active"
                    ? "bg-indigo-600/30 border-indigo-400 ring-2 ring-indigo-400/50 shadow-lg shadow-indigo-500/20"
                    : "bg-white/5 border-white/10 hover:bg-white/10"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-bold uppercase tracking-widest text-indigo-300">{item.phase}</span>
                  {item.status === "active" ? (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500 text-slate-950 font-bold text-[10px] uppercase">
                      <span className="h-1.5 w-1.5 rounded-full bg-slate-950 animate-ping"></span>
                      Aktif
                    </span>
                  ) : item.status === "completed" ? (
                    <span className="text-emerald-400 text-xs font-bold flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Selesai
                    </span>
                  ) : (
                    <span className="text-slate-400 text-xs font-semibold">Mendatang</span>
                  )}
                </div>
                <h3 className="font-bold text-base text-white mb-2">{item.title}</h3>
                <p className="text-xs text-slate-300">{item.date}</p>
              </div>
            ))}
          </div>

          {/* CTA Banner inside Timeline */}
          <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <p className="font-bold text-lg text-white">Sudah siap menentukan pilihan Anda?</p>
              <p className="text-xs text-slate-400">Pastikan Anda memiliki username & password aktif sebelum masuk.</p>
            </div>
            <Link
              href="/login"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-2xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-sm shadow-xl transition-all hover:scale-105 active:scale-95 whitespace-nowrap"
            >
              <svg className="h-4 w-4 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
              <span>Login Pemilih Sekarang</span>
            </Link>
          </div>
        </div>
      </section>

      {/* MODAL DETAIL VISI & MISI PASLON */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-md shadow-indigo-200">
                  0{selectedCandidate.candidateNumber}
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900 leading-tight">
                    {selectedCandidate.chairmanName}
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">
                    & {selectedCandidate.viceChairmanName}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Visi */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                Visi
              </span>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedCandidate.vision}
              </p>
            </div>

            {/* Misi */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold uppercase tracking-wider">
                Misi & Program Kerja
              </span>
              <div className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100 whitespace-pre-line">
                {selectedCandidate.mission}
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedCandidate(null)}
                className="px-5 py-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm font-bold transition-colors cursor-pointer"
              >
                Tutup
              </button>
              <Link
                href="/login"
                className="px-6 py-2.5 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold shadow-md shadow-indigo-200 transition-all active:scale-95"
              >
                Pilih Paslon #{selectedCandidate.candidateNumber}
              </Link>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
