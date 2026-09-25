import { Card, Badge } from '../../components/ui';
import { Gamepad2, Music, Film, Tv, Star, Calendar } from 'lucide-react';
import { cn, formatRelativeTime } from '../../utils';

const currentlyPlaying = [
  { title: 'Strinova', platform: 'PC (Steam / Client)', status: 'Playing', lastPlayed: '2026-09-08', cover: '/images/personal/strinova.png', progress: 75, rating: 4.8 },
  { title: 'Arknights: Endfield', platform: 'PC / Mobile', status: 'Playing', lastPlayed: '2026-09-07', cover: '/images/personal/endfield.png', progress: 60, rating: 5 },
  { title: 'Ananta / Project Mugen', platform: 'PC / Mobile', status: 'Plan to Play', lastPlayed: null, cover: '/images/personal/ananta.png', progress: 0, rating: 0 },
];

const currentlyListening = [
  { title: 'meant to be', artist: 'cuntsniffer', album: 'Single', status: 'Now Playing', cover: '/images/personal/meant_to_be.jpg' },
  { title: 'Avid', artist: 'Sawano Hiroyuki (nZk)', album: '86 EIGHTY-SIX OST', status: 'Recent', cover: '/images/personal/sawano_avid.png' },
  { title: 'Little Dark Age', artist: 'MGMT', album: 'Little Dark Age', status: 'Recent', cover: '/images/personal/little_dark_age.png' },
];

const animeMovies = [
  { title: 'Neon Genesis Evangelion', type: 'Anime', cover: '/images/personal/evangelion.jpg', status: 'Completed', rating: 5, episodes: 26, progress: 26 },
  { title: 'Bukiyou na Senpai', type: 'Anime', cover: '/images/personal/bukiyou_senpai.png', status: 'Watching', rating: 4.5, episodes: 12, progress: 8 },
  { title: 'Interstellar', type: 'Movie', cover: '/images/personal/interstellar.png', status: 'Completed', rating: 5, progress: 1 },
  { title: 'Obsession', type: 'Movie', cover: '/images/personal/obsession.png', status: 'Completed', rating: 4.5, progress: 1 },
];

const statusBadgeVariant: Record<string, 'success' | 'info' | 'warning' | 'neutral' | 'primary'> = {
  Playing: 'success',
  Completed: 'info',
  'Plan to Play': 'neutral',
  'Now Playing': 'success',
  Recent: 'info',
  Playlist: 'primary',
  Watching: 'warning',
  'Plan to Watch': 'neutral',
};

export function Personal() {
  return (
    <div className="max-w-7xl mx-auto space-y-10 animate-in pb-16">
      <div className="border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl font-bold text-dark-100 tracking-tight font-sans">Personal</h1>
        <p className="text-dark-400 text-sm mt-1">Currently playing, listening, and watching outside engineering</p>
      </div>

      {/* Currently Playing */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Gamepad2 className="h-5 w-5 text-emerald-400" />
          Currently Playing
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentlyPlaying.map((game, i) => (
            <Card key={i} className="p-4 card-hover bg-dark-900/60 border border-dark-800">
              <div className="flex items-start gap-4">
                <div className="w-24 h-32 bg-dark-950 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-dark-750 shadow-md">
                  {game.cover ? (
                    <img src={game.cover} alt={game.title} className="w-full h-full object-cover" />
                  ) : (
                    <Gamepad2 className="h-10 w-10 text-dark-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark-100 truncate text-base">{game.title}</h3>
                  <p className="text-dark-400 text-xs font-mono">{game.platform}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={statusBadgeVariant[game.status] || 'neutral'} className="text-2xs" dot>
                      {game.status}
                    </Badge>
                    {game.progress > 0 && <span className="text-2xs text-dark-400 font-mono">{game.progress}% complete</span>}
                  </div>
                  {game.lastPlayed && <p className="text-2xs text-dark-500 mt-1 font-mono">Last played: {formatRelativeTime(game.lastPlayed)}</p>}
                  {game.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={cn('h-3.5 w-3.5', idx < Math.floor(game.rating) ? 'text-yellow-400 fill-current' : 'text-dark-600')} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Currently Listening */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Music className="h-5 w-5 text-cyan-400" />
          Currently Listening
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentlyListening.map((track, i) => (
            <Card key={i} className="p-4 bg-dark-900/60 border border-dark-800 card-hover">
              <div className="flex items-center gap-4">
                {track.cover ? (
                  <div className="w-14 h-14 rounded-lg overflow-hidden border border-dark-750 bg-dark-950 flex-shrink-0 shadow-md">
                    <img src={track.cover} alt={track.title} className="w-full h-full object-cover" />
                  </div>
                ) : (
                  <div className="w-14 h-14 bg-dark-850 rounded-lg flex items-center justify-center flex-shrink-0 border border-dark-750">
                    <Music className="h-6 w-6 text-dark-500" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-dark-100 truncate text-sm">{track.title}</h3>
                  <p className="text-dark-400 text-xs truncate">{track.artist} • {track.album}</p>
                  <div className="mt-1">
                    <Badge variant={statusBadgeVariant[track.status] || 'neutral'} className="text-2xs">
                      {track.status}
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Anime / Movies */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Tv className="h-5 w-5 text-purple-400" />
          Anime / Movies
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {animeMovies.map((item, i) => (
            <Card key={i} className="p-4 card-hover bg-dark-900/60 border border-dark-800">
              <div className="flex items-start gap-4">
                <div className="w-24 h-32 bg-dark-950 rounded-lg overflow-hidden flex-shrink-0 flex items-center justify-center border border-dark-750 shadow-md">
                  {item.cover ? (
                    <img src={item.cover} alt={item.title} className="w-full h-full object-cover" />
                  ) : item.type === 'Anime' ? (
                    <Tv className="h-10 w-10 text-dark-500" />
                  ) : (
                    <Film className="h-10 w-10 text-dark-500" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-dark-100 truncate pr-2 text-base">{item.title}</h3>
                    <Badge variant="neutral" className="text-2xs font-mono">{item.type}</Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge variant={statusBadgeVariant[item.status] || 'neutral'} className="text-2xs" dot>
                      {item.status}
                    </Badge>
                    {item.progress > 0 && <span className="text-2xs text-dark-400 font-mono">{item.progress}/{item.episodes || 1}</span>}
                  </div>
                  {item.rating > 0 && (
                    <div className="flex items-center gap-1 mt-2">
                      {Array.from({ length: 5 }).map((_, idx) => (
                        <Star key={idx} className={cn('h-3.5 w-3.5', idx < Math.floor(item.rating) ? 'text-yellow-400 fill-current' : 'text-dark-600')} />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Linux Setup Reference */}
      <section className="space-y-4">
        <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
          <Calendar className="h-5 w-5 text-emerald-400" />
          Linux Setup Overview
        </h2>
        <Card className="p-6 bg-dark-900/60 border border-dark-800">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold text-dark-100 mb-3 font-mono text-sm uppercase text-emerald-400">System Environment</h3>
              <dl className="space-y-2 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-2 py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Distribution</dt>
                  <dd className="font-mono text-dark-100">Debian GNU/Linux 13 (Trixie)</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Desktop</dt>
                  <dd className="font-mono text-dark-100">KDE Plasma</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Terminal</dt>
                  <dd className="font-mono text-dark-100">Kitty</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1 border-b border-dark-800">
                  <dt className="text-dark-400">Shell</dt>
                  <dd className="font-mono text-dark-100">Zsh (Oh My Zsh)</dd>
                </div>
                <div className="grid grid-cols-2 gap-2 py-1">
                  <dt className="text-dark-400">Editor</dt>
                  <dd className="font-mono text-dark-100">Neovim</dd>
                </div>
              </dl>
            </div>
            <div>
              <h3 className="font-semibold text-dark-100 mb-3 font-mono text-sm uppercase text-emerald-400">Key Engineering CLI Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['btop', 'fzf', 'ripgrep', 'fd', 'eza', 'zoxide', 'lazygit', 'docker', 'kubectl', 'terraform', 'ansible', 'nvim'].map((tool) => (
                  <span key={tool} className="text-xs font-mono px-2.5 py-1 rounded bg-dark-850 text-emerald-400 border border-dark-750">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      </section>
    </div>
  );
}

export default Personal;