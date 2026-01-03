import { NextResponse } from 'next/server'
import { getSession } from '@/lib/auth'
import { db } from '@/lib/db'
import { getTodayYmd } from '@/lib/time'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

function buildImagePrompt({
  accomplished,
  couldDoBetter,
  proudHappy,
  date,
}: {
  accomplished: string
  couldDoBetter: string
  proudHappy: string
  date: string
}) {
  return [
    `Create a single cinematic illustration capturing the vibe of this day (${date}).`,
    `Main scene: ${accomplished}.`,
    `Subtle theme of improvement: ${couldDoBetter}.`,
    `Emotional highlight: ${proudHappy}.`,
    `Keep it wholesome, grounded, and personal. No text in the image.`,
    `Style: cinematic lighting, detailed, warm tone, consistent character appearance.`,
  ].join(' ')
}

export async function POST(request: Request) {
  const session = await getSession()
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { entryId } = body

  const entry = await db.journalEntry.findUnique({
    where: { id: entryId },
    include: { user: true },
  })

  if (!entry || entry.userId !== session.userId) {
    return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  }

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: 'Image generation not configured' },
      { status: 500 }
    )
  }

  try {
    const prompt = buildImagePrompt({
      accomplished: entry.accomplished,
      couldDoBetter: entry.couldDoBetter,
      proudHappy: entry.proudHappy,
      date: entry.date,
    })

    // For MVP: use DALL-E 3 (OpenAI Images API)
    // Note: The spec mentions GPT Image models, but DALL-E 3 is the current API
    const response = await openai.images.generate({
      model: 'dall-e-3',
      prompt,
      size: '1024x1024',
      quality: 'standard',
      n: 1,
    })

    const imageUrl = response.data[0]?.url

    if (!imageUrl) {
      return NextResponse.json(
        { error: 'Failed to generate image' },
        { status: 500 }
      )
    }

    // Update entry with image URL
    await db.journalEntry.update({
      where: { id: entryId },
      data: { imageUrl },
    })

    return NextResponse.json({ success: true, imageUrl })
  } catch (error) {
    console.error('Image generation error:', error)
    return NextResponse.json(
      { error: 'Failed to generate image' },
      { status: 500 }
    )
  }
}

