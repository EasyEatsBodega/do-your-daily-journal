'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
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

export default function EntryPage() {
  const router = useRouter()
  const params = useParams()
  const date = params.date as string
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
      } else {
        setEntry(null)
      }
    } catch (error) {
      console.error('Failed to fetch entry:', error)
      setEntry(null)
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
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="journal-page rounded-lg p-12 sm:p-16 text-center">
              <h1 className="font-handwriting text-4xl text-ink dark:text-sepia-warm mb-4">
                No entry for this day
              </h1>
              <button
                onClick={() => router.push('/today')}
                className="bg-ink dark:bg-sepia-warm text-paper dark:text-paper-dark font-handwriting text-xl py-3 px-8 rounded-md transition-all hover:scale-105 hover:shadow-lg"
              >
                Back to today
              </button>
            </div>
          </div>
        </div>
      </AuthGate>
    )
  }

  return (
    <AuthGate>
      <HamburgerMenu />
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="journal-page rounded-lg p-12 sm:p-16 relative">
            <div className="absolute left-16 top-0 bottom-0 w-px bg-ink-light/20 dark:bg-sepia-warm/20"></div>

            <div className="ml-4">
              <div className="mb-12 border-b-2 border-ink-light/20 dark:border-sepia-warm/20 pb-4">
                <h1 className="journal-date mb-2">{dateDisplay}</h1>
                <p className="font-handwriting text-xl text-ink-light dark:text-sepia-warm/60 italic">
                  A moment preserved
                </p>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="journal-prompt text-xl mb-3">
                    What I accomplished
                  </h3>
                  <p className="font-serif text-lg text-ink dark:text-sepia-warm leading-relaxed whitespace-pre-wrap">
                    {entry.accomplished}
                  </p>
                </div>
                <div>
                  <h3 className="journal-prompt text-xl mb-3">
                    What I could do better
                  </h3>
                  <p className="font-serif text-lg text-ink dark:text-sepia-warm leading-relaxed whitespace-pre-wrap">
                    {entry.couldDoBetter}
                  </p>
                </div>
                <div>
                  <h3 className="journal-prompt text-xl mb-3">
                    What I&apos;m proud of
                  </h3>
                  <p className="font-serif text-lg text-ink dark:text-sepia-warm leading-relaxed whitespace-pre-wrap">
                    {entry.proudHappy}
                  </p>
                </div>
              </div>

              <div className="mt-16 pt-6 border-t-2 border-ink-light/20 dark:border-sepia-warm/20">
                <button
                  onClick={() => router.push('/calendar')}
                  className="font-handwriting text-xl text-ink-light dark:text-sepia-warm hover:text-ink dark:hover:text-sepia-warm/90 transition-colors"
                >
                  ← Back to calendar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

