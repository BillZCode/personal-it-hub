import { Link, useNavigate } from 'react-router-dom';
import { useDocumentTitle } from '../../hooks';
import { Home, HardDrive, Terminal, BookOpen, ArrowLeft, Search } from 'lucide-react';
import { useState } from 'react';

export function NotFound() {
  useDocumentTitle('404 - Halaman Tidak Ditemukan');
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/notes?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="max-w-xl w-full">
        <div className="rounded-3xl bg-[#0D101A] border border-white/[0.08] shadow-nocturneCard overflow-hidden">
          {/* Top Nocturne Window Header */}
          <div className="bg-[#080A10] px-5 py-3 border-b border-white/[0.06] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#F26676]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#F7C95C]/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#4ED69E]/80" />
              </div>
              <span className="text-[11px] font-mono text-[#8E9AB5] ml-2">
                SYSTEM // ROUTE_NOT_FOUND
              </span>
            </div>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F26676]/15 border border-[#F26676]/40 text-[10px] font-mono text-[#F26676]">
              HTTP 404
            </span>
          </div>

          <div className="p-8 sm:p-10 text-center space-y-6">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#F26676]/15 border border-[#F26676]/40 text-[#F26676] font-mono text-xs tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F26676] animate-ping" />
                Error: 404 Route Not Found
              </div>
              <h1 className="text-6xl sm:text-7xl font-display font-medium text-[#F4F3F8] tracking-tight">
                404
              </h1>
              <h2 className="text-xl sm:text-2xl font-display font-medium text-[#D2D8F0] italic tracking-tight">
                Halaman Tidak Ditemukan
              </h2>
              <p className="text-[#8E9AB5] text-sm max-w-md mx-auto leading-relaxed">
                Rute atau sumber daya yang Anda tuju tidak tersedia, telah dipindahkan, atau nama
                file mengalami perubahan pada repositori server.
              </p>
            </div>

            {/* Quick Search Bar */}
            <form
              onSubmit={handleSearch}
              role="search"
              aria-label="Pencarian Cepat 404"
              className="relative max-w-md mx-auto"
            >
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari dokumentasi atau catatan teknis..."
                aria-label="Cari dokumentasi atau catatan teknis"
                className="w-full px-4 py-3 pl-10 text-xs font-mono bg-[#080A10] text-[#F4F3F8] border border-white/10 rounded-full focus:outline-none focus:border-[#5B8DEF] transition-all placeholder:text-[#5E687E]"
              />
              <Search
                className="w-4 h-4 text-[#8E9AB5] absolute left-3.5 top-1/2 -translate-y-1/2"
                aria-hidden="true"
              />
              <button
                type="submit"
                aria-label="Kirim pencarian"
                className="absolute right-1.5 top-1.5 px-4 py-1.5 bg-[#F4F3F8] text-[#080A10] rounded-full text-xs font-sans font-semibold hover:bg-white transition-colors cursor-pointer"
              >
                Cari
              </button>
            </form>

            {/* Quick Destination Cards */}
            <div className="pt-2">
              <p className="text-[11px] font-mono uppercase tracking-wider text-[#5E687E] mb-3">
                Tautan Populer
              </p>
              <div
                role="list"
                aria-label="Daftar tautan populer"
                className="grid grid-cols-2 sm:grid-cols-4 gap-2.5"
              >
                <Link
                  to="/"
                  role="listitem"
                  className="p-3.5 rounded-2xl bg-[#080A10] border border-white/[0.08] hover:border-white/25 transition-all text-center group"
                >
                  <Home
                    className="w-5 h-5 text-[#4ED69E] mx-auto mb-1.5 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-mono text-[#F4F3F8] block truncate">Home</span>
                </Link>
                <Link
                  to="/drive"
                  role="listitem"
                  className="p-3.5 rounded-2xl bg-[#080A10] border border-white/[0.08] hover:border-white/25 transition-all text-center group"
                >
                  <HardDrive
                    className="w-5 h-5 text-[#5B8DEF] mx-auto mb-1.5 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-mono text-[#F4F3F8] block truncate">
                    Cloud Drive
                  </span>
                </Link>
                <Link
                  to="/notes"
                  role="listitem"
                  className="p-3.5 rounded-2xl bg-[#080A10] border border-white/[0.08] hover:border-white/25 transition-all text-center group"
                >
                  <BookOpen
                    className="w-5 h-5 text-[#F7C95C] mx-auto mb-1.5 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-mono text-[#F4F3F8] block truncate">Notes</span>
                </Link>
                <Link
                  to="/tools"
                  role="listitem"
                  className="p-3.5 rounded-2xl bg-[#080A10] border border-white/[0.08] hover:border-white/25 transition-all text-center group"
                >
                  <Terminal
                    className="w-5 h-5 text-[#F26676] mx-auto mb-1.5 group-hover:scale-110 transition-transform"
                    aria-hidden="true"
                  />
                  <span className="text-xs font-mono text-[#F4F3F8] block truncate">
                    Dev Tools
                  </span>
                </Link>
              </div>
            </div>

            <div className="pt-2 flex justify-center">
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="px-5 py-2 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 text-xs font-mono flex items-center gap-2 text-[#D2D8F0] hover:text-white transition-all"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                <span>Kembali ke Halaman Sebelumnya</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
