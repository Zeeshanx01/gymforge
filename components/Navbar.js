'use client'
import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { auth } from '@/lib/firebase'
import { signOut } from 'firebase/auth'

const commonNavItems = [
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
]

const userNavItems = [
  { name: 'Dashboard', href: '/dashboard' },
  { name: 'Profile', href: '/profile' },
  { name: 'Progress', href: '/progress' },
]

export default function Navbar() {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const { user, role, loading } = useAuth()

  const toggleMenu = () => setMenuOpen(!menuOpen)
  if (loading) return null

  const isAdmin = role === 'admin'
  const isUser = role === 'user'

  const visibleNavItems = [
    ...commonNavItems.filter((item) => !isAdmin),
    ...(isUser ? userNavItems : []),
    ...(isAdmin ? [{ name: 'Admin', href: '/admin' }] : []),
  ]

  console.log('NAVBAR admin: ', isAdmin,'user: ', isUser)

  const handleSignOut = async () => {
    try {
      await signOut(auth)
    } catch (error) {
      console.error('Sign out error:', error)
    }
  }

  return (
    <nav className="w-full bg-zinc-900 text-zinc-100 border-b border-zinc-700 shadow-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-white hover:text-blue-400 transition">
          GymForge
        </Link>

        {/* Desktop Links */}
        <div className="hidden space-x-6 sm:flex items-center">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`transition font-medium hover:text-blue-400 ${
                pathname === item.href ? 'text-blue-400 font-bold' : 'text-zinc-300'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {!user && (
            <Link
              href="/login"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-full text-sm duration-300"
            >
              Login
            </Link>
          )}

          {isAdmin && (
            <button
              onClick={handleSignOut}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold px-3 py-1.5 rounded-full text-sm duration-300"
            >
              Sign Out
            </button>
          )}
        </div>

        {/* Mobile Right Section */}
        <div className="flex items-center sm:hidden space-x-4">
          {!user && (
            <Link
              href="/login"
              className="bg-slate-800 hover:bg-slate-700 text-white font-semibold px-3 py-1.5 rounded-full text-sm duration-300"
            >
              Login
            </Link>
          )}
          <button
            className="text-zinc-200 hover:text-blue-400 transition"
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="sm:hidden px-4 pb-4 space-y-2 bg-zinc-900">
          {visibleNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMenuOpen(false)}
              className={`block py-2 px-2 rounded transition font-medium hover:bg-zinc-800 hover:text-blue-400 ${
                pathname === item.href ? 'text-blue-400 font-bold' : 'text-zinc-300'
              }`}
            >
              {item.name}
            </Link>
          ))}

          {isAdmin && (
            <button
              onClick={() => {
                setMenuOpen(false)
                handleSignOut()
              }}
              className="block w-full text-left py-2 px-2 rounded bg-red-600 hover:bg-red-700 text-white font-semibold transition"
            >
              Sign Out
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
