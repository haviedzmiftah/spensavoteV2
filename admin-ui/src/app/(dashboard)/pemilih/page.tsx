export default function PemilihPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Manajemen Pemilih</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Kelola data daftar pemilih tetap (DPT)</p>
        </div>
        <div className="flex gap-3">
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-5 py-3 text-sm font-bold text-gray-700 ring-1 ring-inset ring-gray-200 shadow-sm hover:bg-gray-50 transition-all active:scale-[0.98]">
            <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
            </svg>
            Import CSV
          </button>
          <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 hover:shadow-indigo-300 transition-all active:scale-[0.98]">
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Tambah Pemilih
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
               <p className="text-sm font-bold text-gray-500">Total Pemilih</p>
               <h3 className="text-2xl font-black text-gray-800">1,240</h3>
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
               <h3 className="text-2xl font-black text-gray-800">984</h3>
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
               <h3 className="text-2xl font-black text-gray-800">256</h3>
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
              placeholder="Cari NIS atau Nama..." 
              className="block w-full rounded-2xl border-0 py-3 pl-11 pr-4 text-gray-900 bg-gray-50/50 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
             <select className="rounded-xl border-0 py-2.5 pl-4 pr-10 text-gray-700 bg-white ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm font-bold cursor-pointer">
               <option>Semua Kelas</option>
               <option>Kelas 7</option>
               <option>Kelas 8</option>
               <option>Kelas 9</option>
             </select>
             <select className="rounded-xl border-0 py-2.5 pl-4 pr-10 text-gray-700 bg-white ring-1 ring-inset ring-gray-200 focus:ring-2 focus:ring-indigo-600 sm:text-sm font-bold cursor-pointer">
               <option>Semua Status</option>
               <option>Sudah Memilih</option>
               <option>Belum Memilih</option>
             </select>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Nama Pemilih</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">NIS</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Kelas</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status Vote</th>
                <th scope="col" className="relative py-4 pl-3 pr-6">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {[
                { id: 1, name: 'Ahmad Faisal', nis: '100123', kelas: '9A', status: 'Sudah Memilih', votedAt: '09:12 AM' },
                { id: 2, name: 'Bunga Lestari', nis: '100124', kelas: '9A', status: 'Belum Memilih', votedAt: null },
                { id: 3, name: 'Candra Wijaya', nis: '100125', kelas: '8B', status: 'Sudah Memilih', votedAt: '10:45 AM' },
                { id: 4, name: 'Diana Putri', nis: '100126', kelas: '7C', status: 'Belum Memilih', votedAt: null },
              ].map((pemilih) => (
                <tr key={pemilih.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="whitespace-nowrap py-4 pl-6 pr-3">
                    <div className="font-bold text-gray-900">{pemilih.name}</div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-semibold text-gray-600">
                    {pemilih.nis}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4 text-sm font-bold text-gray-700">
                    {pemilih.kelas}
                  </td>
                  <td className="whitespace-nowrap px-3 py-4">
                    {pemilih.status === 'Sudah Memilih' ? (
                        <div className="flex flex-col">
                           <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-600 w-fit">
                              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                              {pemilih.status}
                           </span>
                           <span className="text-xs text-gray-400 font-medium mt-1 ml-1">{pemilih.votedAt}</span>
                        </div>
                    ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-600 w-fit">
                           <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>
                           {pemilih.status}
                        </span>
                    )}
                  </td>
                  <td className="relative whitespace-nowrap py-4 pl-3 pr-6 text-right text-sm font-medium">
                    <div className="flex justify-end gap-2">
                      <button className="rounded-xl p-2 text-indigo-600 hover:bg-indigo-50 transition-colors">
                        Edit
                      </button>
                      <button className="rounded-xl p-2 text-red-600 hover:bg-red-50 transition-colors">
                        Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination Dummy */}
        <div className="border-t border-gray-100 px-6 py-4 flex items-center justify-between">
          <p className="text-sm font-medium text-gray-500">
            Menampilkan <span className="font-bold text-gray-900">1</span> ke <span className="font-bold text-gray-900">4</span> dari <span className="font-bold text-gray-900">1,240</span> pemilih
          </p>
          <div className="flex gap-2">
            <button disabled className="rounded-xl px-3 py-2 text-sm font-bold text-gray-400 bg-gray-50 cursor-not-allowed">
              Sebelumnya
            </button>
            <button className="rounded-xl px-3 py-2 text-sm font-bold text-gray-700 bg-white ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
