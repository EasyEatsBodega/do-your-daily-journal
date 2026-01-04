import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const entries = await db.journalEntry.findMany({
    where: {
      userId: session.userId,
    },
    select: {
      date: true,
      status: true,
      accomplished: true,
      couldDoBetter: true,
      proudHappy: true,
    },
    orderBy: {
      date: 'desc',
    },
  })

  return NextResponse.json({ entries })
}
