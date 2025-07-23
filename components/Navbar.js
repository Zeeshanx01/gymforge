'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'

const navItems = [
  { name: 'Home', href: '/' },
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Profile', href: '/profile' },
  { name: 'Progress', href: '/progress' },
  { name: 'Test Firebase', href: '/test-firebase' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  const toggleMenu = () => setMenuOpen(!menuOpen)

  return (
    <nav className="w-full bg-zinc-900 text-zinc-100 border-b border-zinc-700 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
          GymForge
        </Link>

        {/* Desktop Menu */}
        <div className="hidden space-x-6 sm:flex">

          <Link
            className={`transition font-medium hover:text-blue-400 ${pathname === '/admin' ? 'text-blue-400 font-bold' : 'text-zinc-300'}`}
            href='/admin'
          >
            Admin
          </Link>

          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition font-medium hover:text-blue-400 ${pathname === item.href ? 'text-blue-400 font-bold' : 'text-zinc-300'}`}
            >
              {item.name}
            </Link>
          ))}
        </div>


        <div className=' flex justify-center items-center space-x-4'>

          <Link
            className={`transition sm:hidden font-medium hover:text-blue-400 ${pathname === '/admin' ? 'text-blue-400 font-bold' : 'text-zinc-300'}`}
            href='/admin'
          >
            Admin
          </Link>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-zinc-200 hover:text-blue-400 transition"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

      </div>

      {/* Mobile Menu Dropdown */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 bg-zinc-900">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-2 rounded transition font-medium hover:bg-zinc-800 hover:text-blue-400 ${pathname === item.href ? 'text-blue-400 font-bold' : 'text-zinc-300'
                }`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
