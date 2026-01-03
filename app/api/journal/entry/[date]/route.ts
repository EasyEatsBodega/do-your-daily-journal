import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET(
  request: Request,
  { params }: { params: { date: string } }
) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entry = await db.journalEntry.findUnique({
    where: {
      userId_date: {
        userId: session.userId,
        date: params.date,
      },
    },
  })

  if (!entry) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  }

  return NextResponse.json({
    date: entry.date,
    status: entry.status,
    accomplished: entry.accomplished,
    couldDoBetter: entry.couldDoBetter,
    proudHappy: entry.proudHappy,
    imageUrl: entry.imageUrl,
  })
}

