import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Award, Shield, CheckCircle, ExternalLink, X, Eye } from 'lucide-react';
import { TycamiNextBanner } from '../../components/tycami/TycamiNextBanner';

gsap.registerPlugin(ScrollTrigger);

export const TycamiAwards: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [selectedCert, setSelectedCert] = useState<{
    title: string;
    issuer: string;
    img: string;
    year: string;
    date?: string;
    id?: string;
  } | null>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.utils.toArray<HTMLElement>('.animate-item').forEach((item) => {
        gsap.from(item, {
          scrollTrigger: {
            trigger: item,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out',
        });
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const academicRankings = [
    { semester: 'SMKN 1 Denpasar', rank: 'TKJ Major' },
    { semester: 'Cisco Networking Academy', rank: 'Active Certified' },
    { semester: 'KOMDIGI DTS Program', rank: 'Alumni VSGA' },
    { semester: 'Linux Systems Lab', rank: 'Arch / Debian Ops' },
  ];

  const certifications = [
    {
      title: 'INTRODUCTION TO CYBERSECURITY',
      issuer: 'Cisco Networking Academy',
      type: 'Security',
      year: '2026',
      date: '08 September 2026',
      img: '/images/certificates/cisco_cybersecurity.png',
      id: 'CISCO-CYBER-2026-09',
    },
    {
      title: 'ENDPOINT SECURITY',
      issuer: 'Cisco Networking Academy',
      type: 'Endpoint Def',
      year: '2026',
      date: '04 September 2026',
      img: '/images/certificates/cisco_endpoint.png',
      id: 'CISCO-ENDPOINT-2026-09',
    },
    {
      title: 'FIBER OPTIC & VSAT TELECOMMUNICATION',
      issuer: 'Kementerian Komunikasi dan Digital RI',
      type: 'Networking',
      year: '2026',
      date: '03 September 2026',
      img: '/images/certificates/komdigi_fiber_optic.png',
      id: '212131071110-9/DTA/BLSDM.Komdigi/2026',
    },
    {
      title: 'DIGITAL MINDSET & SKILLS',
      issuer: 'Kementerian Komunikasi dan Digital RI',
      type: 'Foundation',
      year: '2026',
      date: '10 Agustus 2026',
      img: '/images/certificates/komdigi_mindset.png',
      id: '2299815850-27641/MS/BLSDM.Komdigi/2026',
    },
    {
      title: 'PYTHON PROGRAMMING ESSENTIALS',
      issuer: 'Mimo Learn Coding',
      type: 'Scripting',
      year: '2023',
      date: '17 April 2023',
      img: '/images/certificates/mimo_python.jpg',
      id: 'MIMO-PYTHON-2023',
    },
    {
      title: 'SQL & DATABASE MANAGEMENT',
      issuer: 'Mimo Learn Coding',
      type: 'Database',
      year: '2023',
      date: '13 April 2023',
      img: '/images/certificates/mimo_sql.jpg',
      id: 'MIMO-SQL-2023',
    },
    {
      title: 'HTML WEB DEVELOPMENT',
      issuer: 'Mimo Learn Coding',
      type: 'Frontend',
      year: '2023',
      date: '12 April 2023',
      img: '/images/certificates/mimo_html.jpg',
      id: 'MIMO-HTML-2023',
    },
  ];

  return (
    <div ref={containerRef} className="pt-16 pb-16">
      {/* Header */}
      <div className="max-w-4xl mb-24">
        <h1 className="text-[8vw] md:text-[5vw] font-black leading-[0.9] tracking-tighter uppercase mb-12">
          <div className="overflow-hidden">
            <div className="reveal-text text-white">Awards &</div>
          </div>
          <div className="overflow-hidden">
            <div className="reveal-text text-[var(--color-secondary)]">Certifications.</div>
          </div>
        </h1>
        <div className="overflow-hidden mt-12 max-w-xl">
          <p className="reveal-text font-mono text-xs md:text-sm leading-relaxed text-[var(--color-secondary)] uppercase tracking-[0.15em]">
            A showcase of my academic distinctions, verified credentials, and professional certifications.
          </p>
        </div>
      </div>

      {/* Two Column Grid */}
      <div className="flex flex-col gap-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          {/* Left Column: Academic & Distinctions */}
          <div className="flex flex-col">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-8 border-b border-[var(--color-border)] pb-4 text-[var(--color-secondary)] flex items-center gap-4">
              <Award className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Academic Milestones</span>
            </h2>

            <div className="flex flex-col border-t border-[var(--color-border)]">
              {academicRankings.map((item, idx) => (
                <div
                  key={idx}
                  className="animate-item flex justify-between items-center py-6 border-b border-[var(--color-border)] group hover:bg-[var(--color-100)] px-4 -mx-4 rounded-lg transition-colors"
                >
                  <span className="font-mono text-sm md:text-base tracking-widest uppercase group-hover:text-white text-[var(--color-secondary)] transition-colors">
                    {item.semester}
                  </span>
                  <span className="font-sans text-lg md:text-xl font-bold tracking-tight text-white group-hover:text-[var(--color-accent)] transition-colors">
                    {item.rank}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Verified Certifications */}
          <div className="flex flex-col">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-8 border-b border-[var(--color-border)] pb-4 text-[var(--color-secondary)] flex items-center gap-4">
              <Shield className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Verified Credentials</span>
            </h2>

            <div className="flex flex-col border-t border-[var(--color-border)]">
              {certifications.map((cert, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedCert(cert)}
                  className="animate-item flex flex-col md:flex-row md:items-center justify-between py-5 border-b border-[var(--color-border)] group hover:bg-[var(--color-100)] px-4 -mx-4 rounded-lg transition-colors cursor-pointer gap-2"
                >
                  <div className="flex flex-col">
                    <span className="font-sans text-base md:text-lg font-bold tracking-tight text-white group-hover:text-[var(--color-accent)] transition-colors flex items-center gap-2">
                      {cert.title}
                      <Eye className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 text-[var(--color-accent)] transition-opacity" />
                    </span>
                    <span className="font-mono text-xs text-[var(--color-secondary)]">
                      {cert.issuer}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 self-end md:self-center">
                    <span className="font-mono text-[11px] px-2.5 py-0.5 rounded border border-white/10 text-white/50 group-hover:border-[var(--color-accent)]/50 group-hover:text-[var(--color-accent)] transition-colors">
                      {cert.type}
                    </span>
                    <span className="font-mono text-xs text-[var(--color-secondary)]">
                      {cert.year}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Certificate Modal Preview */}
      {selectedCert && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedCert(null)}
        >
          <div
            className="max-w-2xl w-full bg-[#0d121f] border border-[var(--color-border)] rounded-2xl overflow-hidden shadow-2xl p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-4 border-b border-[var(--color-border)]">
              <div>
                <h3 className="font-sans text-lg font-bold text-white uppercase">
                  {selectedCert.title}
                </h3>
                <p className="font-mono text-xs text-[var(--color-accent)] mt-0.5">
                  {selectedCert.issuer} • {selectedCert.date ? `${selectedCert.date} (${selectedCert.year})` : selectedCert.year}
                </p>
              </div>
              <button
                onClick={() => setSelectedCert(null)}
                className="w-8 h-8 rounded-full border border-[var(--color-border)] flex items-center justify-center text-white/70 hover:text-white hover:border-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="mt-4 rounded-xl overflow-hidden border border-white/10 bg-black/50 aspect-video flex items-center justify-center">
              <img
                src={selectedCert.img}
                alt={selectedCert.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="mt-4 flex flex-col sm:flex-row items-start sm:items-center justify-between text-xs font-mono text-[var(--color-secondary)] gap-2">
              <span className="break-all">CREDENTIAL ID: {selectedCert.id}</span>
              <span className="text-[var(--color-accent)] flex items-center gap-1.5 flex-shrink-0">
                <CheckCircle className="w-3.5 h-3.5" />
                OFFICIALLY VERIFIED
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Next Page Banner */}
      <TycamiNextBanner
        to="/playground"
        text="EXPLORE LAB"
        label="Next — The Laboratory"
        description="Experimental grounds. Build and test a virtual network topology in an interactive playground."
      />
    </div>
  );
};
