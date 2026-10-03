import { Link, useNavigate } from 'react-router-dom';
import { Card, Button } from '../../components/ui';
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
        {/* Double-bezel outer card */}
        <div className="rounded-3xl p-1 bg-gradient-to-b from-dark-700/60 via-dark-800/40 to-dark-900/80 shadow-2xl">
          <Card className="p-8 sm:p-10 bg-dark-950/95 border-dark-700/60 rounded-[22px] backdrop-blur-xl text-center space-y-6">
            {/* Cyberpunk Glitch / 404 Header */}
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 font-mono text-2xs tracking-widest uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                Error: 404 Route Not Found
              </div>
              <h1 className="text-6xl sm:text-7xl font-mono font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 tracking-tight">
                404
              </h1>
              <h2 className="text-xl sm:text-2xl font-bold text-dark-100 font-sans tracking-tight">
                Halaman Tidak Ditemukan
              </h2>
              <p className="text-dark-400 text-sm max-w-md mx-auto leading-relaxed">
                Rute atau sumber daya yang Anda tuju tidak tersedia, telah dipindahkan, atau nama file mengalami perubahan pada repositori server.
              </p>
            </div>

            {/* Quick Search Bar */}
            <form onSubmit={handleSearch} role="search" aria-label="Pencarian Cepat 404" className="relative max-w-md mx-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari dokumentasi atau catatan teknis..."
                aria-label="Cari dokumentasi atau catatan teknis"
                className="w-full px-4 py-2.5 pl-10 text-xs font-mono bg-dark-900/80 text-dark-100 border border-dark-700 rounded-xl focus:outline-none focus:border-amber-500/60 focus:ring-1 focus:ring-amber-500/30 transition-all placeholder:text-dark-500"
              />
              <Search className="w-4 h-4 text-dark-400 absolute left-3 top-3" aria-hidden="true" />
              <button
                type="submit"
                aria-label="Kirim pencarian"
                className="absolute right-1.5 top-1.5 px-3 py-1 bg-amber-500/15 text-amber-400 border border-amber-500/30 rounded-lg text-2xs font-mono hover:bg-amber-500/25 transition-colors cursor-pointer"
              >
                Cari
              </button>
            </form>

            {/* Quick Destination Cards */}
            <div className="pt-2">
              <p className="text-2xs font-mono uppercase tracking-wider text-dark-500 mb-3">Tautan Populer</p>
              <div role="list" aria-label="Daftar tautan populer" className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <Link
                  to="/"
                  role="listitem"
                  className="p-3 rounded-xl bg-dark-900/60 border border-dark-800 hover:border-amber-500/40 hover:bg-dark-900 transition-all text-center group"
                >
                  <Home className="w-5 h-5 text-amber-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-mono text-dark-200 block truncate">Home</span>
                </Link>
                <Link
                  to="/drive"
                  role="listitem"
                  className="p-3 rounded-xl bg-dark-900/60 border border-dark-800 hover:border-amber-500/40 hover:bg-dark-900 transition-all text-center group"
                >
                  <HardDrive className="w-5 h-5 text-cyan-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-mono text-dark-200 block truncate">Cloud Drive</span>
                </Link>
                <Link
                  to="/notes"
                  role="listitem"
                  className="p-3 rounded-xl bg-dark-900/60 border border-dark-800 hover:border-amber-500/40 hover:bg-dark-900 transition-all text-center group"
                >
                  <BookOpen className="w-5 h-5 text-yellow-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-mono text-dark-200 block truncate">Notes</span>
                </Link>
                <Link
                  to="/tools"
                  role="listitem"
                  className="p-3 rounded-xl bg-dark-900/60 border border-dark-800 hover:border-amber-500/40 hover:bg-dark-900 transition-all text-center group"
                >
                  <Terminal className="w-5 h-5 text-purple-400 mx-auto mb-1.5 group-hover:scale-110 transition-transform" aria-hidden="true" />
                  <span className="text-xs font-mono text-dark-200 block truncate">Dev Tools</span>
                </Link>
              </div>
            </div>

            {/* Back CTA */}
            <div className="pt-2 flex justify-center gap-3">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="text-xs font-mono flex items-center gap-2 text-dark-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4" aria-hidden="true" />
                Kembali ke Halaman Sebelumnya
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
