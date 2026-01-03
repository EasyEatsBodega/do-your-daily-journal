# One-Click Deploy Setup

This guide makes setup as simple as possible - you'll deploy to Vercel (free) and it auto-provisions everything.

## 🚀 Option 1: Deploy to Vercel (Recommended - 5 minutes)

### Step 1: One-Click Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/calendar-journal)

Or manually:
1. Push this code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repository
5. Vercel will auto-detect Next.js

### Step 2: Add Vercel Postgres (Auto-Provisioned)

1. In your Vercel project, go to "Storage" tab
2. Click "Create Database" → "Postgres"
3. Choose a name (e.g., "calendar-journal-db")
4. **Vercel automatically:**
   - Creates the database
   - Sets `DATABASE_URL` environment variable
   - Connects it to your project

### Step 3: Set Environment Variables

In Vercel project → Settings → Environment Variables, add:

```
APP_BASE_URL=https://your-app.vercel.app
SESSION_SECRET=[generate-random-32-char-string]
GOOGLE_CLIENT_ID=[from-google-cloud]
GOOGLE_CLIENT_SECRET=[from-google-cloud]
GOOGLE_REDIRECT_URI=https://your-app.vercel.app/api/auth/google/callback
```

**Generate SESSION_SECRET:**
- Use: https://generate-secret.vercel.app/32
- Or: `openssl rand -base64 32`

### Step 4: Configure Google OAuth (One-Time)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create project → Enable Calendar API + Gmail API
3. Create OAuth credentials
4. **Important:** Add TWO redirect URIs:
   - `https://your-app.vercel.app/api/auth/google/callback` (production)
   - `http://localhost:3000/api/auth/google/callback` (for local dev)
5. Copy Client ID and Secret to Vercel environment variables

### Step 5: Initialize Database

After first deploy, run this once:

```bash
# In Vercel dashboard → Deployments → Click on deployment → View Function Logs
# Or use Vercel CLI:
vercel env pull .env.local
npx prisma generate
npx prisma db push
```

**Or use Vercel's built-in terminal:**
- Go to your project → Deployments
- Click on a deployment → "View Function Logs"
- Or use Vercel CLI: `vercel db push`

### Step 6: Deploy!

Vercel will automatically:
- ✅ Install dependencies
- ✅ Build the app
- ✅ Connect to Postgres
- ✅ Deploy

**That's it!** Your app is live.

---

## 🎯 For End Users (After You Deploy)

End users just need to:
1. Visit your app URL
2. Click "Continue with Google"
3. Sign in → Done!

No setup required for them. Everything works automatically.

---

## 🔧 Option 2: Local Development (Simplified)

If you want to test locally first:

### Quick Local Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Use Supabase (Free, Auto-Setup):**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Wait 2 minutes for database to provision
   - Go to Settings → Database
   - Copy "Connection string" (URI format)
   - Use this as your `DATABASE_URL`

3. **Create `.env.local`:**
   ```bash
   APP_BASE_URL=http://localhost:3000
   SESSION_SECRET=your-random-32-char-string
   DATABASE_URL=[paste-supabase-connection-string]
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

## 📝 Google OAuth Setup (Simplified Guide)

### Quick Steps:

1. **Go to:** https://console.cloud.google.com/

2. **Create Project:**
   - Click project dropdown → "New Project"
   - Name: "Calendar Journal"
   - Click "Create"

3. **Enable APIs:**
   - Search "Google Calendar API" → Enable
   - Search "Gmail API" → Enable

4. **OAuth Consent Screen:**
   - "APIs & Services" → "OAuth consent screen"
   - User Type: **External**
   - App name: "Calendar Journal"
   - Support email: your email
   - Developer email: your email
   - **Scopes:** Add these two:
     - `https://www.googleapis.com/auth/calendar`
     - `https://www.googleapis.com/auth/gmail.send`
   - Test users: Add your email
   - Save

5. **Create Credentials:**
   - "APIs & Services" → "Credentials"
   - "Create Credentials" → "OAuth client ID"
   - Type: **Web application**
   - Name: "Calendar Journal"
   - **Authorized redirect URIs:**
     - `http://localhost:3000/api/auth/google/callback` (local)
     - `https://your-app.vercel.app/api/auth/google/callback` (production)
   - Create
   - **Copy Client ID and Client Secret**

---

## ✅ What Gets Auto-Provisioned

With Vercel + Vercel Postgres:
- ✅ Database (auto-created)
- ✅ Database connection (auto-configured)
- ✅ Environment variables (auto-injected)
- ✅ HTTPS/SSL (automatic)
- ✅ CDN (automatic)
- ✅ Cron jobs (automatic)

**You only configure:**
- Google OAuth credentials (one-time, 5 minutes)
- SESSION_SECRET (generate once)

---

## 🎉 Result

After setup:
- **Developer:** One-time 10-minute setup
- **End Users:** Just sign in with Google → Works instantly!

No database setup, no server management, no configuration needed for users.

