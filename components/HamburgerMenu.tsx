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
        className="fixed top-4 right-4 z-50 p-3 bg-white dark:bg-neutral-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow"
        aria-label="Menu"
      >
        <div className="w-6 h-5 flex flex-col justify-between">
          <span
            className={`block h-0.5 w-full bg-neutral-700 dark:bg-neutral-300 transition-transform ${
              isOpen ? 'rotate-45 translate-y-2' : ''
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-neutral-700 dark:bg-neutral-300 transition-opacity ${
              isOpen ? 'opacity-0' : ''
            }`}
          ></span>
          <span
            className={`block h-0.5 w-full bg-neutral-700 dark:bg-neutral-300 transition-transform ${
              isOpen ? '-rotate-45 -translate-y-2' : ''
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
        className={`fixed top-0 right-0 h-full w-64 bg-white dark:bg-neutral-800 shadow-2xl z-40 transform transition-transform ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-6 pt-20">
          <nav className="space-y-2">
            {navItems.map(item => (
              <button
                key={item.path}
                onClick={() => {
                  router.push(item.path)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                  pathname === item.path
                    ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200'
                    : 'hover:bg-neutral-100 dark:hover:bg-neutral-700'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-8 border-t border-neutral-200 dark:border-neutral-700">
            <button
              onClick={handleLogout}
              className="w-full text-left px-4 py-3 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 dark:text-red-400 flex items-center gap-3"
            >
              <span className="text-xl">🚪</span>
              <span className="font-medium">Sign out</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
