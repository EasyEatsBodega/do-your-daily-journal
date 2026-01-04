'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { AuthGate } from '@/components/AuthGate'
import { HamburgerMenu } from '@/components/HamburgerMenu'
// formatDate will be defined inline

interface Entry {
  date: string
  status: string
  accomplished: string
  couldDoBetter: string
  proudHappy: string
}

export default function CompletePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const date = searchParams.get('date')
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateDisplay, setDateDisplay] = useState('')

  useEffect(() => {
    if (date) {
      fetchEntry()
    }
  }, [date])

  const fetchEntry = async () => {
    try {
      const res = await fetch(`/api/journal/entry/${date}`)
      if (res.ok) {
        const data = await res.json()
        setEntry(data)
        // Format date for display - parse as UTC to avoid timezone shifts
        const [year, month, day] = data.date.split('-').map(Number)
        const dateObj = new Date(Date.UTC(year, month - 1, day))
        setDateDisplay(new Intl.DateTimeFormat('en-US', {
          timeZone: 'UTC',
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }).format(dateObj))
      }
    } catch (error) {
      console.error('Failed to fetch entry:', error)
    } finally {
      setLoading(false)
    }
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

  if (!entry) {
    return (
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Entry not found</div>
        </div>
      </AuthGate>
    )
  }

  return (
    <AuthGate>
      <HamburgerMenu />
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-4xl font-bold mb-2 text-center">Saved.</h1>
            <p className="text-xl font-semibold text-blue-600 dark:text-blue-400 text-center mb-2">
              {dateDisplay}
            </p>
            <p className="text-neutral-600 dark:text-neutral-400 text-center mb-8">
              Your journal is now attached to {dateDisplay} in Google Calendar.
            </p>

            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-6 space-y-4 mb-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  What I accomplished
                </h3>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {entry.accomplished}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  What I could do better
                </h3>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {entry.couldDoBetter}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-1">
                  What I'm proud of
                </h3>
                <p className="text-neutral-900 dark:text-neutral-100">
                  {entry.proudHappy}
                </p>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => router.push(`/edit/${date}`)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Edit entry
              </button>
              <button
                onClick={() => router.push(`/entry/${date}`)}
                className="bg-neutral-200 hover:bg-neutral-300 dark:bg-neutral-700 dark:hover:bg-neutral-600 text-neutral-900 dark:text-neutral-100 font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                View entry
              </button>
            </div>

            <p className="text-center text-sm text-neutral-500 dark:text-neutral-400 mt-6">
              Come back tomorrow. We'll remind you at 8pm.
            </p>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

