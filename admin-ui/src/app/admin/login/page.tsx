"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiFetch, setAuthSession } from "@/lib/api";

export default function AdminLoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setErrorMessage("Mohon isi username dan password");
      return;
    }

    setIsLoading(true);
    setErrorMessage("");

    const response = await apiFetch("/auth/login/admin", {
      method: "POST",
      body: JSON.stringify({ username, password }),
      requiresAuth: false,
      authType: "admin",
    });

    setIsLoading(false);

    if (response.success && response.token) {
      setAuthSession(response.token, response.user);
      router.push("/admin");
      router.refresh();
    } else {
      setErrorMessage(response.message || "Gagal masuk. Periksa kembali kredensial Anda.");
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gray-50 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] p-4">
      <div className="w-full max-w-md p-8 bg-white/80 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
        <div className="text-center mb-8">
          <Link
            href="/"
            title="Kembali ke Beranda"
            className="group inline-flex flex-col items-center focus:outline-none"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200 mb-4 transition-transform duration-200 group-hover:scale-105 group-active:scale-95">
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600 tracking-tight mb-2 group-hover:opacity-90 transition-opacity">
              SPENSAVOTE Admin
            </h1>
          </Link>
          <p className="text-gray-500 font-medium">Masuk untuk mengelola sistem e-voting</p>
        </div>




        {errorMessage && (
          <div className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-200 text-red-600 text-sm font-semibold flex items-center gap-3">
            <svg className="h-5 w-5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{errorMessage}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700 ml-1">Username Admin</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin_sekolah"
              required
              className="w-full rounded-2xl border-0 bg-gray-50/50 px-5 py-4 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between ml-1">
              <label className="text-sm font-bold text-gray-700">Password</label>
            </div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-2xl border-0 bg-gray-50/50 px-5 py-4 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="mt-8 flex w-full justify-center items-center gap-2 rounded-2xl bg-indigo-600 px-3 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 hover:shadow-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
                <span>Memproses...</span>
              </>
            ) : (
              "Masuk ke Dashboard"
            )}
          </button>
        </form>
      </div>

    </div>
  );
}
