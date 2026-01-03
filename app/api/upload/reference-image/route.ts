import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayYmd } from '@/lib/time'

// For MVP, we'll store images as base64 in the database
// In production, upload to S3/Supabase/Cloudflare R2
export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const formData = await request.formData()
  const file = formData.get('image') as File

  if (!file) {
    return NextResponse.json({ error: 'No file provided' }, { status: 400 })
  }

  // Convert to base64 (MVP approach)
  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)
  const base64 = buffer.toString('base64')
  const dataUrl = `data:${file.type};base64,${base64}`

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { timeZone: true },
  })

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const today = getTodayYmd(user.timeZone)

  // Update entry with reference image
  await db.journalEntry.upsert({
    where: {
      userId_date: {
        userId: session.userId,
        date: today,
      },
    },
    update: {
      referenceImageUrl: dataUrl,
    },
    create: {
      userId: session.userId,
      date: today,
      accomplished: '',
      couldDoBetter: '',
      proudHappy: '',
      status: 'DRAFT',
      referenceImageUrl: dataUrl,
    },
  })

  return NextResponse.json({ success: true, imageUrl: dataUrl })
}

