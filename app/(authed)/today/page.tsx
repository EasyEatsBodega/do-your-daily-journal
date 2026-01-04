'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthGate } from '@/components/AuthGate'
import { HamburgerMenu } from '@/components/HamburgerMenu'
// formatDate will be defined inline to avoid server/client issues

interface Entry {
  date: string
  status: string
  accomplished: string
  couldDoBetter: string
  proudHappy: string
}

export default function TodayPage() {
  const router = useRouter()
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [dateDisplay, setDateDisplay] = useState('')

  useEffect(() => {
    fetchEntry()
  }, [])

  const fetchEntry = async () => {
    try {
      const res = await fetch('/api/journal/get-today')
      if (res.ok) {
        const data = await res.json()

        // If entry is already submitted, redirect to complete page
        // Today's page should only show fresh drafts for the current day
        if (data.status === 'SUBMITTED') {
          router.push(`/complete?date=${data.date}`)
          return
        }

        setEntry(data)

        // Format date for display - parse as UTC to avoid timezone shifts
        const [year, month, day] = data.date.split('-').map(Number)
        const date = new Date(Date.UTC(year, month - 1, day))
        setDateDisplay(new Intl.DateTimeFormat('en-US', {
          timeZone: 'UTC',
          weekday: 'long',
          month: 'short',
          day: 'numeric',
        }).format(date))
      }
    } catch (error) {
      console.error('Failed to fetch entry:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field: keyof Entry, value: string) => {
    if (!entry) return
    setEntry({ ...entry, [field]: value })
    
    // Debounced autosave
    setSaveStatus('saving')
    clearTimeout((window as any).saveTimeout)
    ;(window as any).saveTimeout = setTimeout(() => {
      saveDraft()
    }, 1000)
  }

  const saveDraft = async () => {
    if (!entry) return
    setSaving(true)
    try {
      await fetch('/api/journal/save-draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accomplished: entry.accomplished,
          couldDoBetter: entry.couldDoBetter,
          proudHappy: entry.proudHappy,
        }),
      })
      setSaveStatus('saved')
      setTimeout(() => setSaveStatus('idle'), 2000)
    } catch (error) {
      console.error('Failed to save draft:', error)
      setSaveStatus('idle')
    } finally {
      setSaving(false)
    }
  }

  const handleSubmit = async () => {
    if (!entry) return
    
    if (!entry.accomplished || !entry.couldDoBetter || !entry.proudHappy) {
      alert('Please fill in all fields')
      return
    }

    setSubmitting(true)
    try {
      const res = await fetch('/api/journal/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          accomplished: entry.accomplished,
          couldDoBetter: entry.couldDoBetter,
          proudHappy: entry.proudHappy,
        }),
      })

      if (res.ok) {
        router.push(`/complete?date=${entry.date}`)
      } else {
        alert('Failed to submit entry')
      }
    } catch (error) {
      console.error('Failed to submit:', error)
      alert('Failed to submit entry')
    } finally {
      setSubmitting(false)
    }
  }

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' })
    router.push('/login')
  }

  if (loading) {
    return (
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg font-serif">Loading your journal...</div>
        </div>
      </AuthGate>
    )
  }

  if (!entry) {
    return (
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg font-serif">Failed to load entry</div>
        </div>
      </AuthGate>
    )
  }

  return (
    <AuthGate>
      <HamburgerMenu />
      <div className="min-h-screen py-6 sm:py-12 px-3 sm:px-4 lg:px-8 pb-safe">
        <div className="max-w-3xl mx-auto">
          {/* Journal Book Container */}
          <div className="journal-page rounded-lg p-6 sm:p-12 lg:p-16 relative">
            {/* Decorative margin line (like a real journal) - hidden on mobile */}
            <div className="hidden sm:block absolute left-12 sm:left-16 top-0 bottom-0 w-px bg-ink-light/20 dark:bg-sepia-warm/20"></div>

            {/* Content with left margin */}
            <div className="sm:ml-4">
              {/* Date Header */}
              <div className="mb-12 border-b-2 border-ink-light/20 dark:border-sepia-warm/20 pb-4">
                <h1 className="journal-date mb-2">{dateDisplay}</h1>
                <p className="font-handwriting text-xl text-ink-light dark:text-sepia-warm/60 italic">
                  My daily reflection
                </p>
              </div>

              {/* Journal Entries */}
              <div className="space-y-10">
                {/* Entry 1 */}
                <div>
                  <label className="journal-prompt block mb-3">
                    What did you accomplish today?
                  </label>
                  <textarea
                    value={entry.accomplished}
                    onChange={(e) => handleChange('accomplished', e.target.value)}
                    className="journal-input"
                    rows={6}
                    placeholder="Today I worked on..."
                  />
                </div>

                {/* Entry 2 */}
                <div>
                  <label className="journal-prompt block mb-3">
                    What would you do differently?
                  </label>
                  <textarea
                    value={entry.couldDoBetter}
                    onChange={(e) => handleChange('couldDoBetter', e.target.value)}
                    className="journal-input"
                    rows={3}
                    placeholder="Next time I&apos;ll try..."
                  />
                </div>

                {/* Entry 3 */}
                <div>
                  <label className="journal-prompt block mb-3">
                    What are you proud of today?
                  </label>
                  <textarea
                    value={entry.proudHappy}
                    onChange={(e) => handleChange('proudHappy', e.target.value)}
                    className="journal-input"
                    rows={3}
                    placeholder="I&apos;m grateful for..."
                  />
                </div>
              </div>

              {/* Footer with save status and button */}
              <div className="flex flex-col sm:flex-row items-center justify-between mt-12 sm:mt-16 pt-6 border-t-2 border-ink-light/20 dark:border-sepia-warm/20 gap-4">
                <div className="font-handwriting text-base sm:text-lg text-ink-light/70 dark:text-sepia-warm/50 order-2 sm:order-1">
                  {saveStatus === 'saving' && '✍️ Saving...'}
                  {saveStatus === 'saved' && '✓ Saved'}
                  {saveStatus === 'idle' && '\u00A0'}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="w-full sm:w-auto bg-ink dark:bg-sepia-warm text-paper dark:text-paper-dark font-handwriting text-lg sm:text-xl py-4 sm:py-3 px-8 sm:px-10 rounded-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 order-1 sm:order-2 touch-manipulation"
                >
                  {submitting ? 'Saving to calendar...' : 'Save my day'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

