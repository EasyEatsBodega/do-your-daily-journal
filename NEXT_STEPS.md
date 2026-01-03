# Next Steps - Production Deployment

## Current Status
✅ Code is complete and committed locally  
✅ Git is configured  
⬜ Code pushed to GitHub  
⬜ Deployed to Vercel  
⬜ Production environment configured  

---

## Step 1: Push Code to GitHub (Do This Now)

### Option A: If you already created the repo on GitHub

1. **Go to your GitHub repository page**
2. **Copy the repository URL** (should be something like `https://github.com/EasyEatsBodega/your-repo-name.git`)
3. **Tell me the repository name** and I'll help you push

### Option B: Create the repo on GitHub first

1. **Go to:** https://github.com/new
2. **Repository name:** `calendar-journal` (or any name you prefer)
3. **Description:** "Daily journal app with Google Calendar integration"
4. **Choose:** Public or Private
5. **DO NOT** check "Add a README" (we already have one)
6. **Click "Create repository"**
7. **Copy the repository URL** from the page
8. **Tell me the URL** and I'll push the code

---

## Step 2: Deploy to Vercel (After GitHub Push)

1. **Go to:** https://vercel.com
2. **Sign in with GitHub**
3. **Click "New Project"**
4. **Import** your `calendar-journal` repository
5. **Vercel auto-detects Next.js** - just click "Deploy"
6. **Wait 2-3 minutes** for deployment
7. **Copy your Vercel URL** (e.g., `https://calendar-journal.vercel.app`)

**Time:** 5 minutes

---

## Step 3: Add Database (Auto-Provisioned)

1. **In Vercel dashboard** → Your project
2. **Go to "Storage" tab**
3. **Click "Create Database"** → **"Postgres"**
4. **Name:** `calendar-journal-db`
5. **Click "Create"**

**Vercel automatically sets up everything!**

**Time:** 2 minutes

---

## Step 4: Set Environment Variables

**In Vercel** → Your Project → **Settings** → **Environment Variables**

Add these:

| Variable | Example Value | Notes |
|----------|---------------|-------|
| `APP_BASE_URL` | `https://calendar-journal.vercel.app` | Your actual Vercel URL |
| `SESSION_SECRET` | `abc123xyz...` | Generate at https://generate-secret.vercel.app/32 |
| `GOOGLE_CLIENT_ID` | `123456.apps.googleusercontent.com` | From Google Cloud (Step 5) |
| `GOOGLE_CLIENT_SECRET` | `GOCSPX-...` | From Google Cloud (Step 5) |
| `GOOGLE_REDIRECT_URI` | `https://calendar-journal.vercel.app/api/auth/google/callback` | Your URL + callback |

**Note:** `DATABASE_URL` is auto-set by Vercel Postgres - don't add it!

**Time:** 5 minutes

---

## Step 5: Configure Google OAuth for Production

### A. Update Google Cloud Console

1. **Go to:** https://console.cloud.google.com/
2. **Select your project** (or create one if you haven't)
3. **Enable APIs:**
   - Search "Google Calendar API" → Enable
   - Search "Gmail API" → Enable
4. **Go to:** "APIs & Services" → "Credentials"
5. **Create or Edit OAuth 2.0 Client:**
   - Application type: **Web application**
   - **Authorized redirect URIs:**
     - `https://your-vercel-url.vercel.app/api/auth/google/callback` (your actual Vercel URL)
     - `http://localhost:3000/api/auth/google/callback` (for local dev)
   - **Click "Save"**
6. **Copy Client ID and Client Secret** → Add to Vercel environment variables

### B. OAuth Consent Screen (if not done)

1. **Go to:** "APIs & Services" → "OAuth consent screen"
2. **Fill in:**
   - App name: "Calendar Journal"
   - User support email: Your email
   - Developer contact: Your email
3. **Add Scopes:**
   - `https://www.googleapis.com/auth/calendar`
   - `https://www.googleapis.com/auth/gmail.send`
4. **Add Test Users:** Your email (required for testing)
5. **Save**

**Time:** 10 minutes

---

## Step 6: Initialize Database Schema

After Vercel Postgres is created, run:

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login
vercel login

# Link to your project
vercel link

# Pull environment variables
vercel env pull .env.local

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push
```

**Time:** 5 minutes

---

## Step 7: Redeploy

After adding environment variables:

1. **Go to Vercel dashboard**
2. **Click "Redeploy"** on your latest deployment
3. **Or** push a new commit to trigger auto-deploy

**Time:** 2 minutes

---

## Step 8: Test Production App

1. **Visit your Vercel URL**
2. **Click "Continue with Google"**
3. **Sign in** with your Google account
4. **Grant permissions**
5. **Fill in a test journal entry**
6. **Submit**
7. **Check your Google Calendar** - you should see an all-day event!

**Time:** 2 minutes

---

## 🎯 What to Do RIGHT NOW

**Immediate next step:**

1. **Create the GitHub repository** (if you haven't):
   - Go to https://github.com/new
   - Name it `calendar-journal`
   - Don't add README/license
   - Create it

2. **Tell me the repository URL** and I'll push the code

OR

3. **If you already created it**, tell me the repository name/URL

---

## 📋 Quick Checklist

- [ ] GitHub repository created
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Vercel Postgres database created
- [ ] Environment variables set
- [ ] Google OAuth configured with production URL
- [ ] Database schema initialized
- [ ] App tested and working

---

## ⏱️ Total Time Estimate

- **Step 1 (GitHub):** 2 minutes
- **Step 2 (Vercel Deploy):** 5 minutes
- **Step 3 (Database):** 2 minutes
- **Step 4 (Env Vars):** 5 minutes
- **Step 5 (Google OAuth):** 10 minutes
- **Step 6 (DB Schema):** 5 minutes
- **Step 7 (Redeploy):** 2 minutes
- **Step 8 (Test):** 2 minutes

**Total: ~30 minutes** to go from GitHub to production!

---

## 🚀 After Production

Once everything is set up:
- ✅ Users can sign in with Google instantly
- ✅ No setup required for end users
- ✅ Daily reminders work automatically
- ✅ Calendar events created automatically
- ✅ Everything "just works"!

