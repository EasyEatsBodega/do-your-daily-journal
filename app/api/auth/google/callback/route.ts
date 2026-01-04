import { NextResponse } from 'next/server'
import { getOAuthClient } from '@/lib/google'
import { db } from '@/lib/db'
import { createSession, deleteSession } from '@/lib/auth'
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

    if (!tokens.access_token) {
      console.error('No access token received')
      return NextResponse.redirect(new URL('/login?error=no_access_token', request.url))
    }

    // refresh_token is only provided on first authorization or when prompt=consent
    // For existing users, we'll keep their existing refresh_token
    if (!tokens.refresh_token) {
      console.log('No refresh token in response - will use existing token for this user')
    }

    // Set credentials on the OAuth client
    oauth2Client.setCredentials(tokens)

    // Verify we have valid credentials
    console.log('Access token present:', !!tokens.access_token)
    console.log('Token type:', tokens.token_type)

    // Get user info
    const oauth2 = google.oauth2({ version: 'v2', auth: oauth2Client })
    const { data } = await oauth2.userinfo.get()

    if (!data.id || !data.email) {
      console.error('User info missing id or email:', data)
      return NextResponse.redirect(new URL('/login?error=no_user_info', request.url))
    }

    // Get user's calendar timezone
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client })
    const calendarList = await calendar.calendarList.get({
      calendarId: 'primary',
    })
    const timeZone = calendarList.data.timeZone || 'UTC'

    // Clear any existing session first to prevent cross-user data leakage
    await deleteSession()

    // Upsert user
    const user = await db.user.upsert({
      where: { googleUserId: data.id },
      update: {
        email: data.email,
        accessToken: tokens.access_token,
        // Only update refresh_token if we received a new one
        ...(tokens.refresh_token && { refreshToken: tokens.refresh_token }),
        tokenExpiryMs: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        timeZone,
      },
      create: {
        googleUserId: data.id,
        email: data.email,
        accessToken: tokens.access_token,
        refreshToken: tokens.refresh_token || '',
        tokenExpiryMs: tokens.expiry_date ? BigInt(tokens.expiry_date) : null,
        timeZone,
      },
    })

    // Create session
    await createSession(user.id)

    return NextResponse.redirect(new URL('/today', request.url))
  } catch (error) {
    console.error('OAuth callback error:', error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.redirect(new URL('/login?error=callback_failed', request.url))
  }
}

