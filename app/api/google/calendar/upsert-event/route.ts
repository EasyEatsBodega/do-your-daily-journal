import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { getCalendarClient } from '@/lib/google'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { eventId, event } = body

  try {
    const calendar = await getCalendarClient(session.userId)

    if (eventId) {
      await calendar.events.patch({
        calendarId: 'primary',
        eventId,
        requestBody: event,
      })
    } else {
      await calendar.events.insert({
        calendarId: 'primary',
        requestBody: event,
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Calendar upsert error:', error)
    return NextResponse.json(
      { error: 'Failed to upsert calendar event' },
      { status: 500 }
    )
  }
}

