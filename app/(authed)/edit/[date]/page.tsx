'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthGate } from '@/components/AuthGate'
import { HamburgerMenu } from '@/components/HamburgerMenu'

interface Entry {
  date: string
  status: string
  accomplished: string
  couldDoBetter: string
  proudHappy: string
}

export default function EditDatePage() {
  const router = useRouter()
  const params = useParams()
  const date = params.date as string
  const [entry, setEntry] = useState<Entry | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle')
  const [submitting, setSubmitting] = useState(false)
  const [dateDisplay, setDateDisplay] = useState('')
  const [isToday, setIsToday] = useState(false)
  const [isFuture, setIsFuture] = useState(false)

  useEffect(() => {
    if (date) {
      fetchEntry()
    }
  }, [date])

  const fetchEntry = async () => {
    try {
      // First, get today's date to check if this is a past/present/future date
      const todayRes = await fetch('/api/journal/get-today')
      let todayDate = ''
      if (todayRes.ok) {
        const todayData = await todayRes.json()
        todayDate = todayData.date
        setIsToday(date === todayDate)
        setIsFuture(date > todayDate)
      }

      // Try to fetch entry for the specified date
      const res = await fetch(`/api/journal/entry/${date}`)

      if (res.ok) {
        const data = await res.json()
        setEntry(data)
      } else {
        // Entry doesn't exist yet - create a draft
        setEntry({
          date: date,
          status: 'DRAFT',
          accomplished: '',
          couldDoBetter: '',
          proudHappy: '',
        })
      }

      // Format date for display
      const [year, month, day] = date.split('-').map(Number)
      const dateObj = new Date(Date.UTC(year, month - 1, day))
      setDateDisplay(new Intl.DateTimeFormat('en-US', {
        timeZone: 'UTC',
        weekday: 'long',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }).format(dateObj))
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
      await fetch('/api/journal/save-draft-for-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date,
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
      const res = await fetch('/api/journal/submit-for-date', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date: date,
          accomplished: entry.accomplished,
          couldDoBetter: entry.couldDoBetter,
          proudHappy: entry.proudHappy,
        }),
      })

      if (res.ok) {
        router.push(`/entry/${date}`)
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

  if (loading) {
    return (
      <AuthGate>
        <HamburgerMenu />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthGate>
    )
  }

  if (isFuture) {
    return (
      <AuthGate>
        <HamburgerMenu />
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="journal-page rounded-lg p-12 sm:p-16 text-center">
              <h1 className="font-handwriting text-4xl text-ink dark:text-sepia-warm mb-4">
                Cannot Edit Future Dates
              </h1>
              <p className="font-serif text-xl text-ink-light dark:text-sepia-warm/70 mb-8 italic">
                You can only create journal entries for today or past dates.
              </p>
              <button
                onClick={() => router.push('/calendar')}
                className="bg-ink dark:bg-sepia-warm text-paper dark:text-paper-dark font-handwriting text-xl py-3 px-8 rounded-md transition-all hover:scale-105 hover:shadow-lg"
              >
                Back to Calendar
              </button>
            </div>
          </div>
        </div>
      </AuthGate>
    )
  }

  if (!entry) {
    return (
      <AuthGate>
        <HamburgerMenu />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Failed to load entry</div>
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
                <div className="flex items-center justify-between mb-2">
                  <h1 className="journal-date">{dateDisplay}</h1>
                  {!isToday && (
                    <span className="font-handwriting text-lg bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-4 py-1 rounded-full">
                      Past Entry
                    </span>
                  )}
                </div>
                <p className="font-handwriting text-xl text-ink-light dark:text-sepia-warm/60 italic">
                  {isToday ? 'My daily reflection' : 'Reflecting on this day'}
                </p>
              </div>

              <div className="space-y-10">
                <div>
                  <label className="journal-prompt block mb-3">
                    What did you accomplish that day?
                  </label>
                  <textarea
                    value={entry.accomplished}
                    onChange={(e) => handleChange('accomplished', e.target.value)}
                    className="journal-input"
                    rows={6}
                    placeholder="That day I worked on..."
                  />
                </div>

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

                <div>
                  <label className="journal-prompt block mb-3">
                    What are you proud of?
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

              <div className="flex items-center justify-between mt-16 pt-6 border-t-2 border-ink-light/20 dark:border-sepia-warm/20">
                <div className="flex items-center gap-6">
                  <button
                    onClick={() => router.push('/calendar')}
                    className="font-handwriting text-xl text-ink-light dark:text-sepia-warm hover:text-ink dark:hover:text-sepia-warm/90 transition-colors"
                  >
                    ← Calendar
                  </button>
                  <div className="font-handwriting text-lg text-ink-light/70 dark:text-sepia-warm/50">
                    {saveStatus === 'saving' && '✍️ Saving...'}
                    {saveStatus === 'saved' && '✓ Saved'}
                    {saveStatus === 'idle' && '\u00A0'}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-ink dark:bg-sepia-warm text-paper dark:text-paper-dark font-handwriting text-xl py-3 px-10 rounded-md transition-all hover:scale-105 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                >
                  {submitting ? 'Saving...' : 'Save Entry'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}
