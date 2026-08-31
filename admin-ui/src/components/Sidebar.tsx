"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { clearAuthSession } from "@/lib/api";

const navigation = [
  { name: "Dashboard", href: "/", icon: "home" },
  { name: "Kandidat", href: "/kandidat", icon: "users" },
  { name: "Pemilih", href: "/pemilih", icon: "user-check" },
  { name: "Suara (Real-time)", href: "/suara", icon: "bar-chart-2" },
  { name: "Pengaturan", href: "/pengaturan", icon: "settings" },
];

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = () => {
    clearAuthSession();
    router.push("/login");
    router.refresh();
  };

  return (
    <div className="flex h-full w-72 flex-col bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-gray-100 z-10">
      <div className="flex h-20 items-center justify-center border-b border-gray-100/50 px-6">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-200">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600 tracking-tight">SPENSAVOTE</h1>
        </div>
      </div>
      <nav className="flex-1 space-y-2 px-4 py-8 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`group flex items-center rounded-2xl px-4 py-3.5 text-sm font-semibold transition-all duration-300 ${
                isActive
                  ? "bg-indigo-50 text-indigo-600 font-bold shadow-sm"
                  : "text-gray-500 hover:bg-indigo-50/50 hover:text-indigo-600"
              }`}
            >
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-colors mr-3 shadow-sm ${
                  isActive
                    ? "bg-indigo-600 text-white shadow-indigo-100"
                    : "bg-gray-50 text-gray-400 group-hover:bg-indigo-100 group-hover:text-indigo-600"
                }`}
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </div>
              {item.name}
            </Link>
          );
        })}
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="flex w-full items-center justify-center gap-2 rounded-2xl bg-red-50/80 px-4 py-3.5 text-sm font-bold text-red-600 hover:bg-red-100 transition-colors shadow-sm active:scale-[0.98]"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
          <span>Keluar</span>
        </button>
      </div>
    </div>
  );
}
