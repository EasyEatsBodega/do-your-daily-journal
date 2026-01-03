import { NextResponse } from 'next/server'
import { getOAuthClient } from '@/lib/google'

export async function GET() {
  const oauth2Client = getOAuthClient()

  const scopes = [
    'https://www.googleapis.com/auth/calendar',
    'https://www.googleapis.com/auth/gmail.send',
  ]

  const authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  })

  return NextResponse.redirect(authUrl)
}

