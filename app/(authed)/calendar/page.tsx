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
      <div className="min-h-screen py-6 sm:py-12 px-2 sm:px-4 lg:px-8 pb-safe">
        <div className="max-w-5xl mx-auto">
          <div className="journal-page rounded-lg p-4 sm:p-8 lg:p-12">
            {/* Header */}
            <div className="flex justify-between items-center mb-6 sm:mb-10 border-b-2 border-ink-light/20 dark:border-sepia-warm/20 pb-4 sm:pb-6">
              <button
                onClick={() => router.push('/today')}
                className="font-handwriting text-lg sm:text-xl text-ink-light dark:text-sepia-warm hover:text-ink dark:hover:text-sepia-warm/90 transition-colors touch-manipulation"
              >
                ← Today
              </button>
              <h1 className="font-handwriting text-2xl sm:text-4xl text-ink dark:text-sepia-warm">My Journal</h1>
              <div className="w-16 sm:w-20"></div>
            </div>

            {/* Month Navigation */}
            <div className="flex flex-col sm:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
              <div className="flex items-center gap-2 sm:gap-4 order-2 sm:order-1">
                <button
                  onClick={previousMonth}
                  className="font-handwriting text-base sm:text-lg px-3 sm:px-4 py-2 border-2 border-ink dark:border-sepia-warm text-ink dark:text-sepia-warm rounded-md hover:bg-ink hover:text-paper dark:hover:bg-sepia-warm dark:hover:text-paper-dark transition-all touch-manipulation"
                >
                  ←
                </button>
                <button
                  onClick={nextMonth}
                  className="font-handwriting text-base sm:text-lg px-3 sm:px-4 py-2 border-2 border-ink dark:border-sepia-warm text-ink dark:text-sepia-warm rounded-md hover:bg-ink hover:text-paper dark:hover:bg-sepia-warm dark:hover:text-paper-dark transition-all touch-manipulation"
                >
                  →
                </button>
              </div>
              <div className="flex items-center gap-3 sm:gap-4 order-1 sm:order-2">
                <h2 className="journal-date text-2xl sm:text-3xl">{monthName}</h2>
                <button
                  onClick={goToToday}
                  className="font-handwriting text-sm sm:text-base px-2 sm:px-3 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full hover:scale-105 transition-transform touch-manipulation"
                >
                  Today
                </button>
              </div>
              <div className="w-16 sm:w-20 hidden sm:block order-3"></div>
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1.5 sm:gap-3 mb-6 sm:mb-8">
              {/* Day headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center font-handwriting text-base sm:text-2xl text-ink dark:text-sepia-warm font-semibold py-2 sm:py-3 border-b-2 border-ink-light/20 dark:border-sepia-warm/20">
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
                      aspect-square p-1.5 sm:p-3 rounded-md sm:rounded-lg transition-all relative
                      flex flex-col items-center justify-center touch-manipulation
                      ${isToday && !hasEntry ? 'bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 ring-4 ring-blue-500 dark:ring-blue-400 shadow-lg' : ''}
                      ${isToday && hasEntry && isSubmitted ? 'bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900/40 dark:to-green-800/40 ring-4 ring-blue-500 dark:ring-blue-400 shadow-lg' : ''}
                      ${isToday && hasEntry && !isSubmitted ? 'bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-900/40 dark:to-orange-800/40 ring-4 ring-blue-500 dark:ring-blue-400 shadow-lg' : ''}
                      ${!isToday && hasEntry && isSubmitted ? 'bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 border-2 border-green-600 dark:border-green-500 shadow-md hover:shadow-xl' : ''}
                      ${!isToday && hasEntry && !isSubmitted ? 'bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 border-2 border-orange-500 dark:border-orange-400 shadow-md hover:shadow-xl' : ''}
                      ${!hasEntry && isPast && !isToday ? 'bg-paper dark:bg-paper-dark/50 border-2 border-dashed border-ink-light/40 dark:border-sepia-warm/40 hover:bg-ink/5 dark:hover:bg-sepia-warm/10' : ''}
                      ${!hasEntry && !isToday && !isFuture && !isPast ? 'bg-paper/30 dark:bg-paper-dark/20' : ''}
                      ${isFuture ? 'bg-transparent opacity-20 cursor-not-allowed' : 'cursor-pointer hover:scale-105'}
                    `}
                  >
                    <div className={`font-handwriting text-lg sm:text-2xl font-bold mb-0.5 sm:mb-1 ${
                      isToday ? 'text-blue-900 dark:text-blue-100' :
                      hasEntry && isSubmitted ? 'text-green-900 dark:text-green-100' :
                      hasEntry && !isSubmitted ? 'text-orange-900 dark:text-orange-100' :
                      'text-ink dark:text-sepia-warm'
                    }`}>
                      {day}
                    </div>
                    {hasEntry && (
                      <div className="absolute bottom-0.5 sm:bottom-2">
                        {isSubmitted ? (
                          <div className={`text-sm sm:text-lg font-bold ${isToday ? 'text-green-700 dark:text-green-300' : 'text-green-700 dark:text-green-400'}`}>✓</div>
                        ) : (
                          <div className={`text-sm sm:text-lg font-bold ${isToday ? 'text-orange-700 dark:text-orange-300' : 'text-orange-600 dark:text-orange-400'}`}>⋯</div>
                        )}
                      </div>
                    )}
                    {isToday && !hasEntry && (
                      <div className="absolute bottom-0 sm:bottom-1 text-[10px] sm:text-xs font-serif font-bold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Today</div>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 border-t-2 border-ink-light/20 dark:border-sepia-warm/20 pt-6 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950/30 dark:to-green-900/30 rounded-lg border-2 border-green-600 dark:border-green-500 flex items-center justify-center">
                  <span className="text-green-700 dark:text-green-400 font-bold">✓</span>
                </div>
                <span className="font-serif text-base text-ink dark:text-sepia-warm font-semibold">Completed</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950/30 dark:to-orange-900/30 rounded-lg border-2 border-orange-500 dark:border-orange-400 flex items-center justify-center">
                  <span className="text-orange-600 dark:text-orange-400 font-bold">⋯</span>
                </div>
                <span className="font-serif text-base text-ink dark:text-sepia-warm font-semibold">Draft</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-900/40 dark:to-blue-800/40 rounded-lg ring-4 ring-blue-500 dark:ring-blue-400"></div>
                <span className="font-serif text-base text-ink dark:text-sepia-warm font-semibold">Today</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-paper dark:bg-paper-dark/50 rounded-lg border-2 border-dashed border-ink-light/40 dark:border-sepia-warm/40"></div>
                <span className="font-serif text-base text-ink dark:text-sepia-warm font-semibold">Empty</span>
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
