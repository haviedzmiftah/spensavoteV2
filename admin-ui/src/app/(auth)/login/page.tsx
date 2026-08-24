export default function LoginPage() {
  return (
    <div className="w-full max-w-md p-8 bg-white/70 backdrop-blur-xl rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-white/50">
      <div className="text-center mb-10">
        <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-200 mb-6">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-900 to-indigo-600 tracking-tight mb-2">
          SPENSAVOTE Admin
        </h1>
        <p className="text-gray-500 font-medium">Masuk untuk mengelola sistem e-voting</p>
      </div>

      <form className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-bold text-gray-700 ml-1">Email / Username</label>
          <input 
            type="text" 
            placeholder="admin@spensavote.id"
            className="w-full rounded-2xl border-0 bg-gray-50/50 px-5 py-4 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-sm font-bold text-gray-700">Password</label>
          </div>
          <input 
            type="password" 
            placeholder="••••••••"
            className="w-full rounded-2xl border-0 bg-gray-50/50 px-5 py-4 text-gray-900 shadow-inner ring-1 ring-inset ring-gray-200 focus:bg-white focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 transition-all"
          />
        </div>

        <button 
          type="button" 
          className="mt-8 flex w-full justify-center rounded-2xl bg-indigo-600 px-3 py-4 text-sm font-bold text-white shadow-lg shadow-indigo-200 hover:bg-indigo-500 hover:shadow-indigo-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 transition-all active:scale-[0.98]"
        >
          Masuk ke Dashboard
        </button>
      </form>
    </div>
  );
}
