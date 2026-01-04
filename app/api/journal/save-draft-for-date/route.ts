import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { date, accomplished, couldDoBetter, proudHappy } = body

  if (!date) {
    return NextResponse.json({ error: 'Date is required' }, { status: 400 })
  }

  // Upsert the entry as a draft for the specified date
  const entry = await db.journalEntry.upsert({
    where: {
      userId_date: {
        userId: session.userId,
        date: date,
      },
    },
    update: {
      accomplished,
      couldDoBetter,
      proudHappy,
    },
    create: {
      userId: session.userId,
      date: date,
      accomplished,
      couldDoBetter,
      proudHappy,
      status: 'DRAFT',
    },
  })

  return NextResponse.json({ success: true, entry })
}
