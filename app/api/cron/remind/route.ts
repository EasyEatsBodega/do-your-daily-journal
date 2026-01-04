import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { getGmailClient, buildEmail } from '@/lib/google'
import { getZonedParts, getTodayYmd } from '@/lib/time'

export async function GET(request: Request) {
  // Verify this is from Vercel cron (optional: check header secret)
  const authHeader = request.headers.get('authorization')
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const users = await db.user.findMany({
    where: {
      refreshToken: { not: null },
    },
    include: {
      entries: {
        where: {
          status: 'SUBMITTED',
        },
      },
    },
  })

  const appBaseUrl = process.env.APP_BASE_URL || 'http://localhost:3000'
  const remindersSent: string[] = []

  for (const user of users) {
    try {
      // Check if it's 8pm in user's timezone (window: 8:00-8:04)
      const now = new Date()
      const parts = getZonedParts(now, user.timeZone)
      const inWindow = parts.hour === 20 && parts.minute >= 0 && parts.minute <= 4

      if (!inWindow) continue

      // Check if we already sent a reminder today
      const todayYmd = getTodayYmd(user.timeZone)
      if (user.lastReminderSentYmd === todayYmd) continue

      // Check if user already submitted today
      const hasSubmittedToday = user.entries.some((e: any) => e.date === todayYmd)
      if (hasSubmittedToday) continue

      // Send reminder email
      const gmail = await getGmailClient(user.id)
      const emailText = `Quick 2-minute check-in. Write today's entry here: ${appBaseUrl}/today`
      const raw = buildEmail({
        to: user.email,
        from: user.email,
        subject: 'Time to do your daily journal',
        text: emailText,
      })

      await gmail.users.messages.send({
        userId: 'me',
        requestBody: { raw },
      })

      // Update last reminder sent
      await db.user.update({
        where: { id: user.id },
        data: { lastReminderSentYmd: todayYmd },
      })

      remindersSent.push(user.email)
    } catch (error) {
      console.error(`Failed to send reminder to ${user.email}:`, error)
      // Continue with other users
    }
  }

  return NextResponse.json({
    success: true,
    remindersSent: remindersSent.length,
    users: remindersSent,
  })
}

