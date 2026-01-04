'use client'

import { useEffect, useState, Suspense } from 'react'
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

function CompletePageContent() {
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
          <div className="text-lg font-serif">Loading...</div>
        </div>
      </AuthGate>
    )
  }

  if (!entry) {
    return (
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg font-serif">Entry not found</div>
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
              {/* Success Header */}
              <div className="text-center mb-12">
                <h1 className="font-handwriting text-5xl text-ink dark:text-sepia-warm mb-3">
                  Saved ✓
                </h1>
                <p className="journal-date mb-2">
                  {dateDisplay}
                </p>
                <p className="font-serif text-lg text-ink-light dark:text-sepia-warm/70 italic">
                  Your journal is preserved in Google Calendar
                </p>
              </div>

              {/* Journal Entry Preview */}
              <div className="space-y-8 mb-12 border-t-2 border-b-2 border-ink-light/20 dark:border-sepia-warm/20 py-8">
                <div>
                  <h3 className="journal-prompt text-xl mb-2">
                    What I accomplished
                  </h3>
                  <p className="font-serif text-lg text-ink dark:text-sepia-warm leading-relaxed">
                    {entry.accomplished}
                  </p>
                </div>
                <div>
                  <h3 className="journal-prompt text-xl mb-2">
                    What I could do better
                  </h3>
                  <p className="font-serif text-lg text-ink dark:text-sepia-warm leading-relaxed">
                    {entry.couldDoBetter}
                  </p>
                </div>
                <div>
                  <h3 className="journal-prompt text-xl mb-2">
                    What I&apos;m proud of
                  </h3>
                  <p className="font-serif text-lg text-ink dark:text-sepia-warm leading-relaxed">
                    {entry.proudHappy}
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-center mb-8">
                <button
                  onClick={() => router.push(`/edit/${date}`)}
                  className="bg-ink dark:bg-sepia-warm text-paper dark:text-paper-dark font-handwriting text-xl py-3 px-8 rounded-md transition-all hover:scale-105 hover:shadow-lg"
                >
                  Edit entry
                </button>
                <button
                  onClick={() => router.push(`/entry/${date}`)}
                  className="border-2 border-ink dark:border-sepia-warm text-ink dark:text-sepia-warm font-handwriting text-xl py-3 px-8 rounded-md transition-all hover:scale-105"
                >
                  View entry
                </button>
              </div>

              <p className="text-center font-handwriting text-xl text-ink-light/70 dark:text-sepia-warm/60 italic">
                See you tomorrow... We&apos;ll remind you at 8pm
              </p>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

export default function CompletePage() {
  return (
    <Suspense fallback={
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthGate>
    }>
      <CompletePageContent />
    </Suspense>
  )
}

