export default function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between bg-white/80 backdrop-blur-md px-8 shadow-sm border-b border-gray-100/50 sticky top-0 z-20">
      <div className="flex items-center gap-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Dashboard</h2>
          <p className="text-sm text-gray-500 font-medium">Ringkasan pemilihan saat ini</p>
        </div>
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
          <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">Voting Aktif</span>
        </div>
        <div className="flex items-center gap-3 pl-6 border-l border-gray-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-gray-100 to-gray-200 shadow-sm border border-gray-200">
            <span className="text-sm font-bold text-gray-600">AD</span>
          </div>
          <div>
            <p className="text-sm font-bold text-gray-700">Administrator</p>
            <p className="text-xs text-gray-500 font-medium">Super Admin</p>
          </div>
        </div>
      </div>
    </header>
  );
}
