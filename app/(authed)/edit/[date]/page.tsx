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
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">Cannot Edit Future Dates</h1>
              <p className="text-neutral-600 dark:text-neutral-400 mb-6">
                You can only create journal entries for today or past dates.
              </p>
              <button
                onClick={() => router.push('/calendar')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold">{dateDisplay}</h1>
                {!isToday && (
                  <span className="text-sm bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 px-3 py-1 rounded-full">
                    Past Entry
                  </span>
                )}
              </div>
              <p className="text-neutral-500 dark:text-neutral-400">
                {isToday ? 'Your daily journal for today' : 'Fill in your journal entry for this date'}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What did you get done that day?
                </label>
                <textarea
                  value={entry.accomplished}
                  onChange={(e) => handleChange('accomplished', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                  rows={6}
                  placeholder="Write about what you accomplished..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  One thing you'd do differently next time?
                </label>
                <input
                  type="text"
                  value={entry.couldDoBetter}
                  onChange={(e) => handleChange('couldDoBetter', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                  placeholder="One sentence..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  One small win you're proud of?
                </label>
                <input
                  type="text"
                  value={entry.proudHappy}
                  onChange={(e) => handleChange('proudHappy', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                  placeholder="One sentence..."
                />
              </div>

              <div className="flex items-center justify-between pt-4">
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => router.push('/calendar')}
                    className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200"
                  >
                    ← Back to Calendar
                  </button>
                  <div className="text-sm text-neutral-500">
                    {saveStatus === 'saving' && 'Saving...'}
                    {saveStatus === 'saved' && 'Saved'}
                    {saveStatus === 'idle' && '\u00A0'}
                  </div>
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
