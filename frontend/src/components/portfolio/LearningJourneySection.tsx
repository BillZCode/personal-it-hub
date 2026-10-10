import React, { useState } from 'react';
import {
  Award,
  ExternalLink,
  ShieldCheck,
  CheckCircle2,
  Calendar,
  Eye,
  X,
  ArrowRight,
  BookOpen,
  Sparkles,
  Layers,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { sabbilCertificates } from '../../pages/public/Certificates';
import { Certificate } from '../../types';
import { formatDate } from '../../utils';

export const LearningJourneySection: React.FC = () => {
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);

  return (
    <section id="credentials-section" className="space-y-8" aria-labelledby="credentials-heading">
      {/* Section Header Tycami Style */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <span className="text-xs sm:text-sm font-mono text-emerald-400 font-semibold tracking-widest">// 04</span>
          <h2 id="credentials-heading" className="text-xs sm:text-sm font-mono uppercase tracking-[0.2em] text-white font-bold">
            Learning Journey & Certifications
          </h2>
        </div>

        <Link
          to="/certificates"
          className="inline-flex items-center gap-1.5 text-xs font-mono text-slate-400 hover:text-white transition-colors group"
        >
          <span>View All Official Certificates</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>

      {/* Structured Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {sabbilCertificates.map((cert) => (
          <div
            key={cert.id}
            className="group p-5 rounded-2xl bg-[#0d121f] border border-white/10 hover:border-emerald-500/30 transition-all duration-300 flex flex-col justify-between space-y-4 hover:shadow-xl"
          >
            <div className="space-y-3.5">
              {/* Certificate Image Preview Aspect Ratio */}
              {cert.imageUrl && (
                <div 
                  onClick={() => setSelectedCert(cert)}
                  className="relative aspect-[16/10] w-full rounded-xl overflow-hidden bg-[#111624] border border-white/10 cursor-pointer group-hover:border-white/20 transition-all"
                >
                  <img
                    src={cert.imageUrl}
                    alt={cert.name}
                    loading="lazy"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-black/80 text-white text-xs font-mono">
                      <Eye className="w-3.5 h-3.5" />
                      <span>Preview</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Certificate Metadata */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between gap-2 text-2xs font-mono text-slate-400">
                  <span className="text-emerald-400 font-semibold">{cert.provider}</span>
                  <span>{formatDate(cert.issueDate)}</span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors line-clamp-2">
                  {cert.name}
                </h3>

                {cert.credentialId && (
                  <p className="text-[11px] font-mono text-slate-500 truncate">
                    ID: {cert.credentialId}
                  </p>
                )}
              </div>
            </div>

            {/* Verification Link and Preview */}
            <div className="pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <button
                onClick={() => setSelectedCert(cert)}
                className="inline-flex items-center gap-1 text-xs font-mono text-slate-300 hover:text-white transition-colors cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>Lihat Sertifikat</span>
              </button>

              {cert.verificationUrl && (
                <a
                  href={cert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-mono text-emerald-400 hover:text-emerald-300 transition-colors"
                  title="Verifikasi ke portal resmi"
                >
                  <span>Verifikasi</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Practical Lab & Learning Milestones Strip */}
      <div className="p-6 rounded-2xl bg-[#0a0e18] border border-white/[0.06] space-y-4">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-400" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-white font-bold">
            Practical Lab & Industry Training Milestones
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-sans">
          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
            <span className="text-2xs font-mono text-emerald-400 font-bold">// 2026 • NETWORK LAB</span>
            <h4 className="font-bold text-white">Cisco Multi-Area OSPF & VLAN 802.1Q</h4>
            <p className="text-slate-400 leading-relaxed">
              Perancangan topologi enterprise berskala menengah mencakup pembagian broadcast domain VLAN, router-on-a-stick, OSPF cost metrics, dan verifikasi tabel routing.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
            <span className="text-2xs font-mono text-sky-400 font-bold">// 2026 • SYSADMIN LAB</span>
            <h4 className="font-bold text-white">Debian Enterprise Server & BIND9 DNS</h4>
            <p className="text-slate-400 leading-relaxed">
              Konfigurasi server nama domain BIND9 otoritatif, VirtualHosts Apache2, runtime PHP-FPM, dan database MariaDB yang diperkuat dengan protokol keamanan SSH/FTP.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] space-y-1.5">
            <span className="text-2xs font-mono text-violet-400 font-bold">// 2026 • CLOUD & SECOPS</span>
            <h4 className="font-bold text-white">AWS VPC Multi-AZ & CyberLab CTF</h4>
            <p className="text-slate-400 leading-relaxed">
              Perancangan virtual private cloud AWS dengan subnet publik & privat berstandar produksi, serta pembuatan toolkit investigasi CTF & kriptografi CyberLab.
            </p>
          </div>
        </div>
      </div>

      {/* Certificate Modal */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setSelectedCert(null)}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-[#0c101b] border border-white/20 p-6 sm:p-8 space-y-5 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 pb-4 border-b border-white/10">
              <div className="space-y-1">
                <span className="text-2xs font-mono font-semibold uppercase text-emerald-400">
                  {selectedCert.provider}
                </span>
                <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  {selectedCert.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/[0.08] transition-colors cursor-pointer"
                aria-label="Tutup modal"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedCert.imageUrl && (
              <div className="rounded-2xl overflow-hidden aspect-[16/10] bg-[#111624] border border-white/10">
                <img
                  src={selectedCert.imageUrl}
                  alt={selectedCert.name}
                  className="w-full h-full object-contain bg-black/40"
                />
              </div>
            )}

            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Penyelenggara:</span>
                <span className="text-white font-medium">{selectedCert.provider}</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                <span className="text-slate-400">Tanggal Terbit:</span>
                <span className="text-white">{formatDate(selectedCert.issueDate)}</span>
              </div>
              {selectedCert.credentialId && (
                <div className="flex justify-between py-1.5 border-b border-white/[0.06]">
                  <span className="text-slate-400">Credential ID:</span>
                  <span className="text-emerald-400">{selectedCert.credentialId}</span>
                </div>
              )}
            </div>

            <div className="pt-2 flex items-center justify-end gap-3">
              {selectedCert.verificationUrl && (
                <a
                  href={selectedCert.verificationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-mono font-semibold bg-emerald-500 hover:bg-emerald-400 text-slate-950 transition-all shadow-md"
                >
                  <span>Buka Verifikasi Resmi</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
