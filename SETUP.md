# Setup Guide for Calendar Journal

This guide will walk you through setting up the Calendar Journal application from scratch.

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- Google Cloud Console account
- (Optional) OpenAI API key for image generation

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and fill in the following:

### Required Variables

- **APP_BASE_URL**: Your app URL (e.g., `http://localhost:3000` for local dev)
- **SESSION_SECRET**: A long random string (generate with: `openssl rand -base64 32`)
- **DATABASE_URL**: Your PostgreSQL connection string
  - Format: `postgresql://user:password@host:port/database`
  - Example: `postgresql://postgres:password@localhost:5432/calendar_journal`
- **GOOGLE_CLIENT_ID**: From Google Cloud Console (see Step 3)
- **GOOGLE_CLIENT_SECRET**: From Google Cloud Console (see Step 3)
- **GOOGLE_REDIRECT_URI**: Should be `http://localhost:3000/api/auth/google/callback` for local dev

### Optional Variables

- **OPENAI_API_KEY**: For AI image generation
- **CRON_SECRET**: Secret for protecting cron endpoints (for production)

## Step 3: Set Up Google Cloud Console

1. Go to [Google Cloud Console](https://console.cloud.google.com/)

2. Create a new project (or select an existing one)

3. Enable the required APIs:
   - Go to "APIs & Services" > "Library"
   - Search for and enable:
     - **Google Calendar API**
     - **Gmail API**

4. Create OAuth 2.0 credentials:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URI: `http://localhost:3000/api/auth/google/callback`
   - Copy the **Client ID** and **Client Secret** to your `.env.local`

5. Configure OAuth consent screen:
   - Go to "APIs & Services" > "OAuth consent screen"
   - Choose "External" (unless you have a Google Workspace)
   - Fill in app name: "Calendar Journal"
   - Add scopes:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/gmail.send`
   - Add your email as a test user (for testing before verification)

## Step 4: Set Up Database

1. Create a PostgreSQL database:
   ```bash
   # Using psql
   createdb calendar_journal
   
   # Or using a cloud service like Supabase, Neon, or Railway
   ```

2. Update your `DATABASE_URL` in `.env.local`

3. Generate Prisma client and push schema:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

   This will create the `User` and `JournalEntry` tables.

## Step 5: Run the Application

```bash
npm run dev
```

The app should be available at `http://localhost:3000`

## Step 6: Test the Application

1. Navigate to `http://localhost:3000`
2. Click "Continue with Google"
3. Sign in and grant permissions
4. You should be redirected to `/today`
5. Fill in your journal entry and submit
6. Check your Google Calendar - you should see an all-day event for today

## Step 7: Set Up Cron Job (for Production)

For local development, you can manually trigger the reminder cron:
```bash
curl http://localhost:3000/api/cron/remind
```

For production on Vercel:
- The cron job is automatically configured via `vercel.json`
- Make sure to set `CRON_SECRET` in your Vercel environment variables
- The cron will run every 5 minutes and check if it's 8pm in each user's timezone

## Troubleshooting

### "Unauthorized" errors
- Check that your Google OAuth credentials are correct
- Verify the redirect URI matches exactly
- Make sure you've enabled the required APIs

### Database connection errors
- Verify your `DATABASE_URL` is correct
- Check that PostgreSQL is running
- Ensure the database exists

### Calendar events not appearing
- Check that you granted Calendar permissions
- Verify the user's `calendarId` is set (defaults to "primary")
- Check server logs for errors

### Reminders not sending
- Verify Gmail API is enabled
- Check that you granted Gmail send permissions
- For local testing, manually trigger `/api/cron/remind`
- Check that `lastReminderSentYmd` is being updated correctly

## Production Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add all environment variables from `.env.local`
4. Deploy

The cron job will be automatically configured.

### Database

Use a managed PostgreSQL service:
- **Vercel Postgres**: Integrated with Vercel
- **Supabase**: Free tier available
- **Neon**: Serverless Postgres
- **Railway**: Easy setup

### Environment Variables for Production

Make sure to update:
- `APP_BASE_URL`: Your production URL (e.g., `https://your-app.vercel.app`)
- `GOOGLE_REDIRECT_URI`: `https://your-app.vercel.app/api/auth/google/callback`
- `SESSION_SECRET`: Use a strong random secret
- `CRON_SECRET`: For protecting cron endpoints

## Next Steps

- Customize the UI styling
- Add image upload functionality
- Set up proper image storage (S3, Supabase Storage, etc.)
- Configure email templates
- Add analytics

