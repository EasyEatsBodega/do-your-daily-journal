'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, Suspense } from 'react'

function LoginPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(false)
  const error = searchParams.get('error')

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
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-lg w-full mx-4">
        <div className="journal-page rounded-lg p-10 sm:p-12">
          <h1 className="font-handwriting text-5xl text-ink dark:text-sepia-warm mb-3 text-center">
            Daily Entry
          </h1>
          <p className="font-serif text-xl text-ink-light dark:text-sepia-warm/80 text-center mb-8 italic">
            Your day, saved to your calendar
          </p>
          <p className="font-serif text-base text-ink-light dark:text-sepia-warm/70 text-center mb-8 leading-relaxed">
            Write a 2-minute check-in each night. Later, click any day in Google
            Calendar to remember it.
          </p>

          <button
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full bg-ink dark:bg-sepia-warm text-paper dark:text-paper-dark font-handwriting text-xl py-4 px-6 rounded-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 mb-8"
          >
            {loading ? 'Loading...' : 'Continue with Google'}
          </button>

          <div className="border-t-2 border-ink-light/20 dark:border-sepia-warm/20 pt-6 space-y-3">
            <p className="font-serif text-sm text-ink-light/80 dark:text-sepia-warm/60 leading-relaxed">
              We&apos;ll ask for Calendar access to save your daily journal as an
              all-day event after you submit.
            </p>
            <p className="font-serif text-sm text-ink-light/80 dark:text-sepia-warm/60 leading-relaxed">
              We&apos;ll ask for Gmail send permission to email you a reminder at
              8pm local time.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800">
          <div className="text-lg">Loading...</div>
        </div>
      }
    >
      <LoginPageContent />
    </Suspense>
  )
}

