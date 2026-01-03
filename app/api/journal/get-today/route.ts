import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayYmd } from '@/lib/time'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { timeZone: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const today = getTodayYmd(user.timeZone)

  let entry = await db.journalEntry.findUnique({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
  })

  // Create draft if doesn't exist
  if (!entry) {
    entry = await db.journalEntry.create({
      data: {
        userId: session.userId,
        date: today,
        accomplished: '',
        couldDoBetter: '',
        proudHappy: '',
        status: 'DRAFT',
      },
    })
  }

  return NextResponse.json({
    date: entry.date,
    status: entry.status,
    accomplished: entry.accomplished,
    couldDoBetter: entry.couldDoBetter,
    proudHappy: entry.proudHappy,
    imageUrl: entry.imageUrl,
    referenceImageUrl: entry.referenceImageUrl,
  })
}

