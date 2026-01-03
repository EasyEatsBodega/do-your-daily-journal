import { google } from 'googleapis'
import { OAuth2Client } from 'google-auth-library'
import { db } from './db'

export function getOAuthClient() {
  return new OAuth2Client(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
  )
}

export async function getAuthenticatedClient(userId: string) {
  const user = await db.user.findUnique({
    where: { id: userId },
    select: { accessToken: true, refreshToken: true, tokenExpiryMs: true },
  })

  if (!user || !user.refreshToken) {
    throw new Error('User not authenticated with Google')
  }

  const client = getOAuthClient()
  client.setCredentials({
    access_token: user.accessToken || undefined,
    refresh_token: user.refreshToken,
    expiry_date: user.tokenExpiryMs ? Number(user.tokenExpiryMs) : undefined,
  })

  // Auto-refresh if needed
  if (user.tokenExpiryMs && Number(user.tokenExpiryMs) < Date.now()) {
    const { credentials } = await client.refreshAccessToken()
    
    // Update stored tokens
    await db.user.update({
      where: { id: userId },
      data: {
        accessToken: credentials.access_token || null,
        refreshToken: credentials.refresh_token || user.refreshToken,
        tokenExpiryMs: credentials.expiry_date ? BigInt(credentials.expiry_date) : null,
      },
    })

    client.setCredentials(credentials)
  }

  return client
}

export async function getCalendarClient(userId: string) {
  const auth = await getAuthenticatedClient(userId)
  return google.calendar({ version: 'v3', auth })
}

export async function getGmailClient(userId: string) {
  const auth = await getAuthenticatedClient(userId)
  return google.gmail({ version: 'v1', auth })
}

export function toBase64Url(str: string): string {
  return Buffer.from(str)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

export function buildEmail({
  to,
  from,
  subject,
  text,
}: {
  to: string
  from: string
  subject: string
  text: string
}) {
  const message = `To: ${to}
From: ${from}
Subject: ${subject}
Content-Type: text/plain; charset="UTF-8"

${text}`
  return toBase64Url(message)
}

export function shorten(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

