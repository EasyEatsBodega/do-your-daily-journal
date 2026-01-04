'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthGate } from '@/components/AuthGate'
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

        if (data.status === 'SUBMITTED') {
          router.push(`/complete?date=${data.date}`)
        }
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
          <div className="text-lg">Loading...</div>
        </div>
      </AuthGate>
    )
  }

  if (!entry) {
    return (
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Failed to load entry</div>
        </div>
      </AuthGate>
    )
  }

  return (
    <AuthGate>
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-1">{dateDisplay}</h1>
                <p className="text-neutral-500 dark:text-neutral-400">
                  Your daily journal for today
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                Sign out
              </button>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  What did you get done today?
                </label>
                <textarea
                  value={entry.accomplished}
                  onChange={(e) => handleChange('accomplished', e.target.value)}
                  className="w-full px-4 py-3 border border-neutral-300 dark:border-neutral-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-neutral-700 dark:text-white"
                  rows={6}
                  placeholder="Write about what you accomplished today..."
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
                <div className="text-sm text-neutral-500">
                  {saveStatus === 'saving' && 'Saving...'}
                  {saveStatus === 'saved' && 'Saved'}
                  {saveStatus === 'idle' && '\u00A0'}
                </div>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? 'Saving...' : 'Save my day'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

