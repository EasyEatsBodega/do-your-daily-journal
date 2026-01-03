# Deploy to Production - Right Now!

## ✅ Step 1: Code Pushed to GitHub - DONE!

Your code is now at: https://github.com/EasyEatsBodega/Your-Daily-Journal

---

## 🚀 Step 2: Deploy to Vercel (5 minutes)

I've opened Vercel for you. Follow these steps:

1. **Sign in with GitHub** (use your EasyEatsBodega account)
2. **Click "New Project"**
3. **Import Repository:**
   - Find `EasyEatsBodega/Your-Daily-Journal`
   - Click "Import"
4. **Configure Project:**
   - Framework Preset: **Next.js** (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)
   - Install Command: `npm install` (default)
5. **Click "Deploy"**
6. **Wait 2-3 minutes** for deployment
7. **Copy your Vercel URL** (e.g., `https://your-daily-journal.vercel.app`)

**Time:** 5 minutes

---

## 💾 Step 3: Add Vercel Postgres Database (2 minutes)

1. **In Vercel dashboard** → Click on your project
2. **Go to "Storage" tab** (in the top menu)
3. **Click "Create Database"**
4. **Select "Postgres"**
5. **Name it:** `daily-journal-db`
6. **Click "Create"**

**Vercel automatically:**
- ✅ Creates the database
- ✅ Sets `DATABASE_URL` environment variable
- ✅ Connects it to your project

**Time:** 2 minutes

---

## 🔐 Step 4: Set Environment Variables (5 minutes)

**In Vercel** → Your Project → **Settings** → **Environment Variables**

Click "Add New" and add these one by one:

### 1. APP_BASE_URL
- **Name:** `APP_BASE_URL`
- **Value:** `https://your-vercel-url.vercel.app` (your actual Vercel URL from Step 2)
- **Environment:** Production, Preview, Development (check all)
- Click "Save"

### 2. SESSION_SECRET
- **Name:** `SESSION_SECRET`
- **Value:** Generate at https://generate-secret.vercel.app/32
  - Or use: `openssl rand -base64 32` in terminal
- **Environment:** Production, Preview, Development (check all)
- Click "Save"

### 3. GOOGLE_CLIENT_ID
- **Name:** `GOOGLE_CLIENT_ID`
- **Value:** (We'll get this in Step 5)
- **Environment:** Production, Preview, Development (check all)
- Click "Save"

### 4. GOOGLE_CLIENT_SECRET
- **Name:** `GOOGLE_CLIENT_SECRET`
- **Value:** (We'll get this in Step 5)
- **Environment:** Production, Preview, Development (check all)
- Click "Save"

### 5. GOOGLE_REDIRECT_URI
- **Name:** `GOOGLE_REDIRECT_URI`
- **Value:** `https://your-vercel-url.vercel.app/api/auth/google/callback` (your Vercel URL + callback)
- **Environment:** Production, Preview, Development (check all)
- Click "Save"

**Note:** `DATABASE_URL` is automatically set by Vercel Postgres - don't add it manually!

**Time:** 5 minutes

---

## 🔑 Step 5: Configure Google OAuth (10 minutes)

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
   - `https://your-vercel-url.vercel.app/api/auth/google/callback` (your actual Vercel URL)
   - `http://localhost:3000/api/auth/google/callback` (for local dev)
   - Click "Add" for each
6. **Click "Create"**
7. **Copy the Client ID** → Paste into Vercel `GOOGLE_CLIENT_ID`
8. **Copy the Client Secret** → Paste into Vercel `GOOGLE_CLIENT_SECRET`

**Time:** 10 minutes

---

## 🗄️ Step 6: Initialize Database Schema (5 minutes)

After Vercel Postgres is created, initialize the database:

### Option A: Using Vercel CLI (Recommended)

```bash
# Install Vercel CLI
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

### Option B: Using Vercel Dashboard

1. Go to your deployment
2. Click "View Function Logs"
3. Or use the built-in terminal

**Time:** 5 minutes

---

## 🔄 Step 7: Redeploy (2 minutes)

After adding all environment variables:

1. **Go to Vercel dashboard**
2. **Click on your project**
3. **Go to "Deployments" tab**
4. **Click the "..." menu** on your latest deployment
5. **Click "Redeploy"**
6. **Wait for deployment** to complete

**Time:** 2 minutes

---

## ✅ Step 8: Test Production App (2 minutes)

1. **Visit your Vercel URL:** `https://your-vercel-url.vercel.app`
2. **Click "Continue with Google"**
3. **Sign in** with your Google account (`EasyEatsBodega@gmail.com`)
4. **Grant permissions** for Calendar and Gmail
5. **You should be redirected** to `/today` page
6. **Fill in a test journal entry:**
   - What you accomplished
   - What you could do better
   - What you're proud of
7. **Click "Save my day"**
8. **Check your Google Calendar** - you should see an all-day event "Daily Journal ✅"!

**Time:** 2 minutes

---

## 🎉 Success!

If everything works:
- ✅ Users can sign in with Google
- ✅ Journal entries are saved
- ✅ Calendar events are created automatically
- ✅ Daily reminders will work at 8pm local time

---

## 📋 Quick Checklist

- [ ] Code pushed to GitHub ✅
- [ ] Deployed to Vercel
- [ ] Vercel Postgres database created
- [ ] Environment variables set
- [ ] Google OAuth configured
- [ ] Database schema initialized
- [ ] App redeployed
- [ ] Tested and working

---

## 🆘 Troubleshooting

### "Cannot connect to database"
- Wait a few minutes after creating Vercel Postgres
- Make sure you ran `npx prisma db push`

### "OAuth redirect_uri_mismatch"
- Check redirect URI in Google Console matches exactly
- Must be: `https://your-vercel-url.vercel.app/api/auth/google/callback`
- No trailing slashes!

### "Unauthorized" errors
- Check all environment variables are set
- Verify Google OAuth credentials
- Check Vercel deployment logs

---

## ⏱️ Total Time: ~30 minutes

You're almost there! Follow these steps and your app will be live and ready for users!

