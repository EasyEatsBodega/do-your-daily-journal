'use client'

import { useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export function HamburgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const navItems = [
    { label: 'Today', path: '/today', icon: '📝' },
    { label: 'Calendar', path: '/calendar', icon: '📅' },
    { label: 'Settings', path: '/settings', icon: '⚙️' },
  ]

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 right-4 z-50 p-3 bg-paper dark:bg-paper-dark rounded-lg shadow-lg hover:shadow-xl transition-all border-2 border-ink/20 dark:border-sepia-warm/20"
        aria-label="Menu"
      >
        <div className="w-7 h-6 flex flex-col justify-between">
          <span
            className={`block h-1 w-full bg-ink dark:bg-sepia-warm rounded-full transition-transform ${
              isOpen ? 'rotate-45 translate-y-2.5' : ''
            }`}
          ></span>
          <span
            className={`block h-1 w-full bg-ink dark:bg-sepia-warm rounded-full transition-opacity ${
              isOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`block h-1 w-full bg-ink dark:bg-sepia-warm rounded-full transition-transform ${
              isOpen ? '-rotate-45 -translate-y-2.5' : ''
            }`}
          ></span>
        </div>
      </button>

      {/* Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* Slide-out Menu */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-80 bg-paper dark:bg-paper-dark shadow-2xl z-40 transform transition-transform border-l-4 border-ink/20 dark:border-sepia-warm/20 ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-20 h-full overflow-y-auto">
          <h2 className="font-handwriting text-3xl text-ink dark:text-sepia-warm mb-6">Menu</h2>

          <nav className="space-y-3">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-5 py-4 rounded-lg transition-all flex items-center gap-4 font-serif text-lg ${
                  pathname === item.path
                    ? 'bg-ink/10 dark:bg-sepia-warm/20 text-ink dark:text-sepia-warm border-2 border-ink/30 dark:border-sepia-warm/30 shadow-md'
                    : 'hover:bg-ink/5 dark:hover:bg-sepia-warm/10 text-ink-light dark:text-sepia-warm/80 border-2 border-transparent'
                }`}
              >
                <span className="text-2xl">{item.icon}</span>
                <span className="font-semibold">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t-2 border-ink-light/20 dark:border-sepia-warm/20">
            <button
              onClick={handleLogout}
              className="w-full text-left px-5 py-4 rounded-lg transition-all hover:bg-red-100 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400 flex items-center gap-4 font-serif text-lg border-2 border-transparent hover:border-red-300 dark:hover:border-red-700"
            >
              <span className="text-2xl">🚪</span>
              <span className="font-semibold">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
