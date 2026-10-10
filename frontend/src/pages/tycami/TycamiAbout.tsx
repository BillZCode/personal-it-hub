import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { 
  Terminal, 
  Network, 
  ShieldCheck, 
  Cloud, 
  Code2, 
  Sparkles,
  Layers,
  LucideIcon
} from 'lucide-react';
import { TycamiNextBanner } from '../../components/tycami/TycamiNextBanner';

gsap.registerPlugin(ScrollTrigger);

interface SkillGroup {
  id: string;
  category: string;
  icon: LucideIcon;
  description: string;
  skills: string[];
}

export const TycamiAbout: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const skillGroups: SkillGroup[] = [
    {
      id: 'linux',
      category: 'Linux & System Administration',
      icon: Terminal,
      description: 'Server provisioning, kernel environments, daemon orchestration, and shell automation.',
      skills: [
        'Debian 12 / 11',
        'Arch Linux',
        'Hyprland Wayland',
        'systemd Units',
        'Bash Scripting',
        'SSH Key Hardening',
        'LEMP / LAMP Stack',
        'Cron Automation',
        'Kernel Logs & Sysctl',
      ],
    },
    {
      id: 'networking',
      category: 'Enterprise Networking',
      icon: Network,
      description: 'Layer 2/3 architecture, dynamic routing protocols, DNS resolution, and VLSM subnet design.',
      skills: [
        'Cisco Packet Tracer',
        'Multi-Area OSPF',
        'VLAN 802.1Q Trunking',
        'BIND9 DNS Server',
        'DHCP Services',
        'IPv4 & IPv6 VLSM',
        'Static Route Failover',
        'Router-on-a-Stick',
        'Subnet Optimization',
      ],
    },
    {
      id: 'security',
      category: 'Cybersecurity & Defense',
      icon: ShieldCheck,
      description: 'Threat posture auditing, endpoint protection, reconnaissance, and defensive lab operations.',
      skills: [
        'Cisco Cyber Essentials',
        'Cisco Endpoint Security',
        'Nmap Port Scanning',
        'Wireshark Traffic Analysis',
        'UFW & Iptables Firewall',
        'CTF Lab Defense',
        'Cryptographic Foundations',
        'Access Control Lists (ACL)',
      ],
    },
    {
      id: 'cloud',
      category: 'Cloud Computing & DevOps',
      icon: Cloud,
      description: 'Scalable cloud infrastructure, containerization, and edge proxy networks.',
      skills: [
        'AWS VPC Multi-AZ',
        'AWS EC2 Compute',
        'AWS S3 Storage',
        'Docker Containers',
        'Cloudflare Edge CDN',
        'Security Groups',
        'Reverse Proxy Nginx',
        'Virtualization Proxmox',
      ],
    },
    {
      id: 'web',
      category: 'Full-Stack Web Development',
      icon: Code2,
      description: 'High-performance interactive interfaces, type-safe APIs, and responsive design systems.',
      skills: [
        'React 18 & Hooks',
        'TypeScript',
        'Vite Toolchain',
        'Tailwind CSS',
        'Node.js & Express',
        'Python Flask REST',
        'MariaDB / MySQL',
        'Git & GitHub Workflows',
        'GSAP & Animations',
      ],
    },
  ];

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
      });

      gsap.from('.profile-card', {
        x: 80,
        opacity: 0,
        duration: 1.4,
        ease: 'power4.out',
        delay: 0.3,
      });

      gsap.utils.toArray<HTMLElement>('.exp-item').forEach((item) => {
        gsap.fromTo(
          item,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: 'power3.out',
            immediateRender: false,
            scrollTrigger: {
              trigger: item,
              start: 'top 90%',
              once: true,
            },
          }
        );
      });

      // Safe refresh for layout
      const timer = setTimeout(() => {
        ScrollTrigger.refresh();
      }, 200);

      return () => clearTimeout(timer);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const expertiseList = [
    {
      year: '2026 — Present',
      title: 'Linux & System Administration',
      company: 'Debian, Arch Linux & Hyprland',
      desc: 'Server provisioning, systemd services, SSH hardening, automated backup pipelines, LEMP/LAMP configuration, and Bash shell scripting.',
    },
    {
      year: '2025 — Present',
      title: 'Enterprise Networking',
      company: 'Cisco Packet Tracer & Routing',
      desc: 'Multi-Area OSPF routing topologies, 802.1Q VLAN segmentation, BIND9 DNS server, DHCP management, and IPv4/IPv6 VLSM subnetting.',
    },
    {
      year: '2025 — Present',
      title: 'Cybersecurity & Defense',
      company: 'Cisco NetAcad & Lab Practice',
      desc: 'Endpoint security, vulnerability assessment, port scanning analysis, cryptographic foundations, and CTF defensive methodology.',
    },
    {
      year: '2026 — Present',
      title: 'Full-Stack Web Development',
      company: 'React 18, TypeScript & Node.js',
      desc: 'Engineering high-performance web dashboards, developer tools, REST APIs, and resilient data interfaces with Tailwind CSS and MariaDB.',
    },
  ];

  const filteredGroups = activeCategory === 'all'
    ? skillGroups
    : skillGroups.filter((g) => g.id === activeCategory);

  const totalSkillsCount = skillGroups.reduce((acc, g) => acc + g.skills.length, 0);

  return (
    <div ref={containerRef} className="pt-16 pb-16">
      {/* Top Profile & Bio Split */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center gap-12 lg:gap-16">
        <div className="flex-1 max-w-4xl">
          <h1 className="text-[8vw] md:text-[5vw] font-black leading-[0.9] tracking-tighter uppercase mb-12">
            <div className="overflow-hidden">
              <div className="reveal-text text-white">Sabbil</div>
            </div>
            <div className="overflow-hidden">
              <div className="reveal-text text-[var(--color-secondary)]">Abdillah</div>
            </div>
            <div className="overflow-hidden">
              <div className="reveal-text text-white">Ferdyansyah</div>
            </div>
          </h1>

          <div className="overflow-hidden mt-12 max-w-2xl">
            <p className="reveal-text font-mono text-sm md:text-base leading-relaxed text-[var(--color-secondary)]">
              A dedicated Network Engineer, Linux Systems Administrator & Web Developer from SMKN 1 Denpasar majoring in Computer and Network Engineering (TKJ). Experienced in architecting robust network topologies using Cisco & MikroTik principles, managing secure Linux environments, and engineering modern, responsive web systems.
            </p>
          </div>
        </div>

        {/* Profile Card with Radial Glow and Masked Image */}
        <div className="profile-card relative flex-shrink-0 w-full max-w-[320px] md:max-w-[360px] lg:max-w-[420px] mx-auto lg:mx-0 self-center lg:-translate-y-12">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[110%] h-[110%] pointer-events-none -z-10"
            style={{
              background:
                'radial-gradient(ellipse at 50% 40%, rgba(242,125,38,0.12) 0%, rgba(255,255,255,0.03) 45%, transparent 70%)',
              filter: 'blur(30px)',
            }}
          />
          <div
            className="relative w-full overflow-hidden transition-transform duration-700 ease-out hover:scale-[1.02] rounded-2xl border border-[var(--color-border)] bg-black/40 p-2"
            style={{
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,1) 85%, rgba(0,0,0,0) 100%)',
            }}
          >
            <img
              src="/images/portal/profile.jpg"
              alt="Sabbil Abdillah Ferdyansyah"
              className="w-full h-auto object-cover rounded-xl drop-shadow-[0_20px_35px_rgba(0,0,0,0.9)]"
            />
          </div>
        </div>
      </div>

      {/* Story & Vision Two-Column Layout */}
      <div className="mt-28 md:mt-36 grid grid-cols-1 md:grid-cols-2 gap-16 max-w-5xl">
        <div className="overflow-hidden">
          <div className="reveal-text">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-8 border-b border-[var(--color-border)] pb-4 text-white">
              My Story
            </h2>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--color-secondary)]">
              Driven by curiosity for how computing systems operate from low-level network packets to high-level browser interfaces, I immersed myself in Debian and Arch Linux administration, Cisco packet routing, and web development. My education in Computer and Network Engineering (TKJ) at SMKN 1 Denpasar has instilled the discipline needed to build standardized, secure, and production-ready digital solutions.
            </p>
          </div>
        </div>

        <div className="overflow-hidden">
          <div className="reveal-text">
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-8 border-b border-[var(--color-border)] pb-4 text-white">
              My Vision
            </h2>
            <p className="font-sans text-sm md:text-base leading-relaxed text-[var(--color-secondary)]">
              To evolve into a multidisciplinary Infrastructure & Software Systems Engineer capable of bridging enterprise networking, automated cloud infrastructure, and modern web applications to empower modern organizations with high reliability and zero downtime.
            </p>
          </div>
        </div>
      </div>

      {/* Areas of Expertise Rows */}
      <div className="mt-36">
        <h2 className="text-sm font-mono uppercase tracking-[0.2em] mb-12 border-b border-[var(--color-border)] pb-4 text-white">
          Areas of Expertise
        </h2>
        <div className="flex flex-col">
          {expertiseList.map((exp, idx) => (
            <div
              key={idx}
              className="exp-item group border-b border-[var(--color-border)] p-4 md:p-8 flex flex-col md:flex-row gap-4 md:gap-12 transition-colors hover:bg-[var(--color-100)] -mx-4 md:-mx-8 rounded-xl"
            >
              <div className="md:w-1/4">
                <span className="font-mono text-xs opacity-50 tracking-widest text-white">
                  {exp.year}
                </span>
              </div>
              <div className="md:w-1/3">
                <h3 className="text-xl md:text-2xl font-bold tracking-tight mb-2 group-hover:text-[var(--color-accent)] transition-colors text-white">
                  {exp.title}
                </h3>
                <p className="font-mono text-xs text-[var(--color-secondary)] uppercase tracking-wider">
                  {exp.company}
                </p>
              </div>
              <div className="md:w-5/12 font-sans text-sm md:text-base text-[var(--color-secondary)] leading-relaxed group-hover:text-white transition-colors">
                {exp.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Arsenal & Technologies — Rich Categorized Structure */}
      <div className="mt-36">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 border-b border-[var(--color-border)] pb-6">
          <div>
            <h2 className="text-sm font-mono uppercase tracking-[0.2em] text-white flex items-center gap-3">
              <Sparkles className="w-4 h-4 text-[var(--color-accent)]" />
              <span>Arsenal & Technologies</span>
            </h2>
            <p className="font-mono text-xs text-[var(--color-secondary)] mt-2">
              Structured technical stack across Linux, networking, security, cloud, and software engineering ({totalSkillsCount} active technologies).
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setActiveCategory('all')}
              className={`px-3.5 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
                activeCategory === 'all'
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)] shadow-[0_0_15px_rgba(242,125,38,0.25)]'
                  : 'border-white/10 text-white/60 hover:text-white hover:border-white/30 bg-black/40'
              }`}
            >
              All ({totalSkillsCount})
            </button>
            {skillGroups.map((group) => {
              const active = activeCategory === group.id;
              return (
                <button
                  key={group.id}
                  onClick={() => setActiveCategory(group.id)}
                  className={`px-3 py-1.5 rounded-full font-mono text-xs uppercase tracking-wider transition-all duration-300 border ${
                    active
                      ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)] shadow-[0_0_15px_rgba(242,125,38,0.25)]'
                      : 'border-white/10 text-white/60 hover:text-white hover:border-white/30 bg-black/40'
                  }`}
                >
                  {group.category.split(' ')[0]} ({group.skills.length})
                </button>
              );
            })}
          </div>
        </div>

        {/* Categorized Bento Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => {
            const Icon = group.icon;
            return (
              <div
                key={group.id}
                className="p-6 md:p-8 rounded-2xl border border-[var(--color-border)] bg-black/40 backdrop-blur-md hover:border-white/20 transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-accent)]/[0.03] rounded-full blur-2xl pointer-events-none" />

                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-10 h-10 rounded-xl border border-white/10 bg-white/[0.03] flex items-center justify-center text-white group-hover:text-[var(--color-accent)] group-hover:border-[var(--color-accent)]/50 transition-colors">
                      <Icon className="w-5 h-5" strokeWidth={1.5} />
                    </div>
                    <span className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                      {group.skills.length} Items
                    </span>
                  </div>

                  <h3 className="font-sans text-lg font-bold text-white group-hover:text-[var(--color-accent)] transition-colors mb-2">
                    {group.category}
                  </h3>
                  <p className="font-mono text-xs text-[var(--color-secondary)] leading-relaxed mb-6">
                    {group.description}
                  </p>
                </div>

                {/* Tech Pills */}
                <div className="flex flex-wrap gap-2 pt-2 border-t border-white/5">
                  {group.skills.map((skill, sIdx) => (
                    <span
                      key={sIdx}
                      className="px-3 py-1.5 rounded-lg border border-white/10 bg-black/60 text-white/90 font-mono text-[11px] uppercase tracking-wider hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-all duration-200 cursor-default"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Global Pill Cloud for Quick Glance */}
        <div className="mt-12 p-6 rounded-2xl border border-[var(--color-border)] bg-black/30">
          <div className="flex items-center gap-2 mb-4 font-mono text-xs uppercase tracking-widest text-white/60">
            <Layers className="w-3.5 h-3.5 text-[var(--color-accent)]" />
            <span>Complete Stack Array</span>
          </div>
          <div className="flex flex-wrap gap-2.5 font-mono text-xs uppercase tracking-widest">
            {skillGroups
              .flatMap((g) => g.skills)
              .map((tech, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 border border-white/10 rounded-full hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] text-white/80 transition-all duration-200 shadow-[0_0_10px_rgba(255,255,255,0)] hover:shadow-[0_0_15px_rgba(242,125,38,0.2)] bg-black/50 text-[11px]"
                >
                  {tech}
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Next Page Banner */}
      <TycamiNextBanner
        to="/work"
        text="EXPLORE PROJECT"
        label="Next — Selected Works"
        description="A curated collection of my most impactful projects, bridging robust infrastructure with modern digital interfaces."
      />
    </div>
  );
};
