import { useState, useId } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contactApi } from '../../services/api';
import { Card, Input, Textarea, Button } from '../../components/ui';
import {
  Mail,
  Github,
  Instagram,
  Send,
  MapPin,
  Clock,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { useToast, useDocumentTitle } from '../../hooks';
import { cn, copyToClipboard } from '../../utils';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
    </svg>
  );
}

interface SocialLinkItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  description: string;
  copyable?: string;
}

const socialLinks: SocialLinkItem[] = [
  {
    name: 'Email',
    href: 'mailto:skyroomtl@gmail.com',
    icon: Mail,
    description: 'skyroomtl@gmail.com',
    copyable: 'skyroomtl@gmail.com',
  },
  {
    name: 'GitHub',
    href: 'https://github.com/BillZCode',
    icon: Github,
    description: 'github.com/BillZCode',
  },
  {
    name: 'Discord',
    href: 'https://discord.com/users/enzbern_',
    icon: DiscordIcon,
    description: 'enzbern_',
    copyable: 'enzbern_',
  },
  {
    name: 'Instagram',
    href: 'https://instagram.com/sabbilferdyans',
    icon: Instagram,
    description: '@sabbilferdyans',
  },
];

export function Contact() {
  useDocumentTitle('Contact & Hire Me');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [botTrap, setBotTrap] = useState(''); // Anti-bot honeypot
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [messageError, setMessageError] = useState('');

  const emailErrorId = useId();
  const nameErrorId = useId();
  const messageErrorId = useId();

  const submitMutation = useMutation({
    mutationFn: (data: { name: string; email: string; message: string }) => contactApi.submit(data),
    onSuccess: () => {
      showToast('Pesan berhasil terkirim ke kotak masuk admin!', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setEmailError('');
      setNameError('');
      setMessageError('');
      setSubmitted(true);
    },
    onError: () => {
      showToast('Gagal mengirim pesan. Silakan coba kembali atau gunakan email langsung.', 'error');
    },
  });

  const handleCopy = async (val: string, key: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const ok = await copyToClipboard(val);
    if (ok) {
      setCopiedKey(key);
      showToast(`Tersalin: ${val}`, 'info');
      setTimeout(() => setCopiedKey(null), 2500);
    }
  };

  const validateEmail = (val: string) => {
    const clean = val.trim();
    if (!clean) return 'Email wajib diisi';
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(clean)) return 'Format alamat email tidak valid (contoh: nama@domain.com)';
    return '';
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Silent reject bot submission
    if (botTrap) {
      setSubmitted(true);
      return;
    }

    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const cleanMsg = message.trim();

    let hasError = false;

    if (!cleanName) {
      setNameError('Nama lengkap wajib diisi');
      hasError = true;
    } else {
      setNameError('');
    }

    const emailErr = validateEmail(cleanEmail);
    if (emailErr) {
      setEmailError(emailErr);
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!cleanMsg) {
      setMessageError('Isi pesan tidak boleh kosong');
      hasError = true;
    } else if (cleanMsg.length < 10) {
      setMessageError('Pesan terlalu singkat (minimal 10 karakter)');
      hasError = true;
    } else {
      setMessageError('');
    }

    if (hasError) {
      showToast('Mohon periksa kembali formulir yang belum lengkap', 'info');
      return;
    }

    submitMutation.mutate({ name: cleanName, email: cleanEmail, message: cleanMsg });
  };

  const messageLimit = 2000;
  const messagePct = Math.min(100, Math.round((message.length / messageLimit) * 100));

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in pb-16">
      {/* Header section with semantic H1 and badge */}
      <div className="text-center border-b border-dark-800/80 pb-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-400 text-xs font-mono mb-3">
          <Sparkles className="h-3.5 w-3.5 text-amber-400" aria-hidden="true" />
          <span>Direct Transmission Hub</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold text-dark-100 tracking-tight font-sans">Contact & Hire</h1>
        <p className="text-dark-400 text-sm mt-2 max-w-lg mx-auto">
          Hubungi saya untuk diskusi teknis, kolaborasi proyek, konsultasi infrastruktur IT, atau peluang kerjasama.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Contact Form Card */}
        <div className="v7-card-wrapper">
          <div className="v7-corner-tl" />
          <div className="v7-corner-br" />
          <div className="v7-glass-card p-6 sm:p-7 relative z-10">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wider flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
                Kirim Pesan
              </h2>
              <span className="text-[11px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Live Inbox
              </span>
            </div>

            {submitted ? (
              <div className="text-center py-8 space-y-4" role="status" aria-live="polite">
                <div className="mx-auto w-14 h-14 bg-amber-500/20 rounded-full flex items-center justify-center border border-amber-500/30">
                  <CheckCircle2 className="h-7 w-7 text-amber-400" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-dark-100">Pesan Terkirim!</h3>
                  <p className="text-dark-400 text-xs mt-1 max-w-xs mx-auto">
                    Terima kasih telah menghubungi. Pesan Anda telah diteruskan ke email admin dan akan dibalas secepatnya.
                  </p>
                </div>
                <div className="pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSubmitted(false)}
                    className="text-xs font-mono"
                    aria-label="Kirim pesan lain"
                  >
                    Kirim Pesan Lain
                  </Button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Anti-bot honeypot hidden from real users */}
                <div className="hidden" aria-hidden="true">
                  <label htmlFor="website-trap">Leave this blank</label>
                  <input
                    id="website-trap"
                    type="text"
                    name="website_url"
                    value={botTrap}
                    onChange={(e) => setBotTrap(e.target.value)}
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div>
                  <Input
                    label="Nama Lengkap"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      if (nameError) setNameError('');
                    }}
                    placeholder="Nama Anda"
                    required
                    maxLength={100}
                    autoComplete="name"
                    error={nameError}
                    aria-invalid={!!nameError}
                    aria-describedby={nameError ? nameErrorId : undefined}
                  />
                  {nameError && (
                    <p id={nameErrorId} className="text-2xs text-rose-400 mt-1 font-mono" role="alert">
                      {nameError}
                    </p>
                  )}
                </div>

                <div>
                  <Input
                    label="Alamat Email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError('');
                    }}
                    onBlur={() => {
                      if (email) setEmailError(validateEmail(email));
                    }}
                    placeholder="email@example.com"
                    required
                    maxLength={254}
                    autoComplete="email"
                    error={emailError}
                    aria-invalid={!!emailError}
                    aria-describedby={emailError ? emailErrorId : undefined}
                  />
                  {emailError && (
                    <p id={emailErrorId} className="text-2xs text-rose-400 mt-1 font-mono" role="alert">
                      {emailError}
                    </p>
                  )}
                </div>

                <div>
                  <Textarea
                    label="Isi Pesan"
                    value={message}
                    onChange={(e) => {
                      setMessage(e.target.value);
                      if (messageError) setMessageError('');
                    }}
                    placeholder="Tuliskan pesan, rincian proyek, atau topik kolaborasi Anda di sini..."
                    required
                    maxLength={messageLimit}
                    rows={5}
                    error={messageError}
                    aria-invalid={!!messageError}
                    aria-describedby={messageError ? messageErrorId : undefined}
                  />
                  {messageError && (
                    <p id={messageErrorId} className="text-2xs text-rose-400 mt-1 font-mono" role="alert">
                      {messageError}
                    </p>
                  )}

                  {/* Character progress bar indicator */}
                  <div className="w-full h-1 bg-dark-800 rounded-full mt-2 overflow-hidden">
                    <div
                      className={cn(
                        'h-full transition-all duration-200 rounded-full',
                        messagePct > 90 ? 'bg-rose-500' : messagePct > 75 ? 'bg-amber-400' : 'bg-emerald-500'
                      )}
                      style={{ width: `${messagePct}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <p className="text-2xs font-mono text-dark-500" aria-live="polite">
                    {message.length}/{messageLimit} karakter
                  </p>
                  <button
                    type="submit"
                    disabled={submitMutation.isPending || !name.trim() || !email.trim() || !message.trim()}
                    className="v7-btn-gold px-5 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    aria-label="Kirim formulir pesan kontak"
                  >
                    <Send className={cn('h-3.5 w-3.5', submitMutation.isPending && 'animate-spin')} aria-hidden="true" />
                    <span>{submitMutation.isPending ? 'Mengirim Transmisi...' : 'Kirim Pesan'}</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Channels & Social Links */}
        <div className="v7-glass-card p-6 sm:p-7 flex flex-col justify-between h-full space-y-6">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wide flex items-center gap-2">
                <span className="w-1.5 h-4 bg-amber-400 rounded-full inline-block" />
                Koneksi & Sosial
              </h2>
              <span className="text-[10px] font-mono text-dark-400">Direct Links</span>
            </div>

            <div className="space-y-3" role="list" aria-label="Tautan media sosial dan kontak">
              {socialLinks.map((link) => (
                <div
                  key={link.name}
                  className="flex items-center justify-between p-3.5 bg-dark-950/60 rounded-xl border border-dark-800/80 hover:border-amber-500/40 transition-colors group"
                  role="listitem"
                >
                  <a
                    href={link.href}
                    target={link.href.startsWith('mailto:') ? undefined : '_blank'}
                    rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
                    className="flex items-center gap-3.5 flex-1 min-w-0"
                    aria-label={`Buka tautan ${link.name}: ${link.description}`}
                  >
                    <div
                      className={cn(
                        'p-2.5 rounded-lg transition-transform group-hover:scale-105',
                        link.name === 'Email'
                          ? 'bg-rose-500/15 text-rose-400'
                          : link.name === 'GitHub'
                          ? 'bg-dark-800 text-dark-100'
                          : link.name === 'Discord'
                          ? 'bg-indigo-500/15 text-indigo-400'
                          : 'bg-pink-500/15 text-pink-400'
                      )}
                    >
                      <link.icon className="h-4 w-4" aria-hidden="true" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-xs text-dark-100 group-hover:text-amber-300 transition-colors">
                        {link.name}
                      </p>
                      <p className="text-dark-400 text-2xs font-mono truncate">{link.description}</p>
                    </div>
                    <ExternalLink className="h-3.5 w-3.5 text-dark-500 group-hover:text-amber-400 transition-colors mr-2 opacity-60 group-hover:opacity-100" />
                  </a>

                  {link.copyable && (
                    <button
                      type="button"
                      onClick={(e) => handleCopy(link.copyable!, link.name, e)}
                      className="px-2 py-1 rounded-lg bg-dark-800/80 hover:bg-dark-700 border border-dark-700 text-dark-400 hover:text-amber-300 text-[10px] font-mono flex items-center gap-1 transition-colors"
                      title={`Salin ${link.name}`}
                      aria-label={`Salin nilai ${link.name}`}
                    >
                      {copiedKey === link.name ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-400" />
                          <span className="text-emerald-400">Disalin</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" />
                          <span>Salin</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Mailto Fallback Button */}
          <div className="p-3.5 rounded-xl bg-amber-500/[0.04] border border-amber-500/20 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-amber-400 flex-shrink-0" />
              <div className="text-2xs">
                <span className="font-semibold text-dark-200 block">Kirim langsung via Email Client?</span>
                <span className="text-dark-400">Buka di Gmail, Outlook, atau Thunderbird</span>
              </div>
            </div>
            <a
              href="mailto:skyroomtl@gmail.com?subject=Pertanyaan%20dari%20Personal%20IT%20Hub"
              className="px-3 py-1.5 rounded-lg bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 text-2xs font-mono font-medium transition-colors flex items-center gap-1 whitespace-nowrap"
            >
              <span>Mailto</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>

          {/* Status & Availability section */}
          <div className="pt-4 border-t border-dark-800/80 space-y-2.5">
            <h3 className="font-mono text-xs font-bold text-amber-400 uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
              Ketersediaan & Wilayah
            </h3>
            <div className="space-y-1.5 text-xs text-dark-300">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
                <span>Respons aktif &lt; 24 jam</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
                <span>Denpasar, Bali • Terbuka untuk Remote Worldwide</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-amber-400 flex-shrink-0" aria-hidden="true" />
                <span>Zona Waktu: WITA (UTC+8)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Discussion Topics Card */}
      <Card className="p-6 bg-dark-900/60 border border-dark-800">
        <h2 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wide mb-3 flex items-center gap-2">
          <span className="text-amber-400 font-bold">#</span>
          Topik Diskusi & Kolaborasi Teknikal
        </h2>
        <p className="text-dark-400 text-xs sm:text-sm mb-4 leading-relaxed">
          Saya terbuka untuk diskusi teknis, kolaborasi proyek open source, serta eksplorasi teknologi baru seputar:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-dark-300 font-mono" role="list" aria-label="Topik diskusi dan kolaborasi">
          <li className="flex items-center gap-2" role="listitem">
            <span className="text-amber-400 font-bold" aria-hidden="true">▸</span> Cisco Packet Tracer & Routing OSPF/VLAN
          </li>
          <li className="flex items-center gap-2" role="listitem">
            <span className="text-amber-400 font-bold" aria-hidden="true">▸</span> Administrasi Server Linux (Debian, Arch, systemd)
          </li>
          <li className="flex items-center gap-2" role="listitem">
            <span className="text-amber-400 font-bold" aria-hidden="true">▸</span> Otomasi Python, Bash Scripting & Tooling
          </li>
          <li className="flex items-center gap-2" role="listitem">
            <span className="text-amber-400 font-bold" aria-hidden="true">▸</span> Web Architecture (LAMP Stack, BIND9 DNS, MariaDB)
          </li>
          <li className="flex items-center gap-2" role="listitem">
            <span className="text-amber-400 font-bold" aria-hidden="true">▸</span> Hardware PC, Performa Rig, dan Pendinginan AIO
          </li>
          <li className="flex items-center gap-2" role="listitem">
            <span className="text-amber-400 font-bold" aria-hidden="true">▸</span> Dokumentasi Teknis & Panduan Jaringan Komputer
          </li>
        </ul>
      </Card>
    </div>
  );
}

export default Contact;