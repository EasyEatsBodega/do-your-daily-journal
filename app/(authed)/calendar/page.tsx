'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AuthGate } from '@/components/AuthGate'
import { HamburgerMenu } from '@/components/HamburgerMenu'

interface Entry {
  date: string
  status: string
  accomplished: string
}

export default function CalendarPage() {
  const router = useRouter()
  const [entries, setEntries] = useState<Entry[]>([])
  const [loading, setLoading] = useState(true)
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [todayDate, setTodayDate] = useState('')

  useEffect(() => {
    fetchEntries()
    fetchToday()
  }, [])

  const fetchEntries = async () => {
    try {
      const res = await fetch('/api/journal/entries')
      if (res.ok) {
        const data = await res.json()
        setEntries(data.entries)
      }
    } catch (error) {
      console.error('Failed to fetch entries:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchToday = async () => {
    try {
      const res = await fetch('/api/journal/get-today')
      if (res.ok) {
        const data = await res.json()
        setTodayDate(data.date)
      }
    } catch (error) {
      console.error('Failed to fetch today:', error)
    }
  }

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = firstDay.getDay()

    return { daysInMonth, startingDayOfWeek, year, month }
  }

  const formatDateForEntry = (year: number, month: number, day: number) => {
    const y = year.toString()
    const m = (month + 1).toString().padStart(2, '0')
    const d = day.toString().padStart(2, '0')
    return `${y}-${m}-${d}`
  }

  const getEntryForDate = (dateStr: string) => {
    return entries.find(e => e.date === dateStr)
  }

  const handleDateClick = (dateStr: string) => {
    const entry = getEntryForDate(dateStr)
    const isFuture = todayDate && dateStr > todayDate

    // Don't allow clicking future dates
    if (isFuture) {
      return
    }

    // Today goes to /today, all other dates (past with or without entries) go to /edit/[date]
    if (dateStr === todayDate) {
      router.push('/today')
    } else {
      router.push(`/edit/${dateStr}`)
    }
  }

  const previousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))
  }

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))
  }

  const goToToday = () => {
    setCurrentMonth(new Date())
  }

  const { daysInMonth, startingDayOfWeek, year, month } = getDaysInMonth(currentMonth)

  const monthName = new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentMonth)

  if (loading) {
    return (
      <AuthGate>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-lg">Loading...</div>
        </div>
      </AuthGate>
    )
  }

  return (
    <AuthGate>
      <HamburgerMenu />
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={() => router.push('/today')}
                className="text-sm text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200"
              >
                ← Back to Today
              </button>
              <h1 className="text-2xl font-bold">Your Journal Calendar</h1>
              <div className="w-24"></div>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-6">
              <button
                onClick={previousMonth}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">{monthName}</h2>
                <button
                  onClick={goToToday}
                  className="px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-200 rounded transition-colors"
                >
                  Today
                </button>
              </div>
              <button
                onClick={nextMonth}
                className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-700 dark:hover:bg-neutral-600 rounded-lg transition-colors"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-semibold text-sm text-neutral-600 dark:text-neutral-400 py-2">
                  {day}
                </div>
              ))}

              {/* Empty cells for days before month starts */}
              {Array.from({ length: startingDayOfWeek }).map((_, i) => (
                <div key={`empty-${i}`} className="aspect-square"></div>
              ))}

              {/* Calendar days */}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1
                const dateStr = formatDateForEntry(year, month, day)
                const entry = getEntryForDate(dateStr)
                const isToday = dateStr === todayDate
                const hasEntry = !!entry
                const isSubmitted = entry?.status === 'SUBMITTED'
                const isFuture = !!(todayDate && dateStr > todayDate)
                const isPast = !!(todayDate && dateStr < todayDate)

                return (
                  <button
                    key={day}
                    onClick={() => handleDateClick(dateStr)}
                    disabled={isFuture}
                    className={`
                      aspect-square p-2 rounded-lg transition-all
                      ${isToday ? 'ring-2 ring-blue-500 bg-blue-50 dark:bg-blue-900/30' : ''}
                      ${hasEntry && isSubmitted ? 'bg-green-100 dark:bg-green-900/30 hover:bg-green-200 dark:hover:bg-green-800/40' : ''}
                      ${hasEntry && !isSubmitted ? 'bg-yellow-100 dark:bg-yellow-900/30 hover:bg-yellow-200 dark:hover:bg-yellow-800/40' : ''}
                      ${!hasEntry && isPast ? 'bg-neutral-100 dark:bg-neutral-700/50 hover:bg-neutral-200 dark:hover:bg-neutral-600/50 border-2 border-dashed border-neutral-300 dark:border-neutral-600' : ''}
                      ${!hasEntry && !isToday && !isFuture && !isPast ? 'bg-neutral-50 dark:bg-neutral-700/30' : ''}
                      ${isFuture ? 'bg-neutral-50 dark:bg-neutral-800 opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                    `}
                  >
                    <div className="text-sm font-medium">{day}</div>
                    {hasEntry && (
                      <div className="mt-1">
                        {isSubmitted ? (
                          <div className="text-xs text-green-700 dark:text-green-300">✓</div>
                        ) : (
                          <div className="text-xs text-yellow-700 dark:text-yellow-300">○</div>
                        )}
                      </div>
                    )}
                    {isToday && !hasEntry && (
                      <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">Today</div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="mt-8 flex gap-6 justify-center text-sm flex-wrap">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-100 dark:bg-green-900/30 rounded"></div>
                <span className="text-neutral-600 dark:text-neutral-400">Completed (✓)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-yellow-100 dark:bg-yellow-900/30 rounded"></div>
                <span className="text-neutral-600 dark:text-neutral-400">Draft (○)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-50 dark:bg-blue-900/30 rounded ring-2 ring-blue-500"></div>
                <span className="text-neutral-600 dark:text-neutral-400">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-neutral-100 dark:bg-neutral-700/50 rounded border-2 border-dashed border-neutral-300 dark:border-neutral-600"></div>
                <span className="text-neutral-600 dark:text-neutral-400">Past (clickable)</span>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-8 pt-6 border-t border-neutral-200 dark:border-neutral-700">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-neutral-900 dark:text-neutral-100">
                    {entries.filter(e => e.status === 'SUBMITTED').length}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Total Entries</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {entries.filter(e => e.status === 'SUBMITTED').length}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Completed</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">
                    {entries.filter(e => e.status === 'DRAFT').length}
                  </div>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">Drafts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}
