import React, { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Network, Server, ShieldCheck, Code2 } from 'lucide-react';
import { TycamiNextBanner } from '../../components/tycami/TycamiNextBanner';

gsap.registerPlugin(ScrollTrigger);

export const TycamiServices: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.from('.service-card', {
        scrollTrigger: {
          trigger: '.services-grid',
          start: 'top 80%',
        },
        y: 50,
        opacity: 0,
        duration: 1,
        ease: 'power3.out',
        stagger: 0.15,
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const services = [
    {
      title: 'Network Engineering',
      desc: 'Architecture and deployment of enterprise networks using Cisco and MikroTik principles. Specializing in VLAN 802.1Q segmentation, dynamic Multi-Area OSPF routing, BIND9 DNS, DHCP services, and IPv4/IPv6 subnet optimization.',
      icon: Network,
    },
    {
      title: 'Linux Server Administration',
      desc: 'End-to-end management of Debian and Arch Linux infrastructure. Provisioning high-availability web stacks (LEMP/LAMP), automated systemd services, SSH hardening, and automated backup shell scripts.',
      icon: Server,
    },
    {
      title: 'Network Security & Defense',
      desc: 'Systematic security posture assessments, endpoint security auditing, port scanning analysis, and threat containment based on Cisco NetAcad principles and hands-on CTF lab methodologies.',
      icon: ShieldCheck,
    },
    {
      title: 'Full-Stack Web Development',
      desc: 'Engineering ultra-responsive, type-safe web applications using React 18, TypeScript, Tailwind CSS, and Node.js. Delivering clean architectures, RESTful APIs, and intuitive digital workstations.',
      icon: Code2,
    },
  ];

  return (
    <div ref={containerRef} className="pt-16 pb-16">
      {/* Header */}
      <div className="max-w-4xl mb-24">
        <h1 className="text-[8vw] md:text-[5vw] font-black leading-[0.9] tracking-tighter uppercase mb-12">
          <div className="overflow-hidden">
            <div className="reveal-text text-white">Specialized</div>
          </div>
          <div className="overflow-hidden">
            <div className="reveal-text text-[var(--color-secondary)]">Expertise.</div>
          </div>
        </h1>
        <div className="overflow-hidden mt-12 max-w-xl">
          <p className="reveal-text font-mono text-xs md:text-sm leading-relaxed text-[var(--color-secondary)] uppercase tracking-[0.15em]">
            Designing robust network infrastructure, rock-solid Linux servers, and modern web solutions for optimal digital performance.
          </p>
        </div>
      </div>

      {/* 4 Bento Glass Service Cards Grid */}
      <div className="services-grid grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {services.map((service, idx) => {
          const Icon = service.icon;
          return (
            <div
              key={idx}
              className="service-card glass-panel p-8 md:p-12 rounded-[2rem] flex flex-col justify-between min-h-[340px] transition-colors duration-500 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[var(--color-accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

              <div className="flex justify-between items-start mb-12 relative z-10">
                <div className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center group-hover:bg-[var(--color-accent)] group-hover:border-[var(--color-accent)] group-hover:text-black transition-colors duration-500 text-white">
                  <Icon className="w-5 h-5" strokeWidth={1.5} />
                </div>
                <span className="font-mono text-xs opacity-50 tracking-widest text-white">
                  {(idx + 1).toString().padStart(2, '0')}
                </span>
              </div>

              <div className="relative z-10">
                <h2 className="text-2xl md:text-3xl font-bold tracking-tight mb-4 group-hover:text-[var(--color-accent)] transition-colors text-white">
                  {service.title}
                </h2>
                <p className="font-sans text-sm text-[var(--color-secondary)] leading-relaxed group-hover:text-white transition-colors">
                  {service.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Next Page Banner */}
      <TycamiNextBanner
        to="/achievements"
        text="EXPLORE AWARD"
        label="Next — Awards & Certifications"
        description="A showcase of my academic distinctions, verified credentials, and professional certifications."
      />
    </div>
  );
};
