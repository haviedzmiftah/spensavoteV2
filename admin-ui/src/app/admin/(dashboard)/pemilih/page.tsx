"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

interface User {
  id: number;
  username: string;
  role: string;
}

interface VoteLog {
  id: number;
  voteDate: string;
  user: {
    id: number;
    username: string;
    role: string;
  };
}

export default function PemilihPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [votedUserIds, setVotedUserIds] = useState<Set<number>>(new Set());
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkModalOpen, setIsBulkModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    role: "voters",
  });
  const [bulkInput, setBulkInput] = useState("");
  const [bulkDefaultPassword, setBulkDefaultPassword] = useState("123456");
  const [bulkResult, setBulkResult] = useState<{ message: string; isError: boolean } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const loadData = async () => {
    setLoading(true);
    const [usersRes, votesRes] = await Promise.all([
      apiFetch("/users"),
      apiFetch("/votes/admin/list"),
    ]);

    if (usersRes.success && Array.isArray(usersRes.data)) {
      setUsers(usersRes.data);
    }
    if (votesRes.success && Array.isArray(votesRes.data)) {
      const ids = new Set<number>(votesRes.data.map((v: VoteLog) => v.user.id));
      setVotedUserIds(ids);
    }
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const openBulkModal = () => {
    setBulkInput("");
    setBulkDefaultPassword("123456");
    setBulkResult(null);
    setIsBulkModalOpen(true);
  };

  const handleCsvFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setBulkInput(content);
      }
    };
    reader.readAsText(file);
  };

  const handleBulkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulkInput.trim()) {
      setBulkResult({ message: "Mohon masukkan data pemilih atau unggah file CSV", isError: true });
      return;
    }

    setSubmitting(true);
    setBulkResult(null);

    // Parsing baris input (bisa koma, titik koma, spasi, tab, atau format CSV)
    const lines = bulkInput.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
    const parsedVoters: Array<{ username: string; password: string; role: "voters" | "admin" }> = [];

    for (const line of lines) {
      // Lewati header CSV jika ada
      if (line.toLowerCase().startsWith("username") || line.toLowerCase().startsWith("nis")) {
        continue;
      }

      // Pemisah bisa berupa koma, titik koma, atau tab
      const parts = line.split(/[,;\t]+/).map((p) => p.trim().replace(/^["']|["']$/g, ""));
      const username = parts[0];
      const password = parts[1] || bulkDefaultPassword || "123456";
      const role = (parts[2]?.toLowerCase() === "admin" ? "admin" : "voters") as "voters" | "admin";

      if (username) {
        parsedVoters.push({
          username,
          password,
          role,
        });
      }
    }

    if (parsedVoters.length === 0) {
      setBulkResult({ message: "Tidak ada data username pemilih yang valid ditemukan", isError: true });
      setSubmitting(false);
      return;
    }

    const res = await apiFetch("/users/batch", {
      method: "POST",
      body: JSON.stringify({ voters: parsedVoters }),
    });

    setSubmitting(false);

    if (res.success) {
      setBulkResult({ message: res.message || `Berhasil mengimpor ${parsedVoters.length} akun pemilih!`, isError: false });
      loadData();
      setTimeout(() => {
        setIsBulkModalOpen(false);
      }, 1800);
    } else {
      setBulkResult({ message: res.message || "Gagal mengimpor data pemilih", isError: true });
    }
  };

  const openAddModal = () => {
    setEditingUser(null);
    setFormData({
      username: "",
      password: "",
      role: "voters",
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    setFormData({
      username: user.username,
      password: "", // leave empty to keep unchanged
      role: user.role,
    });
    setErrorMsg("");
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg("");

    const payload: any = {
      username: formData.username,
      role: formData.role,
    };
    if (formData.password) {
      payload.password = formData.password;
    }

    let res;
    if (editingUser) {
      res = await apiFetch(`/users/${editingUser.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
    } else {
      if (!formData.password) {
        setErrorMsg("Password wajib diisi untuk akun baru");
        setSubmitting(false);
        return;
      }
      res = await apiFetch("/users", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    setSubmitting(false);

    if (res.success) {
      setIsModalOpen(false);
      loadData();
    } else {
      setErrorMsg(res.message || "Gagal menyimpan data pengguna");
    }
  };

  const handleDelete = async (user: User) => {
    if (!confirm(`Apakah Anda yakin ingin menghapus akun '${user.username}'?`)) {
      return;
    }

    const res = await apiFetch(`/users/${user.id}`, {
      method: "DELETE",
    });

    if (res.success) {
      loadData();
    } else {
      alert(res.message || "Gagal menghapus user");
    }
  };

  const totalVotersCount = users.filter((u) => u.role === "voters").length;
  const alreadyVotedCount = users.filter((u) => u.role === "voters" && votedUserIds.has(u.id)).length;
  const notVotedCount = Math.max(0, totalVotersCount - alreadyVotedCount);

  const filteredUsers = users.filter((u) => {
    const q = search.toLowerCase();
    const matchSearch = u.username.toLowerCase().includes(q) || u.role.toLowerCase().includes(q);
    const matchRole = roleFilter === "all" || u.role === roleFilter;

    const hasVoted = votedUserIds.has(u.id);
    let matchStatus = true;
    if (statusFilter === "voted") matchStatus = hasVoted;
    if (statusFilter === "not_voted") matchStatus = !hasVoted;

    return matchSearch && matchRole && matchStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Manajemen Pemilih</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Kelola data daftar pemilih tetap (DPT) & Pengguna</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={openBulkModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white border border-gray-200 px-5 py-3 text-sm font-bold text-gray-700 shadow-sm hover:bg-gray-50 hover:border-gray-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import Pemilih Masal (CSV)
          </button>
          <button
            onClick={openAddModal}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 hover:shadow-indigo-300 transition-all active:scale-[0.98] cursor-pointer"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Akun / Pemilih
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Total Akun Pemilih</p>
            <h3 className="text-2xl font-black text-gray-800">{loading ? "..." : totalVotersCount.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Sudah Memilih</p>
            <h3 className="text-2xl font-black text-gray-800">{loading ? "..." : alreadyVotedCount.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-600">
            <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-500">Belum Memilih</p>
            <h3 className="text-2xl font-black text-gray-800">{loading ? "..." : notVotedCount.toLocaleString()}</h3>
          </div>
        </div>
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
              placeholder="Cari Username..."
              className="block w-full rounded-2xl border-0 py-3 pl-11 pr-4 text-gray-900 bg-gray-50/50 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-xl border-0 py-2.5 pl-4 pr-10 text-gray-700 bg-white ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm font-bold cursor-pointer"
            >
              <option value="all">Semua Role</option>
              <option value="voters">Voters (Pemilih)</option>
              <option value="admin">Admin</option>
            </select>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-xl border-0 py-2.5 pl-4 pr-10 text-gray-700 bg-white ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm font-bold cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="voted">Sudah Memilih</option>
              <option value="not_voted">Belum Memilih</option>
            </select>
            <button
              onClick={loadData}
              disabled={loading}
              className="inline-flex items-center justify-center p-2.5 rounded-xl bg-white text-gray-600 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 cursor-pointer"
            >
              <svg className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">ID</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Username</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Role</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status Vote</th>
                <th scope="col" className="relative py-4 pl-3 pr-6 text-right text-xs font-bold uppercase tracking-wider text-gray-500">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    Memuat data pemilih...
                  </td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-400 font-medium">
                    Tidak ada data yang cocok.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => {
                  const hasVoted = votedUserIds.has(user.id);
                  return (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="whitespace-nowrap py-4 pl-6 pr-3 text-sm font-semibold text-gray-400">
                        #{user.id}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-900">
                        {user.username}
                      </td>
                      <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold">
                        <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                          user.role === "admin" ? "bg-purple-50 text-purple-600 border border-purple-100" : "bg-gray-100 text-gray-600"
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-3 py-4">
                        {user.role === "admin" ? (
                          <span className="text-xs font-semibold text-gray-400">-</span>
                        ) : hasVoted ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                            Sudah Memilih
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600">
                            <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                            Belum Memilih
                          </span>
                        )}
                      </td>
                      <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => openEditModal(user)}
                            className="rounded-xl px-3 py-1.5 font-bold text-indigo-600 bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(user)}
                            className="rounded-xl px-3 py-1.5 font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Add / Edit User */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-gray-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-black text-gray-800">
                {editingUser ? "Edit Data Akun" : "Tambah Akun Baru"}
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
                <label className="text-xs font-bold text-gray-700 uppercase">Username</label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: siswa_10a_01"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">
                  Password {editingUser && <span className="text-gray-400 font-normal">(Kosongkan jika tidak diubah)</span>}
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-700 uppercase">Role Akun</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-bold"
                >
                  <option value="voters">Voters (Pemilih Siswa/Guru)</option>
                  <option value="admin">Administrator</option>
                </select>
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
                  {submitting ? "Menyimpan..." : "Simpan Akun"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Import Masal / Batch Upload */}
      {isBulkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-8 max-w-xl w-full shadow-2xl border border-gray-100 max-h-[90vh] overflow-y-auto space-y-6">
            <div className="flex justify-between items-start border-b border-gray-100 pb-4">
              <div>
                <h3 className="text-xl font-black text-gray-800">
                  Import Akun Pemilih Masal
                </h3>
                <p className="text-xs text-gray-500 font-medium mt-0.5">
                  Tambahkan ratusan akun pemilih sekaligus melalui file CSV atau tempel teks langsung.
                </p>
              </div>
              <button
                onClick={() => setIsBulkModalOpen(false)}
                className="p-2 rounded-xl text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors cursor-pointer"
              >
                ✕
              </button>
            </div>

            {bulkResult && (
              <div
                className={`p-4 rounded-2xl text-sm font-semibold flex items-center gap-3 ${
                  bulkResult.isError ? "bg-red-50 text-red-600 border border-red-200" : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                }`}
              >
                <span>{bulkResult.message}</span>
              </div>
            )}

            <form onSubmit={handleBulkSubmit} className="space-y-5">
              {/* File CSV Upload box */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1.5">
                  1. Unggah File CSV (Opsional)
                </label>
                <div className="relative border-2 border-dashed border-gray-200 hover:border-indigo-400 bg-gray-50/50 hover:bg-indigo-50/30 rounded-2xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors text-center">
                  <input
                    type="file"
                    accept=".csv,text/csv,text/plain"
                    onChange={handleCsvFileUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  <div className="h-10 w-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-1">
                    <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-xs font-bold text-gray-700">Pilih atau Seret File .CSV di sini</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">Format: username,password (atau cukup daftar username per baris)</p>
                </div>
              </div>

              {/* Text Input / Paste area */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-gray-700 uppercase">
                    2. Atau Tempel Data Pemilih (Teks / CSV)
                  </label>
                  <button
                    type="button"
                    onClick={() => setBulkInput("siswa_7a_01,pass123\nsiswa_7a_02,pass123\nsiswa_7a_03,pass123")}
                    className="text-[11px] font-bold text-indigo-600 hover:underline cursor-pointer"
                  >
                    Contoh Format
                  </button>
                </div>
                <textarea
                  rows={6}
                  required
                  value={bulkInput}
                  onChange={(e) => setBulkInput(e.target.value)}
                  placeholder={`Contoh format:\nsiswa_7a_01,pass123\nsiswa_7a_02,pass456\nsiswa_7a_03 (password otomatis default)`}
                  className="w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 font-mono text-xs ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 leading-relaxed"
                ></textarea>
                <p className="text-[11px] text-gray-400 mt-1">
                  * Satu baris per siswa. Jika password tidak ditulis, akan menggunakan password default di bawah.
                </p>
              </div>

              {/* Default Password Configuration */}
              <div>
                <label className="text-xs font-bold text-gray-700 uppercase block mb-1">
                  Password Default (Jika tidak dicantumkan di teks)
                </label>
                <input
                  type="text"
                  value={bulkDefaultPassword}
                  onChange={(e) => setBulkDefaultPassword(e.target.value)}
                  placeholder="123456"
                  className="w-full rounded-2xl border-0 bg-gray-50 px-4 py-3 text-gray-900 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-indigo-600 text-sm font-medium"
                />
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsBulkModalOpen(false)}
                  className="px-5 py-3 rounded-2xl bg-gray-100 text-sm font-bold text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold text-white shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 cursor-pointer"
                >
                  {submitting ? "Memproses Import..." : "Import Semua Pemilih"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

