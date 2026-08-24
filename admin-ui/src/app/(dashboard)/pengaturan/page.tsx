export default function PengaturanPage() {
  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-black text-gray-800 tracking-tight">Pengaturan Sistem</h2>
        <p className="text-sm font-medium text-gray-500 mt-1">Konfigurasi pemilu dan tindakan sistem tingkat lanjut</p>
      </div>

      {/* Umum */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Pengaturan Pemilu</h3>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-700">Status Pemungutan Suara</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">Buka atau tutup akses login bagi pemilih.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" defaultChecked />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-gray-50 pt-6">
            <div>
              <p className="font-bold text-gray-700">Visibilitas Hasil Live</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">Tampilkan hasil sementara di halaman publik pemilih.</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" className="sr-only peer" />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-emerald-500"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Keamanan */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
        <h3 className="text-lg font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4">Akun & Keamanan</h3>
        
        <form className="space-y-6 max-w-md">
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Password Lama</label>
            <input 
              type="password" 
              className="w-full rounded-2xl border-0 bg-gray-50 px-5 py-3.5 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-bold text-gray-700">Password Baru</label>
            <input 
              type="password" 
              className="w-full rounded-2xl border-0 bg-gray-50 px-5 py-3.5 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm transition-all"
            />
          </div>
          <button type="button" className="rounded-2xl bg-gray-900 px-5 py-3.5 text-sm font-bold text-white hover:bg-gray-800 transition-colors">
            Perbarui Password
          </button>
        </form>
      </div>

      {/* Danger Zone */}
      <div className="bg-red-50/50 rounded-3xl p-8 shadow-sm border border-red-100">
        <h3 className="text-lg font-bold text-red-600 mb-6 border-b border-red-200 pb-4">Zona Berbahaya (Danger Zone)</h3>
        
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-bold text-gray-800">Reset Seluruh Data Suara</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">Menghapus semua data voting yang sudah masuk. <strong className="text-red-500">Tindakan ini tidak dapat dibatalkan.</strong></p>
            </div>
            <button className="whitespace-nowrap rounded-2xl bg-white px-5 py-3 text-sm font-bold text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-50 hover:ring-red-300 transition-colors">
              Reset Suara
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-red-100 pt-6">
            <div>
              <p className="font-bold text-gray-800">Hapus Seluruh Data Pemilih</p>
              <p className="text-sm font-medium text-gray-500 mt-0.5">Menghapus seluruh daftar pemilih (DPT) dari database.</p>
            </div>
            <button className="whitespace-nowrap rounded-2xl bg-white px-5 py-3 text-sm font-bold text-red-600 ring-1 ring-inset ring-red-200 hover:bg-red-50 hover:ring-red-300 transition-colors">
              Hapus Pemilih
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
