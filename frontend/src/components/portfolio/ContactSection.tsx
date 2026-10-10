import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Mail,
  Github,
  MapPin,
  Send,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { contactApi } from '../../services/api';
import { useToast } from '../../hooks';
import { copyToClipboard } from '../../utils';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
    </svg>
  );
}

export const ContactSection: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const { showToast } = useToast();

  const handleCopy = (text: string, label: string) => {
    copyToClipboard(text);
    setCopiedKey(label);
    showToast(`${label} disalin ke clipboard!`, 'success');
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const submitMutation = useMutation({
    mutationFn: (data: { name: string; email: string; message: string }) => contactApi.submit(data),
    onSuccess: () => {
      showToast('Pesan berhasil terkirim ke kotak masuk Sabbil!', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 5000);
    },
    onError: () => {
      showToast('Gagal mengirim pesan. Silakan coba kembali atau gunakan email langsung.', 'error');
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      showToast('Mohon lengkapi semua kolom pesan.', 'error');
      return;
    }
    submitMutation.mutate({ name, email, message });
  };

  return (
    <section id="contact-section" className="space-y-8" aria-labelledby="contact-heading">
      {/* Section Header Tycami Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-rose-400 font-semibold tracking-widest">// 07</span>
          <h2 id="contact-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
            Contact & Connect
          </h2>
        </div>

        <span className="text-2xs font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
          Open For Inquiries & Lab Collab
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 sm:gap-8">
        
        {/* Left Column: Direct Social & Contact Cards (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="p-6 rounded-2xl bg-[#0d121f] border border-white/10 space-y-5">
            <div>
              <span className="text-2xs font-mono text-rose-400 font-semibold uppercase tracking-wider">
                Direct Channels
              </span>
              <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                Mari Terhubung
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed font-sans mt-1">
                Terbuka untuk diskusi seputar konfigurasi jaringan Cisco, administrasi Linux, eksplorasi keamanan CTF, atau kolaborasi proyek web.
              </p>
            </div>

            <div className="space-y-2.5">
              {/* Email */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xs font-mono text-slate-400">Email Utama</p>
                    <p className="text-xs font-mono text-white truncate">skyroomtl@gmail.com</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('skyroomtl@gmail.com', 'Email')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Salin email"
                >
                  {copiedKey === 'Email' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Discord */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-indigo-500/10 text-indigo-400">
                    <DiscordIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xs font-mono text-slate-400">Discord</p>
                    <p className="text-xs font-mono text-white truncate">enzbern_</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy('enzbern_', 'Discord')}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/[0.06] transition-colors cursor-pointer"
                  title="Salin username Discord"
                >
                  {copiedKey === 'Discord' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* GitHub */}
              <a
                href="https://github.com/BillZCode"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-white/[0.06] text-white">
                    <Github className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xs font-mono text-slate-400">GitHub Profile</p>
                    <p className="text-xs font-mono text-white truncate group-hover:text-amber-400 transition-colors">BillZCode</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>

              {/* Instagram */}
              <a
                href="https://instagram.com/sabbilferdyans"
                target="_blank"
                rel="noopener noreferrer"
                className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/20 transition-all flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="p-2 rounded-lg bg-rose-500/10 text-rose-400">
                    <InstagramIcon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-2xs font-mono text-slate-400">Instagram</p>
                    <p className="text-xs font-mono text-white truncate group-hover:text-rose-400 transition-colors">@sabbilferdyans</p>
                  </div>
                </div>
                <ExternalLink className="w-4 h-4 text-slate-500 group-hover:text-white transition-colors" />
              </a>

              {/* Location */}
              <div className="p-3.5 rounded-xl bg-white/[0.02] border border-white/[0.06] flex items-center gap-3">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-2xs font-mono text-slate-400">Lokasi</p>
                  <p className="text-xs font-mono text-white">Denpasar, Bali, Indonesia</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Working Functional Contact Form (3 cols) */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="p-6 sm:p-8 rounded-2xl bg-[#0d121f] border border-white/10 space-y-5 h-full flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div>
                <span className="text-2xs font-mono text-emerald-400 font-semibold uppercase tracking-wider">
                  Direct Inbox
                </span>
                <h3 className="text-lg font-bold text-white tracking-tight mt-1">
                  Kirim Pesan Langsung
                </h3>
                <p className="text-xs text-slate-400 font-sans mt-0.5">
                  Formulir ini terhubung langsung ke inbox server IT-Hub. Saya akan membalas pesan Anda sesegera mungkin.
                </p>
              </div>

              {isSuccess && (
                <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                  <span>Terima kasih! Pesan Anda telah terkirim dan tersimpan di database admin.</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label htmlFor="contact-name" className="text-xs font-mono text-slate-300">
                    Nama Lengkap <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nama Anda"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400/50 transition-colors"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="contact-email" className="text-xs font-mono text-slate-300">
                    Alamat Email <span className="text-rose-400">*</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400/50 transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label htmlFor="contact-message" className="text-xs font-mono text-slate-300">
                  Isi Pesan <span className="text-rose-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={4}
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tuliskan pesan, pertanyaan teknis, atau penawaran kerja sama..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-white/[0.03] border border-white/10 text-xs font-mono text-white placeholder:text-slate-500 focus:outline-none focus:border-rose-400/50 transition-colors resize-none"
                />
              </div>
            </div>

            <div className="pt-2 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-500">
                Data disimpan aman dengan sanitasi input.
              </span>
              <button
                type="submit"
                disabled={submitMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-semibold bg-white text-slate-950 hover:bg-slate-200 transition-all shadow-md active:scale-95 disabled:opacity-50 cursor-pointer"
              >
                {submitMutation.isPending ? (
                  <span>Mengirim...</span>
                ) : (
                  <>
                    <span>Kirim Pesan</span>
                    <Send className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

      </div>
    </section>
  );
};
