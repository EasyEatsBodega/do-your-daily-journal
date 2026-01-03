# Step 3: Add Database & Configure Environment

## ✅ Step 2 Complete: Deployed to Vercel!

Your app is deployed at: https://vercel.com/easys-projects-adc8f2b9/do-your-daily-journal

**Your production URL is likely:** `https://do-your-daily-journal.vercel.app` (or similar)

---

## 🗄️ Step 3: Add Vercel Postgres Database

1. **In your Vercel dashboard** (the page you're on)
2. **Click "Storage" tab** (in the top menu)
3. **Click "Create Database"**
4. **Select "Postgres"**
5. **Name it:** `daily-journal-db` (or any name)
6. **Click "Create"**

**Vercel automatically:**
- ✅ Creates the database
- ✅ Sets `DATABASE_URL` environment variable
- ✅ Connects it to your project

**Wait 1-2 minutes** for the database to be created.

**Time:** 2 minutes

---

## 🔐 Step 4: Set Environment Variables

**In Vercel** → Your Project → **Settings** → **Environment Variables**

Click "Add New" and add these:

### 1. APP_BASE_URL
- **Name:** `APP_BASE_URL`
- **Value:** `https://do-your-daily-journal.vercel.app` (your actual Vercel URL - check the "Domains" tab to confirm)
- **Environment:** ✅ Production ✅ Preview ✅ Development
- Click "Save"

### 2. SESSION_SECRET
- **Name:** `SESSION_SECRET`
- **Value:** Generate a random 32+ character string
  - Go to: https://generate-secret.vercel.app/32
  - Or use PowerShell: `[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))`
- **Environment:** ✅ Production ✅ Preview ✅ Development
- Click "Save"

### 3. GOOGLE_REDIRECT_URI
- **Name:** `GOOGLE_REDIRECT_URI`
- **Value:** `https://do-your-daily-journal.vercel.app/api/auth/google/callback` (your URL + callback path)
- **Environment:** ✅ Production ✅ Preview ✅ Development
- Click "Save"

### 4. GOOGLE_CLIENT_ID
- **Name:** `GOOGLE_CLIENT_ID`
- **Value:** (We'll get this in Step 5 - leave empty for now, or add it after)
- **Environment:** ✅ Production ✅ Preview ✅ Development
- Click "Save"

### 5. GOOGLE_CLIENT_SECRET
- **Name:** `GOOGLE_CLIENT_SECRET`
- **Value:** (We'll get this in Step 5 - leave empty for now, or add it after)
- **Environment:** ✅ Production ✅ Preview ✅ Development
- Click "Save"

**Note:** `DATABASE_URL` is automatically set by Vercel Postgres - don't add it manually!

**Time:** 5 minutes

---

## 🔑 Step 5: Configure Google OAuth

### A. Go to Google Cloud Console

1. **Go to:** https://console.cloud.google.com/
2. **Select your project** (or create one):
   - Click project dropdown → "New Project"
   - Name: "Daily Journal"
   - Click "Create"

### B. Enable APIs

1. **Go to:** "APIs & Services" → "Library"
2. **Search "Google Calendar API"** → Click → **Enable**
3. **Search "Gmail API"** → Click → **Enable**

### C. Configure OAuth Consent Screen

1. **Go to:** "APIs & Services" → "OAuth consent screen"
2. **User Type:** External → Create
3. **Fill in:**
   - App name: "Daily Journal"
   - User support email: `EasyEatsBodega@gmail.com`
   - Developer contact: `EasyEatsBodega@gmail.com`
   - Click "Save and Continue"
4. **Scopes:**
   - Click "Add or Remove Scopes"
   - Search and add: `https://www.googleapis.com/auth/calendar`
   - Search and add: `https://www.googleapis.com/auth/gmail.send`
   - Click "Update" → "Save and Continue"
5. **Test users:**
   - Add: `EasyEatsBodega@gmail.com`
   - Click "Save and Continue" → "Back to Dashboard"

### D. Create OAuth Credentials

1. **Go to:** "APIs & Services" → "Credentials"
2. **Click "Create Credentials"** → "OAuth client ID"
3. **Application type:** Web application
4. **Name:** "Daily Journal Web"
5. **Authorized redirect URIs:**
   - `https://do-your-daily-journal.vercel.app/api/auth/google/callback` (your actual Vercel URL)
   - `http://localhost:3000/api/auth/google/callback` (for local dev)
   - Click "Add" for each
6. **Click "Create"**
7. **Copy the Client ID** → Paste into Vercel `GOOGLE_CLIENT_ID`
8. **Copy the Client Secret** → Paste into Vercel `GOOGLE_CLIENT_SECRET`

**Time:** 10 minutes

---

## 🗄️ Step 6: Initialize Database Schema

After Vercel Postgres is created, initialize the database:

### Using Vercel CLI

```bash
# Install Vercel CLI (if not installed)
npm i -g vercel

# Login to Vercel
vercel login

# Link to your project (select your project when prompted)
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

## 🔄 Step 7: Redeploy

After adding all environment variables:

1. **Go to Vercel dashboard**
2. **Click "Deployments" tab**
3. **Click the "..." menu** on your latest deployment
4. **Click "Redeploy"**
5. **Wait for deployment** to complete

**Time:** 2 minutes

---

## ✅ Step 8: Test Production App

1. **Visit your Vercel URL:** `https://do-your-daily-journal.vercel.app`
2. **Click "Continue with Google"**
3. **Sign in** with your Google account
4. **Grant permissions** for Calendar and Gmail
5. **Fill in a test journal entry**
6. **Click "Save my day"**
7. **Check your Google Calendar** - you should see an all-day event!

**Time:** 2 minutes

---

## 🎯 What to Do Right Now

1. **First, find your actual Vercel URL:**
   - In Vercel dashboard → "Domains" tab
   - Copy the production domain (e.g., `do-your-daily-journal.vercel.app`)

2. **Add the database:**
   - Go to "Storage" tab → Create Postgres database

3. **Set environment variables:**
   - Add APP_BASE_URL, SESSION_SECRET, GOOGLE_REDIRECT_URI
   - We'll add Google credentials after Step 5

Let me know when you've added the database and I'll help with the next steps!

