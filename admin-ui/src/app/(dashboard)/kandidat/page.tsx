export default function KandidatPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-800 tracking-tight">Manajemen Kandidat</h2>
          <p className="text-sm font-medium text-gray-500 mt-1">Kelola data calon ketua dan wakil ketua OSIS</p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 hover:shadow-indigo-300 transition-all active:scale-[0.98]">
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
              placeholder="Cari kandidat..." 
              className="block w-full rounded-2xl border-0 py-3 pl-11 pr-4 text-gray-900 bg-gray-50/50 ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-4 py-2.5 text-sm font-bold text-gray-700 ring-1 ring-inset ring-gray-200 hover:bg-gray-50 transition-colors">
              <svg className="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              Filter
            </button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-100">
            <thead className="bg-gray-50/50">
              <tr>
                <th scope="col" className="py-4 pl-6 pr-3 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Kandidat</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Nomor Urut</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Visi Misi Singkat</th>
                <th scope="col" className="px-3 py-4 text-left text-xs font-bold uppercase tracking-wider text-gray-500">Status</th>
                <th scope="col" className="relative py-4 pl-3 pr-6">
                  <span className="sr-only">Aksi</span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {[
                { id: 1, name: 'Andi & Budi', no: '01', visi: 'Memajukan sekolah dengan teknologi', status: 'Aktif' },
                { id: 2, name: 'Citra & Dian', no: '02', visi: 'Sekolah hijau dan berprestasi', status: 'Aktif' },
                { id: 3, name: 'Eka & Fajar', no: '03', visi: 'Kreativitas tanpa batas', status: 'Aktif' },
              ].map((kandidat) => (
                <tr key={kandidat.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="whitespace-nowrap py-5 pl-6 pr-3">
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 flex-shrink-0 rounded-2xl bg-gradient-to-tr from-indigo-100 to-purple-100 border border-indigo-50 flex items-center justify-center">
                        <span className="text-indigo-600 font-bold text-lg">{kandidat.no}</span>
                      </div>
                      <div>
                        <div className="font-bold text-gray-900">{kandidat.name}</div>
                        <div className="text-sm font-medium text-gray-500 mt-0.5">Kelas 8A & 8B</div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-3 py-5 text-sm font-bold text-gray-700">
                    Paslon {kandidat.no}
                  </td>
                  <td className="px-3 py-5 text-sm font-medium text-gray-500 max-w-xs truncate">
                    {kandidat.visi}
                  </td>
                  <td className="whitespace-nowrap px-3 py-5">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-bold text-emerald-600 border border-emerald-100">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                      {kandidat.status}
                    </span>
                  </td>
                  <td className="relative whitespace-nowrap py-5 pl-3 pr-6 text-right text-sm font-medium">
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
            Menampilkan <span className="font-bold text-gray-900">1</span> ke <span className="font-bold text-gray-900">3</span> dari <span className="font-bold text-gray-900">3</span> kandidat
          </p>
          <div className="flex gap-2">
            <button disabled className="rounded-xl px-3 py-2 text-sm font-bold text-gray-400 bg-gray-50 cursor-not-allowed">
              Sebelumnya
            </button>
            <button disabled className="rounded-xl px-3 py-2 text-sm font-bold text-gray-400 bg-gray-50 cursor-not-allowed">
              Selanjutnya
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
