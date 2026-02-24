import { Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Button from '../ui/Button'

const navLinks = [
  { to: "/speakers" as const, label: "Speakers" },
  { to: "/checkout" as const, label: "Reserve a Ticket" },
  { to: "/packages" as const, label: "Packages" }
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-40 bg-surface-page backdrop-blur py-2 md:py-4 text-white">
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link to="/" className="text-lg font-bold tracking-tight">
            <img src='/assets/logo.svg' alt='Logo' className='h-8 md:h-10' />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 transition-[0.5s]">
            <Link
              key={"home"}
              to={"/"}
              className="text-p-md text-color-purple-50 hover:text-pink-500 "
              activeProps={{ className: 'text-pink-500' }}
              activeOptions={{ exact: true }}
            >
              Home
            </Link>
            <Link
              key={"speakers"}
              to={"/speakers"}
              className="text-p-md text-color-purple-50 hover:text-pink-500 "
              activeProps={{ className: 'text-pink-500' }}
              activeOptions={{ exact: true }}
            >
              Speakers
            </Link>
            <Link
              key={"packages"}
              to={"/packages"}
              className="text-p-md text-color-purple-50 hover:text-pink-500 "
              activeProps={{ className: 'text-pink-500' }}
              activeOptions={{ exact: true }}
            >
              Sponsor
            </Link>
            <Link to='/checkout'>
              <Button label='Reserve a Ticket' />
            </Link>
          </nav>

          {/* Mobile hamburger */}
          <button
            onClick={() => setIsOpen(true)}
            className="md:hidden p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile drawer overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile drawer */}
      <aside
        className={`fixed top-0 left-0 h-full w-72 bg-surface-page text-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col md:hidden ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <div className="text-lg font-bold tracking-tight">
            <img src='/assets/logo.svg' alt='Logo' className='h-6' />
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 p-4 flex flex-col gap-1">
          {navLinks.map(({ to, label }) => (
            <Link
              key={to}
              to={to}
              onClick={() => setIsOpen(false)}
              className="p-3 rounded-lg text-gray-300 hover:text-white hover:bg-purple-500 transition-colors text-p-lg"
              activeProps={{ className: 'p-3 rounded-md text-white bg-purple-500' }}
              activeOptions={{ exact: true }}
            >
              {label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  )
}
