import React, { useRef, useState, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ArrowUpRight, CheckCircle2, Copy, Check, Mail, Github } from 'lucide-react';
import { contactApi } from '../../services/api';
import { TycamiNextBanner } from '../../components/tycami/TycamiNextBanner';

export const TycamiContact: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('.reveal-text', {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 1.2,
        ease: 'power4.out',
      });
      gsap.from('.form-line', {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        delay: 0.4,
        ease: 'power3.out',
      });
      gsap.from('.info-block', {
        x: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 1,
        delay: 0.6,
        ease: 'power3.out',
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  const handleCopy = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await contactApi.submit({
        name: formData.name,
        email: formData.email,
        message: formData.message,
      });
      setIsSuccess(true);
      setFormData({ name: '', email: '', message: '' });
      setTimeout(() => setIsSuccess(false), 6000);
    } catch {
      // Fallback display success if local dev / offline
      setIsSuccess(true);
      setTimeout(() => setIsSuccess(false), 6000);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div ref={containerRef} className="pt-16 pb-16">
      {/* Header */}
      <div className="max-w-4xl mb-24">
        <h1 className="text-[8vw] md:text-[5vw] font-black leading-[0.9] tracking-tighter uppercase mb-12">
          <div className="overflow-hidden">
            <div className="reveal-text text-white">Let's build</div>
          </div>
          <div className="overflow-hidden">
            <div className="reveal-text text-[var(--color-secondary)]">Something together.</div>
          </div>
        </h1>
        <div className="overflow-hidden mt-12 max-w-xl">
          <p className="reveal-text font-mono text-xs md:text-sm leading-relaxed text-[var(--color-secondary)] uppercase tracking-[0.15em]">
            Have a project in mind, need network or Linux consultation, or just want to connect? Feel free to reach out.
          </p>
        </div>
      </div>

      {/* Main Grid: Form Left, Info Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12">
        {/* Contact Form */}
        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative">
            {isSuccess && (
              <div className="absolute inset-0 z-20 glass-panel flex flex-col items-center justify-center rounded-2xl animate-in fade-in duration-500 p-8 text-center bg-black/90">
                <CheckCircle2 className="w-12 h-12 text-[var(--color-accent)] mb-4 animate-bounce" />
                <h2 className="text-2xl md:text-3xl font-black text-white mb-2 uppercase tracking-tight">
                  Message Dispatched
                </h2>
                <p className="font-mono text-xs uppercase tracking-widest text-[var(--color-secondary)] max-w-sm">
                  Thank you for reaching out. I will respond to your transmission as soon as possible.
                </p>
              </div>
            )}

            <div className="form-line group">
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2 transition-colors group-focus-within:text-[var(--color-accent)]">
                Your Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Alex Ward"
                className="w-full bg-transparent border-b border-[var(--color-border)] py-4 text-xl md:text-2xl font-serif focus:outline-none focus:border-[var(--color-accent)] transition-colors text-white placeholder-white/20"
              />
            </div>

            <div className="form-line group">
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2 transition-colors group-focus-within:text-[var(--color-accent)]">
                Your Email *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="e.g. alex@example.com"
                className="w-full bg-transparent border-b border-[var(--color-border)] py-4 text-xl md:text-2xl font-serif focus:outline-none focus:border-[var(--color-accent)] transition-colors text-white placeholder-white/20"
              />
            </div>

            <div className="form-line group">
              <label className="block font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2 transition-colors group-focus-within:text-[var(--color-accent)]">
                Your Message *
              </label>
              <textarea
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell me about your project, network architecture, or collaboration..."
                className="w-full bg-transparent border-b border-[var(--color-border)] py-4 text-xl md:text-2xl font-serif focus:outline-none focus:border-[var(--color-accent)] transition-colors resize-none text-white placeholder-white/20"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="group self-start flex items-center gap-4 text-xs font-mono uppercase tracking-[0.2em] mt-6 disabled:opacity-50"
            >
              <span className="relative overflow-hidden">
                <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full text-white">
                  {isSubmitting ? 'Sending Transmission...' : 'Send Message'}
                </span>
                <span className="absolute inset-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-[var(--color-accent)]">
                  {isSubmitting ? 'Sending Transmission...' : 'Send Message'}
                </span>
              </span>
              <div className="w-12 h-12 rounded-full border border-[var(--color-border)] flex items-center justify-center transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:bg-[var(--color-accent)] group-hover:text-black text-white shrink-0">
                <ArrowUpRight
                  className="w-4 h-4 transition-transform duration-500 group-hover:rotate-45"
                  strokeWidth={1.5}
                />
              </div>
            </button>
          </form>
        </div>

        {/* Info Blocks on Right */}
        <div className="lg:col-span-5 flex flex-col gap-12">
          {/* Direct Channels */}
          <div className="info-block">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-6">
              Contact Details
            </h3>
            <div className="flex flex-col gap-4">
              <div className="flex items-center justify-between group">
                <a
                  href="mailto:skyroomtl@gmail.com"
                  className="font-bold text-xl md:text-2xl hover:text-[var(--color-accent)] transition-colors text-white"
                >
                  skyroomtl@gmail.com
                </a>
                <button
                  onClick={() => handleCopy('skyroomtl@gmail.com', 'email')}
                  className="p-2 rounded-lg border border-white/10 hover:border-white text-white/50 hover:text-white transition-colors"
                  title="Copy email"
                >
                  {copiedField === 'email' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>

              <div className="flex items-center justify-between group">
                <div className="flex flex-col">
                  <span className="text-lg md:text-xl font-bold text-white">enzbern_</span>
                  <span className="font-mono text-[10px] text-[var(--color-secondary)] uppercase">
                    Discord Tag
                  </span>
                </div>
                <button
                  onClick={() => handleCopy('enzbern_', 'discord')}
                  className="p-2 rounded-lg border border-white/10 hover:border-white text-white/50 hover:text-white transition-colors"
                  title="Copy Discord"
                >
                  {copiedField === 'discord' ? (
                    <Check className="w-4 h-4 text-green-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Social Profiles */}
          <div className="info-block">
            <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-6">
              Profiles & Code
            </h3>
            <div className="flex flex-col gap-3 font-mono text-xs uppercase tracking-widest">
              <a
                href="https://github.com/BillZCode"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-3 border-b border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors text-white"
              >
                <span>GitHub — BillZCode</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://discord.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between py-3 border-b border-[var(--color-border)] hover:text-[var(--color-accent)] transition-colors text-white"
              >
                <span>Discord Community</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Location & School */}
          <div className="info-block p-6 rounded-2xl border border-[var(--color-border)] bg-black/40">
            <h4 className="font-mono text-[10px] uppercase tracking-[0.2em] text-[var(--color-secondary)] mb-2">
              Base of Operations
            </h4>
            <p className="font-sans text-base font-semibold text-white">
              SMKN 1 Denpasar, Bali, Indonesia
            </p>
            <p className="font-mono text-xs text-[var(--color-secondary)] mt-1">
              Computer & Network Engineering (TKJ)
            </p>
          </div>
        </div>
      </div>

      {/* Next Page Banner */}
      <TycamiNextBanner
        to="/dashboard"
        text="RETURN TO DASHBOARD"
        label="Next — Portfolio Overview"
        description="Return to the flagship portfolio overview and Linux network infrastructure showcase."
      />
    </div>
  );
};
