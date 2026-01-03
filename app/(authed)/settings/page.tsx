'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthGate } from '@/components/AuthGate'

interface User {
  email: string
  calendarId: string
  timeZone: string
}

export default function SettingsPage() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchUser()
  }, [])

  const fetchUser = async () => {
    try {
      const res = await fetch('/api/user/me')
      if (res.ok) {
        const data = await res.json()
        setUser(data)
      }
    } catch (error) {
      console.error('Failed to fetch user:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  const handleReconnect = () => {
    window.location.href = '/api/auth/google/start'
  }

  if (loading) {
    return (
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthGate>
    )
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-8">Settings</h1>

            {user && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Connected Google account
                  </h3>
                  <p className="text-lg">{user.email}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Calendar
                  </h3>
                  <p className="text-lg">
                    Saving events to: {user.calendarId}
                  </p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Time zone
                  </h3>
                  <p className="text-lg">{user.timeZone}</p>
                </div>

                <div>
                  <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                    Reminder
                  </h3>
                  <p className="text-lg">
                    Daily reminder at 8pm local time: ON
                  </p>
                </div>
              </div>
            )}

            <div className="mt-8 space-y-4">
              <button
                onClick={handleReconnect}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Reconnect Google
              </button>
              <button
                onClick={handleLogout}
                className="w-full bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Sign out
              </button>
            </div>

            <div className="mt-8">
              <button
                onClick={() => router.push('/today')}
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
              >
                ← Back to today
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

