export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* KPI Cards */}
        {[
          { label: 'Total Pemilih', value: '1,240', sub: '+12% dari target', color: 'from-blue-500 to-blue-600' },
          { label: 'Suara Masuk', value: '984', sub: '79.3% partisipasi', color: 'from-emerald-500 to-emerald-600' },
          { label: 'Kandidat Aktif', value: '3', sub: 'Semua divalidasi', color: 'from-purple-500 to-purple-600' },
          { label: 'Status Sistem', value: 'Aman', sub: 'Tidak ada anomali', color: 'from-indigo-500 to-indigo-600' },
        ].map((kpi, i) => (
          <div key={i} className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
              <p className="text-sm font-semibold text-gray-500">{kpi.label}</p>
              <div className={`h-10 w-10 rounded-2xl bg-gradient-to-tr ${kpi.color} opacity-20`}></div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-gray-800 tracking-tight">{kpi.value}</h3>
              <p className="text-xs font-medium text-gray-400 mt-2">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-gray-800">Tren Pemungutan Suara</h3>
            <button className="text-sm font-bold text-indigo-600 hover:text-indigo-700">Lihat Detail</button>
          </div>
          <div className="h-64 flex items-end justify-between gap-2">
            {/* Dummy Chart */}
            {[40, 70, 45, 90, 65, 85, 100, 60, 80, 50, 75, 95].map((h, i) => (
              <div key={i} className="w-full bg-indigo-50 rounded-t-lg relative group">
                <div 
                  className="absolute bottom-0 w-full bg-gradient-to-t from-indigo-600 to-purple-500 rounded-t-lg transition-all duration-500 group-hover:from-indigo-500 group-hover:to-purple-400"
                  style={{ height: `${h}%` }}
                ></div>
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-4 text-xs font-semibold text-gray-400">
            <span>08:00</span>
            <span>10:00</span>
            <span>12:00</span>
            <span>14:00</span>
            <span>16:00</span>
          </div>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Log Aktivitas Terbaru</h3>
          <div className="space-y-6">
            {[
              { time: '10 menit yang lalu', text: 'Pemilih Budi M. berhasil login', type: 'login' },
              { time: '15 menit yang lalu', text: 'Admin menambahkan 50 daftar pemilih', type: 'system' },
              { time: '1 jam yang lalu', text: 'Sesi pemungutan suara dimulai', type: 'alert' },
              { time: '2 jam yang lalu', text: 'Sistem di-restart oleh Admin', type: 'system' },
            ].map((log, i) => (
              <div key={i} className="flex gap-4">
                <div className="relative mt-1 flex h-3 w-3 flex-none items-center justify-center">
                  <div className={`h-2.5 w-2.5 rounded-full ring-4 ring-white ${log.type === 'alert' ? 'bg-red-500' : log.type === 'system' ? 'bg-indigo-500' : 'bg-emerald-500'}`}></div>
                </div>
                <div className="flex-auto">
                  <p className="text-sm font-medium text-gray-700">{log.text}</p>
                  <p className="text-xs font-semibold text-gray-400 mt-1">{log.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
