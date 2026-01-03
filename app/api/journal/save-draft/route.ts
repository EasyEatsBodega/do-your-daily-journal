import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayYmd } from '@/lib/time'

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { accomplished, couldDoBetter, proudHappy } = body

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { timeZone: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const today = getTodayYmd(user.timeZone)

  const entry = await db.journalEntry.upsert({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
    update: {
      accomplished: accomplished || '',
      couldDoBetter: couldDoBetter || '',
      proudHappy: proudHappy || '',
      status: 'DRAFT',
    },
    create: {
      userId: session.userId,
      date: today,
      accomplished: accomplished || '',
      couldDoBetter: couldDoBetter || '',
      proudHappy: proudHappy || '',
      status: 'DRAFT',
    },
  })

  return NextResponse.json({ success: true, entry })
}

