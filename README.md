# Calendar Journal

A web app that lets you write one journal entry per day, then creates a single all-day Google Calendar event for that day so you can click back through your calendar history and view what you did.

## 🎯 Effortless for Users

**For end users:** Just sign in with Google - that's it! No setup, no configuration, no database knowledge required. It just works.

**For developers:** One-time 10-minute setup using Vercel (auto-provisions database, handles everything).

## Features

- **Daily Journal Entries**: Write a quick 2-minute check-in each day
- **Google Calendar Integration**: Automatically creates all-day events in your Google Calendar
- **Daily Email Reminders**: Receives a reminder at 8pm local time (based on your Google Calendar timezone)
- **AI Image Generation**: Optional daily images based on your journal entry (requires OpenAI API key)

## Tech Stack

- **Next.js 14** (App Router) + TypeScript
- **Prisma** + PostgreSQL
- **Google APIs** (Calendar + Gmail)
- **Tailwind CSS** for styling
- **Vercel Cron** for scheduled reminders

## 🚀 Quick Start (Effortless Setup)

### For End Users
**Just sign in with Google - that's it!** No setup required.

### For Developers (One-Time Setup)

**Recommended: Deploy to Vercel (10 minutes, auto-provisions everything)**

See **[DEPLOY.md](./DEPLOY.md)** for the complete effortless deployment guide.

**Quick version:**
1. Push code to GitHub
2. Deploy to Vercel (one-click)
3. Add Vercel Postgres database (auto-provisioned)
4. Set environment variables in Vercel dashboard
5. Configure Google OAuth (5 minutes)
6. Done!

**For local development:**
1. Install dependencies: `npm install`
2. Use Supabase for free database (auto-setup)
3. Create `.env.local` (see `.env.local.example`)
4. Configure Google OAuth
5. Run: `npm run dev`

See **[DEPLOY.md](./DEPLOY.md)** for detailed instructions.

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables
4. Deploy

The cron job will automatically be set up via `vercel.json`.

### Database

Use a managed PostgreSQL service like:
- Vercel Postgres
- Supabase
- Neon
- Railway

## Project Structure

```
/app
  /(public)
    /login          # Login page
  /(authed)
    /today          # Main journal entry page
    /complete       # Post-submit success page
    /entry/[date]   # View past entries
    /settings       # User settings
  /api
    /auth           # OAuth routes
    /journal        # Journal CRUD
    /google         # Calendar/Gmail integration
    /cron           # Scheduled reminders
    /image          # AI image generation
    /upload         # Image uploads
/lib
  google.ts         # Google API helpers
  auth.ts           # Session management
  db.ts             # Prisma client
  time.ts           # Timezone utilities
/prisma
  schema.prisma     # Database schema
```

## Key Features

- **One entry per day**: Users can only write today's entry
- **All-day calendar events**: Events are created as all-day events in Google Calendar
- **DST-safe reminders**: Reminders are sent at 8pm in the user's local timezone, accounting for DST
- **Autosave drafts**: Journal entries are automatically saved as you type
- **Minimal calendar clutter**: Events are only created when entries are submitted

## License

MIT

