import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { contactApi } from '../../services/api';
import { Card, Input, Textarea, Button } from '../../components/ui';
import { Mail, Github, Instagram, Send, MapPin, Clock, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../hooks';
import { cn } from '../../utils';

function DiscordIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.929 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z"/>
    </svg>
  );
}

const socialLinks = [
  { name: 'Email', href: 'mailto:skyroomtl@gmail.com', icon: Mail, description: 'skyroomtl@gmail.com' },
  { name: 'GitHub', href: 'https://github.com/BillZCode', icon: Github, description: 'github.com/BillZCode' },
  { name: 'Discord', href: 'https://discord.com/users/enzbern_', icon: DiscordIcon, description: 'enzbern_' },
  { name: 'Instagram', href: 'https://instagram.com/sabbilferdyans', icon: Instagram, description: '@sabbilferdyans' },
];

export function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { showToast } = useToast();

  const submitMutation = useMutation({
    mutationFn: (data: { name: string; email: string; message: string }) => contactApi.submit(data),
    onSuccess: () => {
      showToast('Pesan berhasil terkirim!', 'success');
      setName('');
      setEmail('');
      setMessage('');
      setSubmitted(true);
    },
    onError: () => showToast('Gagal mengirim pesan', 'error'),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && email.trim() && message.trim()) {
      submitMutation.mutate({ name: name.trim(), email: email.trim(), message: message.trim() });
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-10 animate-in pb-16">
      <div className="text-center border-b border-dark-800/80 pb-6">
        <h1 className="text-3xl sm:text-4xl font-bold text-dark-100 tracking-tight font-sans">Contact</h1>
        <p className="text-dark-400 text-sm mt-2">Hubungi saya untuk diskusi teknis, kolaborasi proyek, atau seputar infrastruktur IT</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-dark-900/60 border border-dark-800">
          <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide mb-6">Kirim Pesan</h2>
          {submitted ? (
            <div className="text-center py-8 space-y-4">
              <div className="mx-auto w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="h-7 w-7 text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-dark-100">Pesan Terkirim!</h3>
                <p className="text-dark-400 text-xs mt-1">Terima kasih telah menghubungi. Saya akan membalas segera.</p>
              </div>
              <Button variant="secondary" size="sm" onClick={() => setSubmitted(false)} className="text-xs">
                Kirim Pesan Lain
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Nama Lengkap"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nama Anda"
                required
                maxLength={100}
              />
              <Input
                label="Alamat Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                maxLength={254}
              />
              <Textarea
                label="Isi Pesan"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tuliskan pesan atau pertanyaan Anda di sini..."
                required
                maxLength={2000}
                rows={5}
              />
              <div className="flex items-center justify-between pt-2">
                <p className="text-2xs font-mono text-dark-500">{message.length}/2000 karakter</p>
                <Button type="submit" loading={submitMutation.isPending} leftIcon={<Send className="h-4 w-4" />} className="text-xs">
                  Kirim Pesan
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="p-6 bg-dark-900/60 border border-dark-800 flex flex-col justify-between">
          <div>
            <h2 className="text-lg font-bold font-mono text-dark-100 uppercase tracking-wide mb-6">Koneksi & Sosial</h2>
            <div className="space-y-3">
              {socialLinks.map((link) => (
                <a 
                  key={link.name} 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="flex items-center gap-3.5 p-3.5 bg-dark-950/60 rounded-xl border border-dark-800/80 hover:border-emerald-500/40 transition-colors group"
                >
                  <div className={cn(
                    'p-2.5 rounded-lg transition-colors', 
                    link.name === 'Email' ? 'bg-rose-500/15 text-rose-400' : 
                    link.name === 'GitHub' ? 'bg-dark-800 text-dark-100' : 
                    link.name === 'Discord' ? 'bg-indigo-500/15 text-indigo-400' : 'bg-pink-500/15 text-pink-400'
                  )}>
                    <link.icon className="h-4 w-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-xs text-dark-100 group-hover:text-emerald-300 transition-colors">{link.name}</p>
                    <p className="text-dark-400 text-2xs font-mono truncate">{link.description}</p>
                  </div>
                  <span className="text-dark-600 group-hover:text-emerald-400 transition-colors text-xs font-mono">→</span>
                </a>
              ))}
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-dark-800 space-y-3">
            <h3 className="font-mono text-xs font-bold text-emerald-400 uppercase tracking-wider">Ketersediaan Respon</h3>
            <div className="space-y-2 text-xs text-dark-300">
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Biasanya merespon dalam rentang 24 jam</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-emerald-400" />
                <span>Denpasar, Bali • Terbuka untuk kolaborasi remote</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-3.5 w-3.5 text-emerald-400" />
                <span>Zona Waktu: WITA (UTC+8)</span>
              </div>
            </div>
          </div>
        </Card>
      </div>

      <Card className="p-6 bg-dark-900/60 border border-dark-800">
        <h2 className="text-base font-bold font-mono text-dark-100 uppercase tracking-wide mb-3">
          Topik Diskusi & Kolaborasi
        </h2>
        <p className="text-dark-400 text-xs sm:text-sm mb-4 leading-relaxed">
          Saya terbuka untuk diskusi teknis, kolaborasi proyek open source, serta eksplorasi teknologi baru seputar:
        </p>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-dark-300 font-mono">
          <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">▸</span> Cisco Packet Tracer & Routing OSPF/VLAN</li>
          <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">▸</span> Administrasi Server Linux (Debian, Arch, systemd)</li>
          <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">▸</span> Otomasi Python, Bash Scripting & Tooling</li>
          <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">▸</span> Web Architecture (LAMP Stack, BIND9 DNS, MariaDB)</li>
          <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">▸</span> Hardware PC, Performa Rig, dan Pendinginan AIO</li>
          <li className="flex items-center gap-2"><span className="text-emerald-400 font-bold">▸</span> Dokumentasi Teknis & Panduan Jaringan Komputer</li>
        </ul>
      </Card>
    </div>
  );
}

export default Contact;