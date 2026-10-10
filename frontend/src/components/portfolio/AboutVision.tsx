import React from 'react';
import { Terminal, Network, Shield, Cloud, Code2, Sparkles, BookOpen, Target, Compass } from 'lucide-react';

export const AboutVision: React.FC = () => {
  return (
    <section id="about-section" className="space-y-8" aria-labelledby="about-heading">
      {/* Section Header Tycami Style */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-violet-400 font-semibold tracking-widest">// 01</span>
          <h2 id="about-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
            About Me & Vision
          </h2>
        </div>
        <span className="text-2xs font-mono text-slate-500 uppercase tracking-widest hidden sm:inline">
          Background • Focus • Ambition
        </span>
      </div>

      {/* Two-Column Story & Vision Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        
        {/* Left Card: My Story & Background */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-violet-500/30 transition-all duration-300 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-violet-500/10 border border-violet-500/20 text-violet-400">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xs font-mono text-violet-400 tracking-wider uppercase font-semibold">Background</span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Perjalanan & Minat Teknis
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Ketertarikan saya terhadap dunia IT dimulai dari rasa ingin tahu mendalam mengenai infrastruktur jaringan komputer dan sistem operasi Linux. Sebagai siswa jurusan <span className="text-white font-medium">Teknik Komputer dan Jaringan (TKJ)</span> di <span className="text-sky-300 font-medium">SMKN 1 Denpasar</span>, saya mendalami administrasi server berbasis Debian dan Arch Linux, merancang topologi jaringan enterprise di Cisco Packet Tracer, hingga membangun modul web interaktif.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Pembelajaran di kelas industri dan praktik mandiri menanamkan prinsip kerja terstruktur, hardening keamanan sistem, serta kepatuhan terhadap standarisasi teknis.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-violet-400" />
            <span>Fokus: Hands-on Lab & Implementasi Nyata</span>
          </div>
        </div>

        {/* Right Card: My Vision & Future Goals */}
        <div className="p-6 sm:p-8 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-sky-500/30 transition-all duration-300 flex flex-col justify-between space-y-5">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-400">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <span className="text-2xs font-mono text-sky-400 tracking-wider uppercase font-semibold">Vision & Goal</span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Visi & Pengembangan Diri
                </h3>
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-sans">
              Visi utama saya adalah berkembang menjadi seorang <span className="text-white font-medium">Network & Systems Engineer profesional</span> yang memiliki kompetensi komprehensif: mampu merancang jaringan fisik maupun cloud yang memiliki redundansi tinggi, menerapkan protokol keamanan siber yang tangguh, serta mengintegrasikan antarmuka web modern yang efisien.
            </p>

            <p className="text-sm text-slate-400 leading-relaxed font-sans">
              Saya terus mengeksplorasi sertifikasi industri, lab simulasi CTF, arsitektur AWS Cloud VPC, serta otomatisasi script untuk mempersiapkan diri menghadapi tantangan transformasi digital masa depan.
            </p>
          </div>

          <div className="pt-4 border-t border-white/[0.06] flex items-center gap-2 text-xs font-mono text-slate-400">
            <span className="w-2 h-2 rounded-full bg-sky-400" />
            <span>Target: Arsitektur Cloud, Automasi & Keamanan</span>
          </div>
        </div>

      </div>

      {/* 4 Pillars of Technical Identity */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
        <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/[0.06] hover:border-white/20 transition-all space-y-2">
          <div className="flex items-center gap-2 text-emerald-400">
            <Terminal className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Linux Sysadmin</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Administrasi server Debian 12 & Arch Linux, systemd, hardening SSH/FTP, LAMP stack, dan shell scripting.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/[0.06] hover:border-white/20 transition-all space-y-2">
          <div className="flex items-center gap-2 text-sky-400">
            <Network className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Networking Core</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Perancangan topologi Cisco, VLAN trunking 802.1Q, routing dinamis Multi-Area OSPF, subnetting CIDR, DNS, & DHCP.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/[0.06] hover:border-white/20 transition-all space-y-2">
          <div className="flex items-center gap-2 text-violet-400">
            <Shield className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Cybersecurity</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Kredensial Cisco Endpoint & Cyber Security, lab analisis CTF, kriptografi, steganografi, dan file forensic.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[#0a0e18] border border-white/[0.06] hover:border-white/20 transition-all space-y-2">
          <div className="flex items-center gap-2 text-amber-400">
            <Code2 className="w-4 h-4" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-white">Web & Cloud Dev</span>
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Arsitektur AWS VPC Multi-AZ, fullstack TypeScript, React 18, Express REST APIs, dan otomasi Python.
          </p>
        </div>
      </div>
    </section>
  );
};
