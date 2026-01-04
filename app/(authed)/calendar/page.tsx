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
      <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="journal-page rounded-lg p-8 sm:p-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-10 border-b-2 border-ink-light/20 dark:border-sepia-warm/20 pb-6">
              <button
                onClick={() => router.push('/today')}
                className="font-handwriting text-xl text-ink-light dark:text-sepia-warm hover:text-ink dark:hover:text-sepia-warm/90 transition-colors"
              >
                ← Today
              </button>
              <h1 className="font-handwriting text-4xl text-ink dark:text-sepia-warm">My Journal</h1>
              <div className="w-20"></div>
            </div>

            {/* Month Navigation */}
            <div className="flex justify-between items-center mb-8">
              <button
                onClick={previousMonth}
                className="font-handwriting text-lg px-4 py-2 border-2 border-ink dark:border-sepia-warm text-ink dark:text-sepia-warm rounded-md hover:bg-ink hover:text-paper dark:hover:bg-sepia-warm dark:hover:text-paper-dark transition-all"
              >
                ← Previous
              </button>
              <div className="flex items-center gap-4">
                <h2 className="journal-date text-3xl">{monthName}</h2>
                <button
                  onClick={goToToday}
                  className="font-handwriting text-base px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full hover:scale-105 transition-transform"
                >
                  Today
                </button>
              </div>
              <button
                onClick={nextMonth}
                className="font-handwriting text-lg px-4 py-2 border-2 border-ink dark:border-sepia-warm text-ink dark:text-sepia-warm rounded-md hover:bg-ink hover:text-paper dark:hover:bg-sepia-warm dark:hover:text-paper-dark transition-all"
              >
                Next →
              </button>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-2 mb-8">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-handwriting text-lg text-ink-light dark:text-sepia-warm/70 py-2">
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
                      aspect-square p-2 rounded-md transition-all font-handwriting text-base
                      ${isToday ? 'ring-2 ring-amber-600 dark:ring-amber-400 bg-amber-50 dark:bg-amber-900/30 shadow-md' : ''}
                      ${hasEntry && isSubmitted ? 'bg-ink/10 dark:bg-sepia-warm/20 hover:bg-ink/20 dark:hover:bg-sepia-warm/30 border border-ink/30 dark:border-sepia-warm/30' : ''}
                      ${hasEntry && !isSubmitted ? 'bg-amber-100/50 dark:bg-amber-900/20 hover:bg-amber-200/50 dark:hover:bg-amber-800/30 border border-amber-400/40 dark:border-amber-600/40' : ''}
                      ${!hasEntry && isPast ? 'bg-paper/50 dark:bg-paper-dark/30 hover:bg-ink/10 dark:hover:bg-sepia-warm/10 border-2 border-dashed border-ink-light/30 dark:border-sepia-warm/30' : ''}
                      ${!hasEntry && !isToday && !isFuture && !isPast ? 'bg-transparent' : ''}
                      ${isFuture ? 'bg-transparent opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                    `}
                  >
                    <div className="font-handwriting text-lg text-ink dark:text-sepia-warm">{day}</div>
                    {hasEntry && (
                      <div className="mt-1">
                        {isSubmitted ? (
                          <div className="text-sm text-ink dark:text-sepia-warm">✓</div>
                        ) : (
                          <div className="text-sm text-amber-700 dark:text-amber-300">•</div>
                        )}
                      </div>
                    )}
                    {isToday && !hasEntry && (
                      <div className="text-xs text-amber-700 dark:text-amber-400 mt-1 font-serif italic">today</div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="flex gap-6 justify-center flex-wrap border-t-2 border-ink-light/20 dark:border-sepia-warm/20 pt-6 mb-6">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-ink/10 dark:bg-sepia-warm/20 rounded border border-ink/30 dark:border-sepia-warm/30"></div>
                <span className="font-serif text-sm text-ink-light dark:text-sepia-warm/80">Completed ✓</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-100/50 dark:bg-amber-900/20 rounded border border-amber-400/40 dark:border-amber-600/40"></div>
                <span className="font-serif text-sm text-ink-light dark:text-sepia-warm/80">Draft •</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-amber-50 dark:bg-amber-900/30 rounded ring-2 ring-amber-600 dark:ring-amber-400"></div>
                <span className="font-serif text-sm text-ink-light dark:text-sepia-warm/80">Today</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 bg-paper/50 dark:bg-paper-dark/30 rounded border-2 border-dashed border-ink-light/30 dark:border-sepia-warm/30"></div>
                <span className="font-serif text-sm text-ink-light dark:text-sepia-warm/80">Empty (clickable)</span>
              </div>
            </div>

            {/* Stats */}
            <div className="pt-6 border-t-2 border-ink-light/20 dark:border-sepia-warm/20">
              <div className="grid grid-cols-3 gap-6 text-center">
                <div>
                  <div className="font-handwriting text-4xl text-ink dark:text-sepia-warm mb-1">
                    {entries.filter(e => e.status === 'SUBMITTED').length}
                  </div>
                  <div className="font-serif text-sm text-ink-light dark:text-sepia-warm/70">Total Entries</div>
                </div>
                <div>
                  <div className="font-handwriting text-4xl text-ink dark:text-sepia-warm mb-1">
                    {entries.filter(e => e.status === 'SUBMITTED').length}
                  </div>
                  <div className="font-serif text-sm text-ink-light dark:text-sepia-warm/70">Completed</div>
                </div>
                <div>
                  <div className="font-handwriting text-4xl text-amber-700 dark:text-amber-400 mb-1">
                    {entries.filter(e => e.status === 'DRAFT').length}
                  </div>
                  <div className="font-serif text-sm text-ink-light dark:text-sepia-warm/70">Drafts</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AuthGate>
  )
}
