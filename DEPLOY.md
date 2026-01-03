# Effortless Deployment Guide

## 🎯 Goal: Make it work with just a Google account

This guide makes setup as simple as possible - end users just sign in with Google and it works!

---

## 🚀 Deploy to Vercel (Recommended - 10 minutes)

### Why Vercel?
- ✅ Free tier (perfect for personal use)
- ✅ Auto-provisions database (Vercel Postgres)
- ✅ One-click deploy from GitHub
- ✅ Automatic HTTPS, CDN, and cron jobs
- ✅ Zero server management

### Step 1: Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/calendar-journal.git
git push -u origin main
```

### Step 2: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **"New Project"**
3. Import your `calendar-journal` repository
4. Vercel auto-detects Next.js - click **"Deploy"**

### Step 3: Add Database (Auto-Provisioned)

1. In your Vercel project dashboard
2. Go to **"Storage"** tab
3. Click **"Create Database"** → **"Postgres"**
4. Name it: `calendar-journal-db`
5. Click **"Create"**

**That's it!** Vercel automatically:
- Creates the database
- Sets `DATABASE_URL` environment variable
- Connects it to your project

### Step 4: Set Environment Variables

In Vercel → Your Project → **Settings** → **Environment Variables**, add:

| Variable | Value | How to Get |
|----------|-------|------------|
| `APP_BASE_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `SESSION_SECRET` | Random 32+ char string | Generate at https://generate-secret.vercel.app/32 |
| `GOOGLE_CLIENT_ID` | From Google Cloud | See Step 5 |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud | See Step 5 |
| `GOOGLE_REDIRECT_URI` | `https://your-app.vercel.app/api/auth/google/callback` | Your URL + `/api/auth/google/callback` |

**Note:** `DATABASE_URL` is automatically set by Vercel Postgres - don't add it manually!

### Step 5: Google OAuth Setup (5 minutes)

1. **Go to:** https://console.cloud.google.com/
2. **Create Project:**
   - Click project dropdown → "New Project"
   - Name: "Calendar Journal"
   - Click "Create"

3. **Enable APIs:**
   - Go to "APIs & Services" → "Library"
   - Search "Google Calendar API" → Click → Enable
   - Search "Gmail API" → Click → Enable

4. **Configure OAuth Consent Screen:**
   - Go to "APIs & Services" → "OAuth consent screen"
   - User Type: **External** → Create
   - App name: "Calendar Journal"
   - User support email: Your email
   - Developer contact: Your email
   - Click "Save and Continue"
   - **Scopes:** Click "Add or Remove Scopes"
     - Search and add: `https://www.googleapis.com/auth/calendar`
     - Search and add: `https://www.googleapis.com/auth/gmail.send`
     - Click "Update" → "Save and Continue"
   - Test users: Add your email address
   - Click "Save and Continue" → "Back to Dashboard"

5. **Create OAuth Credentials:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "OAuth client ID"
   - Application type: **Web application**
   - Name: "Calendar Journal Web"
   - **Authorized redirect URIs:**
     - `https://your-app.vercel.app/api/auth/google/callback` (replace with your Vercel URL)
     - `http://localhost:3000/api/auth/google/callback` (for local testing)
   - Click "Create"
   - **Copy the Client ID and Client Secret**
   - Paste into Vercel environment variables

### Step 6: Initialize Database

After your first deployment, initialize the database schema:

**Option A: Using Vercel CLI (Recommended)**
```bash
npm i -g vercel
vercel login
vercel link
npx prisma generate
npx prisma db push
```

**Option B: Using Vercel Dashboard**
- Go to your deployment
- Click "View Function Logs"
- Or use the built-in terminal

### Step 7: Redeploy

After adding environment variables:
- Go to Vercel dashboard
- Click "Redeploy" on your latest deployment
- Or push a new commit to trigger auto-deploy

---

## ✅ That's It!

Your app is now live! Users can:
1. Visit your app URL
2. Click "Continue with Google"
3. Sign in → **It just works!**

No setup required for end users. Everything is automatic.

---

## 🧪 Test It

1. Visit your Vercel app URL
2. Click "Continue with Google"
3. Sign in with your Google account
4. Grant permissions
5. You should see the journal entry page
6. Fill in an entry and submit
7. Check your Google Calendar - you should see an all-day event!

---

## 🔄 For Local Development

If you want to test locally:

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Use Supabase (Free, Easy):**
   - Go to [supabase.com](https://supabase.com)
   - Create free account → New Project
   - Wait 2 minutes for database
   - Settings → Database → Copy connection string
   - Use as `DATABASE_URL` in `.env.local`

3. **Create `.env.local`:**
   ```bash
   APP_BASE_URL=http://localhost:3000
   SESSION_SECRET=[generate-random-string]
   DATABASE_URL=[supabase-connection-string]
   GOOGLE_CLIENT_ID=[from-google-cloud]
   GOOGLE_CLIENT_SECRET=[from-google-cloud]
   GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback
   ```

4. **Initialize database:**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run:**
   ```bash
   npm run dev
   ```

---

## 📊 What Gets Auto-Provisioned

With Vercel + Vercel Postgres:
- ✅ PostgreSQL database (managed, auto-scaling)
- ✅ Database connection string (auto-injected)
- ✅ HTTPS/SSL certificate (automatic)
- ✅ Global CDN (automatic)
- ✅ Cron job execution (automatic)
- ✅ Environment variable management (dashboard)
- ✅ Automatic deployments (on git push)

**You only configure:**
- Google OAuth (one-time, 5 minutes)
- SESSION_SECRET (generate once)

**End users configure:**
- Nothing! Just sign in with Google.

---

## 🎉 Result

- **Developer setup:** 10 minutes (one-time)
- **End user setup:** 0 minutes (just sign in)
- **Ongoing maintenance:** Minimal (Vercel handles everything)

Perfect for a personal journal app that "just works"!

