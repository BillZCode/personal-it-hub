import React from 'react'
import { Link } from 'react-router-dom'
import { Github, Linkedin, Mail } from 'lucide-react'

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#080A10] border-t border-white/[0.06] py-6 px-4 sm:px-8 text-xs text-[#5E687E]">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-[#D2D8F0]">✦</span>
          <span className="font-display font-medium text-[#F4F3F8]">
            Sabbil Abdillah Ferdyansyah
          </span>
          <span>—</span>
          <span>SMKN 1 Denpasar (TKJ)</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 font-mono text-[11px] text-[#8E9AB5]">
          <Link to="/" className="hover:text-[#F4F3F8] transition-colors">
            Portal
          </Link>
          <Link to="/portfolio" className="hover:text-[#F4F3F8] transition-colors">
            Portfolio
          </Link>
          <Link to="/dashboard/netlab" className="hover:text-[#F4F3F8] transition-colors">
            NetLab
          </Link>
          <Link to="/dashboard/terminal" className="hover:text-[#F4F3F8] transition-colors">
            Terminal
          </Link>
          <div className="flex items-center gap-2.5 pl-2 border-l border-white/10">
            <a
              href="https://github.com/BillZCode"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4F3F8] transition-colors"
              title="GitHub"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
            <a
              href="https://www.linkedin.com/in/sabbil-abdillah-ferdyansyah-554b35326"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#F4F3F8] transition-colors"
              title="LinkedIn"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
            <a
              href="mailto:sabbilferdyansyah@gmail.com"
              className="hover:text-[#F4F3F8] transition-colors"
              title="Email"
            >
              <Mail className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer