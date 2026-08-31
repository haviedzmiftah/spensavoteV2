"use client";

import { useEffect, useState } from "react";
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

export default function KandidatPage() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [formData, setFormData] = useState({
    candidate_number: 1,
    chairman_name: "",
    vice_chairman_name: "",
    vision: "",
    mission: "",
    photo_url: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadCandidates = async () => {
    setLoading(true);
    const res = await apiFetch("/candidates");
    if (res.success && Array.isArray(res.data)) {
      // Sort by candidate number
      const sorted = [...res.data].sort((a, b) => a.candidateNumber - b.candidateNumber);
      setCandidates(sorted);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  const openAddModal = () => {
    setEditingCandidate(null);
    setFormData({
      candidate_number: candidates.length + 1,
      chairman_name: "",
      vice_chairman_name: "",
      vision: "",
      mission: "",
      photo_url: "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (candidate: Candidate) => {
    setEditingCandidate(candidate);
    setFormData({
      candidate_number: candidate.candidateNumber,
      chairman_name: candidate.chairmanName,
      vice_chairman_name: candidate.viceChairmanName,
      vision: candidate.vision,
      mission: candidate.mission,
      photo_url: candidate.photoUrl || "",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload = {
      candidate_number: Number(formData.candidate_number),
      chairman_name: formData.chairman_name,
      vice_chairman_name: formData.vice_chairman_name,
      vision: formData.vision,
      mission: formData.mission,
      photo_url: formData.photo_url || undefined,
    };

    let res;
    if (editingCandidate) {
      res = await apiFetch(`/candidates/${editingCandidate.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      res = await apiFetch("/candidates", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    setSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      loadCandidates();
    } else {
      setErrorMsg(res.message || "Gagal menyimpan data kandidat");
    }
  };

  const handleDelete = async (candidate: Candidate) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus kandidat nomor urut ${candidate.candidateNumber} (${candidate.chairmanName} & ${candidate.viceChairmanName})?`)) {
      return;
    }

    const res = await apiFetch(`/candidates/${candidate.id}`, {
      method: "DELETE",
    });

    if (res.success) {
      loadCandidates();
    } else {
      alert(res.message || "Gagal menghapus kandidat");
    }
  };

  const filteredCandidates = candidates.filter((c) => {
    const q = search.toLowerCase();
    return (
      c.chairmanName.toLowerCase().includes(q) ||
      c.viceChairmanName.toLowerCase().includes(q) ||
      c.candidateNumber.toString().includes(q) ||
      c.vision.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Manajemen Kandidat</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Kelola data calon ketua dan wakil ketua OSIS</p>
        </div>
        <button
          onClick={openAddModal}
          className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 hover:shadow-indigo-300 transition-all active:scale-[0.98] cursor-pointer"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Tambah Kandidat
        </button>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="relative max-w-sm w-full">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
              <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari kandidat..."
              className="block w-full rounded-2xl border-0 py-3 pl-11 pr-4 text-gray-900 bg-gray-50/50 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
            />
          </div>
          <button
            onClick={loadCandidates}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <svg className={`h-4 w-4 text-gray-500 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Kandidat</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Nomor Urut</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Visi & Misi</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="relative py-4 pl-3 pr-6 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    Memuat data kandidat...
                  </td>
                </tr>
              ) : filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    Tidak ada data kandidat.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map((kandidat) => (
                  <tr key={kandidat.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="whitespace-nowrap py-5 pl-6 pr-3">
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-50 flex items-center justify-center font-bold text-indigo-600 text-lg">
                          0{kandidat.candidateNumber}
                        </div>
                        <div>
                          <div className="font-bold text-gray-900">{kandidat.chairmanName} & {kandidat.viceChairmanName}</div>
                          <div className="text-sm font-medium text-gray-500 mt-0.5">Calon Ketua & Wakil Ketua</div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-5 text-sm font-bold text-gray-700">
                      Paslon 0{kandidat.candidateNumber}
                    </td>
                    <td className="px-3 py-5 text-sm font-medium text-gray-500 max-w-xs truncate" title={kandidat.vision}>
                      {kandidat.vision}
                    </td>
                    <td className="whitespace-nowrap px-3 py-5">
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                        Aktif
                      </span>
                    </td>
                    <td className="relative whitespace-nowrap py-5 pl-3 pr-6 text-right text-sm font-medium">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => openEditModal(kandidat)}
                          className="rounded-xl px-3 py-1.5 font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(kandidat)}
                          className="rounded-xl px-3 py-1.5 font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                        >
                          Hapus
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">
                {editingCandidate ? "Edit Data Kandidat" : "Tambah Pasangan Calon"}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {errorMsg && (
              <div className="mb-4 p-4 rounded-2xl bg-red-50 text-red-600 text-sm font-semibold">
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Nomor Urut</label>
                <input
                  type="number"
                  required
                  min={1}
                  value={formData.candidate_number}
                  onChange={(e) => setFormData({ ...formData, candidate_number: Number(e.target.value) })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Nama Calon Ketua</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Rizky"
                  value={formData.chairman_name}
                  onChange={(e) => setFormData({ ...formData, chairman_name: e.target.value })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Nama Calon Wakil Ketua</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Budi Santoso"
                  value={formData.vice_chairman_name}
                  onChange={(e) => setFormData({ ...formData, vice_chairman_name: e.target.value })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Visi</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Visi pasangan calon..."
                  value={formData.vision}
                  onChange={(e) => setFormData({ ...formData, vision: e.target.value })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                ></textarea>
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Misi</label>
                <textarea
                  required
                  rows={3}
                  placeholder="1. Mengembangkan minat siswa..."
                  value={formData.mission}
                  onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                ></textarea>
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-3 rounded-2xl bg-indigo-600 text-sm font-bold text-white hover:bg-indigo-500 transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Menyimpan..." : "Simpan Kandidat"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
