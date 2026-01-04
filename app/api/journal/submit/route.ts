import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayYmd, nextDate } from '@/lib/time'
import { getCalendarClient, shorten } from '@/lib/google'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { accomplished, couldDoBetter, proudHappy } = body

  if (!accomplished || !couldDoBetter || !proudHappy) {
    return NextResponse.json(
      { error: 'All fields are required' },
      { status: 400 }
    )
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const today = getTodayYmd(user.timeZone)

  // Update entry to SUBMITTED
  const entry = await db.journalEntry.update({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
    data: {
      accomplished,
      couldDoBetter,
      proudHappy,
      status: 'SUBMITTED',
    },
  })

  // Upsert calendar event
  let calendarEventId = entry.calendarEventId
  try {
    const calendar = await getCalendarClient(session.userId)
    const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'

    const event = {
      summary: 'Daily Journal ✅',
      description: [
        `Accomplished: ${shorten(accomplished, 180)}`,
        `Better: ${shorten(couldDoBetter, 120)}`,
        `Proud: ${shorten(proudHappy, 120)}`,
        '',
        `Open full entry: ${appBaseUrl}/entry/${today}`,
      ].join('\n'),
      start: { date: today },
      end: { date: nextDate(today) },
      extendedProperties: {
        private: { journalEntryId: entry.id },
      },
    }

    if (calendarEventId) {
      // Update existing event
      await calendar.events.patch({
        calendarId: user.calendarId,
        eventId: calendarEventId,
        requestBody: event,
      })
    } else {
      // Create new event
      const result = await calendar.events.insert({
        calendarId: user.calendarId,
        requestBody: event,
      })
      calendarEventId = result.data.id || null
    }

    // Update entry with calendar event ID
    await db.journalEntry.update({
      where: { id: entry.id },
      data: { calendarEventId },
    })
  } catch (error) {
    console.error('Calendar event error:', error)
    // Continue even if calendar fails
  }

  return NextResponse.json({
    success: true,
    date: entry.date,
    entry,
    calendarEventId,
  })
}

