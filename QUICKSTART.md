# Quick Start Guide

Get your Calendar Journal app running in 5 minutes!

## 1. Install Dependencies

```bash
npm install
```

## 2. Set Up Database

Create a PostgreSQL database and update `.env.local`:

```bash
# Example: Using a local PostgreSQL
DATABASE_URL=postgresql://postgres:password@localhost:5432/calendar_journal
```

Then initialize the database:

```bash
npx prisma generate
npx prisma db push
```

## 3. Configure Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project and enable:
   - Google Calendar API
   - Gmail API
3. Create OAuth 2.0 credentials (Web application)
4. Add redirect URI: `http://localhost:3000/api/auth/google/callback`
5. Copy Client ID and Secret to `.env.local`

## 4. Create `.env.local`

```bash
APP_BASE_URL=http://localhost:3000
SESSION_SECRET=your-random-secret-here
DATABASE_URL=postgresql://...
GOOGLE_CLIENT_ID=your-client-id
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
```

## 5. Run the App

```bash
npm run dev
```

Visit `http://localhost:3000` and sign in with Google!

## What's Next?

- See `SETUP.md` for detailed setup instructions
- See `README.md` for feature documentation
- Customize the UI in `app/(authed)/today/page.tsx`

## Testing Reminders Locally

To test the reminder cron job locally:

```bash
curl http://localhost:3000/api/cron/remind
```

Note: Reminders only send at 8pm in each user's timezone (window: 8:00-8:04).

