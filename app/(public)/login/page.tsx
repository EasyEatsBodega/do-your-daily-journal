'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    // Check if already logged in
    fetch('/api/journal/get-today')
      .then((res) => {
        if (res.ok) {
          router.push('/today')
        }
      })
      .catch(() => {
        // Not logged in, stay on login page
      })
  }, [router])

  const handleGoogleLogin = () => {
    setLoading(true)
    window.location.href = '/api/auth/google/start'
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-2 text-center">
            Calendar Journal
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8">
            Your day, saved to your calendar.
          </p>
          <p className="text-sm text-neutral-500 dark:text-neutral-500 text-center mb-6">
            Write a 2-minute check-in each night. Later, click any day in Google
            Calendar to remember it.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : 'Continue with Google'}
          </button>

          <div className="mt-6 text-xs text-neutral-500 dark:text-neutral-500 space-y-2">
            <p>
              We'll ask for Calendar access to save your daily journal as an
              all-day event after you submit.
            </p>
            <p>
              We'll ask for Gmail send permission to email you a reminder at
              8pm local time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

