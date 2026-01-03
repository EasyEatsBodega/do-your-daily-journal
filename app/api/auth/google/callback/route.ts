import { NextResponse } from 'next/server'
import { getOAuthClient } from '@/lib/google'
import { db } from '@/lib/db'
import { createSession } from '@/lib/auth'
import { google } from 'googleapis'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', request.url))
  }

  try {
    const oauth2Client = getOAuthClient()
    const { tokens } = await oauth2Client.getToken(code)

    if (!tokens.access_token || !tokens.refresh_token) {
      return NextResponse.redirect(new URL('/login?error=no_tokens', request.url))
    }

    // Get user info
    oauth2Client.setCredentials(tokens)
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    if (!data.id || !data.email) {
      return NextResponse.redirect(new URL('/login?error=no_user_info', request.url))
    }

    // Get user's calendar timezone
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const calendarList = await calendar.calendarList.get({
      calendarId: 'primary',
    })
    const timeZone = calendarList.data.timeZone || 'UTC'

    // Upsert user
    const user = await db.user.upsert({
      where: { googleUserId: data.id },
      update: {
        email: data.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiryMs: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        timeZone,
      },
      create: {
        googleUserId: data.id,
        email: data.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token,
        tokenExpiryMs: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        timeZone,
      },
    })

    // Create session
    await createSession(user.id)

    return NextResponse.redirect(new URL('/today', request.url))
  } catch (error) {
    console.error('OAuth callback error:', error)
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}

