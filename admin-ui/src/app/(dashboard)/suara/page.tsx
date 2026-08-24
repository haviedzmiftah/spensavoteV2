export default function SuaraPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Monitoring Suara</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Pantau hasil perolehan suara secara real-time</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
            </svg>
            Export Laporan
          </button>
          <div className="inline-flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-50 border border-emerald-100">
             <span className="relative flex h-3 w-3">
               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
               <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
             </span>
             <span className="text-sm font-bold text-emerald-600">Live Updates</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Card */}
        <div className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
          <h3 className="text-lg font-bold text-gray-800 mb-2">Perolehan Suara Sementara</h3>
          <p className="text-sm text-gray-500 font-medium mb-8">Berdasarkan 984 suara yang sudah masuk (79.3%)</p>
          
          <div className="flex-1 flex flex-col justify-center gap-8">
             {[
               { id: 1, name: 'Andi & Budi', votes: 450, percent: 45.7, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50' },
               { id: 2, name: 'Citra & Dian', votes: 320, percent: 32.5, color: 'from-emerald-500 to-emerald-600', bg: 'bg-emerald-50' },
               { id: 3, name: 'Eka & Fajar', votes: 214, percent: 21.8, color: 'from-amber-500 to-amber-600', bg: 'bg-amber-50' },
             ].map((kandidat) => (
               <div key={kandidat.id}>
                 <div className="flex justify-between items-end mb-2">
                   <div className="flex items-center gap-3">
                      <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center font-bold text-gray-600 text-sm">
                         0{kandidat.id}
                      </div>
                      <span className="font-bold text-gray-800 text-lg">{kandidat.name}</span>
                   </div>
                   <div className="text-right">
                      <span className="font-black text-2xl text-gray-900">{kandidat.votes}</span>
                      <span className="text-sm font-bold text-gray-500 ml-1">suara</span>
                   </div>
                 </div>
                 <div className={`w-full h-4 ${kandidat.bg} rounded-full overflow-hidden`}>
                   <div 
                     className={`h-full rounded-full bg-gradient-to-r ${kandidat.color} transition-all duration-1000 ease-out`}
                     style={{ width: `${kandidat.percent}%` }}
                   ></div>
                 </div>
                 <div className="mt-1 flex justify-end">
                    <span className="text-sm font-bold text-gray-600">{kandidat.percent}%</span>
                 </div>
               </div>
             ))}
          </div>
        </div>

        {/* Info & Log Card */}
        <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 flex flex-col">
           <h3 className="text-lg font-bold text-gray-800 mb-6">Statistik Voting</h3>
           
           <div className="space-y-4 mb-8">
              <div className="flex justify-between items-center p-4 rounded-2xl bg-gray-50/50 border border-gray-100">
                 <span className="text-sm font-bold text-gray-600">Total DPT</span>
                 <span className="text-lg font-black text-gray-900">1,240</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-indigo-50/50 border border-indigo-100">
                 <span className="text-sm font-bold text-indigo-600">Suara Sah</span>
                 <span className="text-lg font-black text-indigo-900">984</span>
              </div>
              <div className="flex justify-between items-center p-4 rounded-2xl bg-red-50/50 border border-red-100">
                 <span className="text-sm font-bold text-red-600">Golput / Belum Vote</span>
                 <span className="text-lg font-black text-red-900">256</span>
              </div>
           </div>

           <h3 className="text-md font-bold text-gray-800 mb-4">Aktivitas Suara Terbaru</h3>
           <div className="flex-1 overflow-y-auto space-y-4 pr-2">
              {[
                 { id: '100123', class: '9A', time: 'Baru saja' },
                 { id: '100456', class: '8C', time: '2 mnt lalu' },
                 { id: '100789', class: '7B', time: '5 mnt lalu' },
                 { id: '100321', class: '9D', time: '12 mnt lalu' },
                 { id: '100654', class: '8A', time: '15 mnt lalu' },
              ].map((log, i) => (
                 <div key={i} className="flex justify-between items-center pb-3 border-b border-gray-50 last:border-0">
                    <div>
                       <p className="text-sm font-bold text-gray-700">NIS: {log.id}</p>
                       <p className="text-xs font-semibold text-gray-400">Kelas {log.class}</p>
                    </div>
                    <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">{log.time}</span>
                 </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
}
