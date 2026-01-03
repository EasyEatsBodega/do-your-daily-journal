# Pre-Launch Checklist

## ❌ Current Status: NOT READY TO RUN

The app code is complete, but you need to complete these setup steps before it will work.

---

## ✅ Step-by-Step Setup (Do These In Order)

### 1. Install Dependencies
```bash
npm install
```
**Status:** ⬜ Not done yet

---

### 2. Set Up PostgreSQL Database

**Option A: Local PostgreSQL**
- Install PostgreSQL if you don't have it
- Create a database: `createdb calendar_journal`
- Or use a GUI tool like pgAdmin

**Option B: Cloud Database (Recommended for Production)**
- Sign up for [Supabase](https://supabase.com) (free tier available)
- Or [Neon](https://neon.tech) (serverless Postgres)
- Or [Railway](https://railway.app) (easy setup)
- Copy the connection string

**Status:** ⬜ Not done yet

---

### 3. Create `.env.local` File

Create a file named `.env.local` in the project root with:

```bash
# App
APP_BASE_URL=http://localhost:3000
SESSION_SECRET=generate-a-random-string-here-min-32-chars

# Database (replace with your actual connection string)
DATABASE_URL=postgresql://user:password@localhost:5432/calendar_journal

# Google OAuth (get these from Step 4)
GOOGLE_CLIENT_ID=your-client-id-here
GOOGLE_CLIENT_SECRET=your-client-secret-here
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

# Optional: OpenAI for image generation
OPENAI_API_KEY=your-openai-key-here

# Optional: For production cron protection
CRON_SECRET=another-random-string
```

**To generate SESSION_SECRET:**
```bash
# On Windows PowerShell:
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Or use an online generator
```

**Status:** ⬜ Not done yet

---

### 4. Set Up Google Cloud Console

**This is the most important step!**

1. **Go to:** https://console.cloud.google.com/
2. **Create/Select Project:**
   - Click project dropdown → "New Project"
   - Name it "Calendar Journal" (or anything)

3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search and enable:
     - ✅ **Google Calendar API**
     - ✅ **Gmail API**

4. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - If prompted, configure OAuth consent screen first:
     - User Type: **External**
     - App name: "Calendar Journal"
     - User support email: your email
     - Developer contact: your email
     - Click "Save and Continue"
     - Scopes: Click "Add or Remove Scopes"
       - Search and add:
         - `https://www.googleapis.com/auth/calendar`
         - `https://www.googleapis.com/auth/gmail.send`
     - Click "Save and Continue"
     - Test users: Add your email address
     - Click "Save and Continue"
   
   - Now create OAuth client:
     - Application type: **Web application**
     - Name: "Calendar Journal Web Client"
     - Authorized redirect URIs: 
       - `http://localhost:3000/api/auth/google/callback`
     - Click "Create"
     - **Copy the Client ID and Client Secret** → paste into `.env.local`

5. **Status:** ⬜ Not done yet

---

### 5. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

This creates the database tables.

**Status:** ⬜ Not done yet

---

### 6. Start the App

```bash
npm run dev
```

Visit: http://localhost:3000

**Status:** ⬜ Not done yet

---

## 🎯 What a User Needs to Do (After Setup)

Once you've completed the setup above, here's what an end user does:

### First Time:
1. Visit the app URL (e.g., `http://localhost:3000`)
2. Click **"Continue with Google"**
3. Sign in with their Google account
4. Grant permissions for Calendar and Gmail
5. Get redirected to `/today` page

### Daily Use:
1. Receive email reminder at 8pm (their local time)
2. Click link in email → goes to `/today`
3. Fill in three fields:
   - What they accomplished
   - What they could do better
   - What they're proud of
4. Click **"Save my day"**
5. Entry is saved and calendar event is created automatically
6. Later, click any day in Google Calendar to view the entry

---

## ⚠️ Common Issues

### "Cannot connect to database"
- Check `DATABASE_URL` is correct
- Make sure PostgreSQL is running (if local)
- Check firewall/network if using cloud DB

### "OAuth error" or "redirect_uri_mismatch"
- Make sure redirect URI in Google Console matches exactly: `http://localhost:3000/api/auth/google/callback`
- Check `GOOGLE_REDIRECT_URI` in `.env.local` matches

### "Unauthorized" when accessing pages
- Check that OAuth flow completed successfully
- Verify tokens are being stored in database

### Reminders not sending
- Cron job only runs on Vercel (or manually trigger `/api/cron/remind`)
- For local testing, manually call: `curl http://localhost:3000/api/cron/remind`
- Reminders only send at 8pm in user's timezone (window: 8:00-8:04)

---

## ✅ Ready to Launch Checklist

- [ ] Dependencies installed (`npm install`)
- [ ] Database created and accessible
- [ ] `.env.local` file created with all variables
- [ ] Google Cloud Console project created
- [ ] Google APIs enabled (Calendar + Gmail)
- [ ] OAuth credentials created and added to `.env.local`
- [ ] Database initialized (`npx prisma db push`)
- [ ] App runs without errors (`npm run dev`)
- [ ] Can sign in with Google
- [ ] Can create a journal entry
- [ ] Calendar event appears in Google Calendar

---

## 🚀 Once Everything Works

The app will:
- ✅ Let users sign in with Google
- ✅ Save journal entries to database
- ✅ Create all-day events in Google Calendar
- ✅ Send daily email reminders at 8pm
- ✅ Allow viewing past entries via calendar links

**Estimated setup time:** 15-30 minutes (mostly Google Cloud Console configuration)

