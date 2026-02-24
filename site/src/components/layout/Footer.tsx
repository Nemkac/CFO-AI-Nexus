import { Link } from '@tanstack/react-router'

export default function Footer() {
  return (
    <footer className="bg-surface-page py-12 w-full">
      <div className="max-w-6xl mx-auto px-6 flex flex-col gap-10 md:gap-30">
        <div className="flex flex-col md:flex-row items-start justify-between gap-8">
          <div className="flex flex-col items-start gap-6">
            <img src="/assets/logo.svg" alt="Logo" className="h-10 w-auto" />
            <p className="text-p-md text-content-body max-w-xs whitespace-pre-line">
              {`The world's leading\ncommunity for\ntechnology-driven finance\nleaders.`}
            </p>
          </div>
          <nav className="flex flex-col gap-4">
            <span className="text-p-md text-content-heading">Quick links</span>
            <div className='flex flex-col gap-2'>
              <Link to="/" className="text-p-md-link text-content-body hover:text-pink-500 underline">Home</Link>
              <Link to="/speakers" className="text-p-md-link text-content-body hover:text-pink-500">Speaker Portal</Link>
              <Link to="/checkout" className="text-p-md-link text-content-body hover:text-pink-500">Program Agenda</Link>
              <Link to="/speakers" className="text-p-md-link text-content-body hover:text-pink-500">Exhibitor Opportunities</Link>
              <Link to="/checkout" className="text-p-md-link text-content-body hover:text-pink-500">Become a Sponsor</Link>
            </div>
          </nav>
          <div className="flex flex-col gap-4">
            <span className="text-p-md text-white">When</span>
            <p className="text-p-md text-content-body">October 20–21, 2026</p>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-6 w-full items-center md:justify-between text-center">
          <p className="text-p-sm text-white">© {new Date().getFullYear()} Swiss Gate. All rights reserved.</p>
          <p className="text-p-sm text-white underline cursor-pointer">Terms & Conditions | Cookie Policy | Privacy Policy</p>
        </div>
      </div>
    </footer>
  )
}
