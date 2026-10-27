import { Link, useLocation } from '@tanstack/react-router'
import { useConsent } from '@/components/consent/ConsentProvider'
import { useAgendaModal } from '@/components/layout/AgendaModalContext'

export default function Footer() {
  const { openSettings } = useConsent()
  const { openAgenda } = useAgendaModal()
  const pathname = useLocation({ select: (location) => location.pathname })

  return (
    <footer className="bg-surface-page py-12 w-full">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10 md:gap-30">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex flex-col items-start gap-6">
            <img src="/assets/logo.svg" alt="Logo" className="h-10 w-auto" />
            <p className="text-p-md text-content-body max-w-xs whitespace-pre-line">
              {`The world's leading\ncommunity for\ntechnology-driven finance\nleaders.`}
            </p>
            <a
              href="https://www.linkedin.com/showcase/cfo-ai-nexus/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="CFO AI Nexus on LinkedIn"
              className="flex items-center justify-center size-10 rounded-xl border-[0.5px] border-stroke-default hover:border-pink-500 hover:-translate-y-0.5 transition-all"
            >
              {/* The project mark carries the site's pink→blue gradient, so it is used
                  as an image rather than a currentColor icon. */}
              <img src="/icons/linkedin.svg" alt="" className="size-5" />
            </a>
          </div>
          <nav className="flex flex-col gap-4">
            <span className="text-p-md text-content-heading">Quick links</span>
            <div className='flex flex-col gap-2'>
              <Link to="/checkout" className="text-p-md-link text-pink-500 hover:text-pink-300">Get Tickets – $295</Link>
              <Link to="/" className="text-p-md-link text-content-body hover:text-pink-500 underline">Home</Link>
              <Link to="/speakers" className="text-p-md-link text-content-body hover:text-pink-500">Speaker Portal</Link>
              <button
                type="button"
                onClick={openAgenda}
                className="text-p-md-link text-content-body hover:text-pink-500 text-left cursor-pointer"
              >
                Program Agenda
              </button>
              <Link to="/packages" className="text-p-md-link text-content-body hover:text-pink-500">Sponsor and Exhibitors Opportunities</Link>
            </div>
          </nav>
          <div className="flex flex-col gap-4">
            <span className="text-p-md text-white">About</span>
            <Link to="/organizer" className="text-p-md-link text-content-body hover:text-pink-500 underline">Organizer</Link>
            <Link to="/sponsors-and-exhibitors" className="text-p-md-link text-content-body hover:text-pink-500">Sponsors and Exhibitors</Link>
            {/* Renders as href="/#join-brella" so it works from every page. Glides on the
                homepage; from other pages the homepage loads already at the section. */}
            <Link
              to="/"
              hash="join-brella"
              hashScrollIntoView={{ behavior: pathname === '/' ? 'smooth' : 'instant', block: 'start' }}
              className="text-p-md-link text-content-body hover:text-pink-500"
            >
              How to join via Brella
            </Link>
            <p className="text-p-md text-content-body">October 20–21, 2026</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full items-center md:justify-between text-center">
          <p className="text-p-sm text-white">© {new Date().getFullYear()} CFO AI Nexus Conference. All rights reserved.</p>
          <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-p-sm text-white">
            <Link to="/privacy-policy" className="underline hover:text-pink-500">Privacy Policy</Link>
            <span aria-hidden>|</span>
            <Link to="/terms" className="underline hover:text-pink-500">Terms &amp; Conditions</Link>
            <span aria-hidden>|</span>
            <button type="button" onClick={openSettings} className="underline hover:text-pink-500 cursor-pointer">
              Cookie Settings
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}
