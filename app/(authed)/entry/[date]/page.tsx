'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { AuthGate } from '@/components/AuthGate'
// formatDate will be defined inline

interface Entry {
  date: string
  status: string
  accomplished: string
  couldDoBetter: string
  proudHappy: string
  imageUrl?: string
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
        const dateObj = new Date(data.date + 'T00:00:00')
        const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone
        setDateDisplay(new Intl.DateTimeFormat('en-US', {
          timeZone,
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
        <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 py-8">
          <div className="max-w-2xl mx-auto px-4">
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8 text-center">
              <h1 className="text-2xl font-bold mb-4">No entry for this day</h1>
              <button
                onClick={() => router.push('/today')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
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
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 py-8">
        <div className="max-w-2xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            <h1 className="text-3xl font-bold mb-2">{dateDisplay}</h1>
            <p className="text-neutral-500 dark:text-neutral-400 mb-8">
              Your journal entry
            </p>

            {entry.imageUrl && (
              <div className="mb-8">
                <img
                  src={entry.imageUrl}
                  alt="Daily memory"
                  className="w-full rounded-lg shadow-lg"
                />
              </div>
            )}

            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                  What I accomplished
                </h3>
                <p className="text-neutral-900 dark:text-neutral-100 text-lg">
                  {entry.accomplished}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                  What I could do better
                </h3>
                <p className="text-neutral-900 dark:text-neutral-100 text-lg">
                  {entry.couldDoBetter}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-neutral-500 dark:text-neutral-400 mb-2">
                  What I'm proud of
                </h3>
                <p className="text-neutral-900 dark:text-neutral-100 text-lg">
                  {entry.proudHappy}
                </p>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => router.push('/today')}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
              >
                Back to today
              </button>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}

