# Production Deployment Checklist

## ✅ Step 1: Push Code to GitHub (Do This First)

Since you've created the GitHub repo, let's push the code:

```bash
# Add remote (replace with your actual repo URL)
git remote add origin https://github.com/EasyEatsBodega/calendar-journal.git

# Push to GitHub
git push -u origin main
```

**Status:** ⬜ Not done yet

---

## ✅ Step 2: Deploy to Vercel (5 minutes)

1. **Go to:** https://vercel.com
2. **Sign in** with GitHub
3. **Click "New Project"**
4. **Import** your `calendar-journal` repository
5. **Vercel auto-detects Next.js** - click "Deploy"
6. **Wait for deployment** (takes 2-3 minutes)

**Status:** ⬜ Not done yet

**Result:** You'll get a URL like `https://calendar-journal.vercel.app`

---

## ✅ Step 3: Add Vercel Postgres Database (Auto-Provisioned)

1. **In Vercel dashboard** → Your project
2. **Go to "Storage" tab**
3. **Click "Create Database"** → **"Postgres"**
4. **Name it:** `calendar-journal-db`
5. **Click "Create"**

**Vercel automatically:**
- ✅ Creates the database
- ✅ Sets `DATABASE_URL` environment variable
- ✅ Connects it to your project

**Status:** ⬜ Not done yet

---

## ✅ Step 4: Set Environment Variables in Vercel

**In Vercel** → Your Project → **Settings** → **Environment Variables**

Add these (replace with your actual values):

| Variable | Value | How to Get |
|----------|-------|------------|
| `APP_BASE_URL` | `https://your-app.vercel.app` | Your Vercel deployment URL |
| `SESSION_SECRET` | Random 32+ char string | Generate at https://generate-secret.vercel.app/32 |
| `GOOGLE_CLIENT_ID` | From Google Cloud | See Step 5 |
| `GOOGLE_CLIENT_SECRET` | From Google Cloud | See Step 5 |
| `GOOGLE_REDIRECT_URI` | `https://your-app.vercel.app/api/auth/google/callback` | Your URL + callback path |

**Note:** `DATABASE_URL` is automatically set by Vercel Postgres - don't add it manually!

**Status:** ⬜ Not done yet

---

## ✅ Step 5: Configure Google OAuth for Production (10 minutes)

### A. Update Google Cloud Console

1. **Go to:** https://console.cloud.google.com/
2. **Select your project** (or create one)
3. **Enable APIs:**
   - Google Calendar API
   - Gmail API
4. **Go to:** "APIs & Services" → "Credentials"
5. **Edit your OAuth 2.0 Client:**
   - Click on your existing OAuth client
   - **Add to "Authorized redirect URIs":**
     - `https://your-app.vercel.app/api/auth/google/callback` (replace with your Vercel URL)
     - Keep `http://localhost:3000/api/auth/google/callback` for local dev
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
4. **Add Test Users** (your email) - required for testing before verification
5. **Save**

**Status:** ⬜ Not done yet

---

## ✅ Step 6: Initialize Database Schema

After Vercel Postgres is created, initialize the database:

**Option A: Using Vercel CLI (Recommended)**

```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
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

**Option B: Using Vercel Dashboard**

1. Go to your deployment
2. Click "View Function Logs"
3. Or use the built-in terminal

**Status:** ⬜ Not done yet

---

## ✅ Step 7: Redeploy with Environment Variables

After adding environment variables:

1. **Go to Vercel dashboard**
2. **Click "Redeploy"** on your latest deployment
3. **Or push a new commit** to trigger auto-deploy

**Status:** ⬜ Not done yet

---

## ✅ Step 8: Test the Production App

1. **Visit your Vercel URL:** `https://your-app.vercel.app`
2. **Click "Continue with Google"**
3. **Sign in** with your Google account
4. **Grant permissions**
5. **Fill in a test journal entry**
6. **Submit** → Check your Google Calendar for the event

**Status:** ⬜ Not done yet

---

## 🎉 Production Ready Checklist

- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Vercel Postgres database created
- [ ] Environment variables set in Vercel
- [ ] Google OAuth configured with production URL
- [ ] Database schema initialized
- [ ] App redeployed with env vars
- [ ] Tested sign-in flow
- [ ] Tested journal entry creation
- [ ] Verified calendar event creation

---

## 🚀 What Users Can Do Now

Once all steps are complete:

1. **Visit your app URL**
2. **Click "Continue with Google"**
3. **Sign in** → **Done!**

**No setup required for users** - it just works!

---

## 📧 Daily Reminders

The cron job is automatically configured via `vercel.json`:
- Runs every 5 minutes
- Checks if it's 8pm in each user's timezone
- Sends email reminders automatically

**No additional setup needed!**

---

## 🔒 Security Notes

- ✅ Environment variables are encrypted in Vercel
- ✅ Database is managed by Vercel (secure)
- ✅ HTTPS is automatic
- ✅ Sessions are encrypted with `SESSION_SECRET`

---

## 🐛 Troubleshooting

### "Cannot connect to database"
- Wait a few minutes after creating Vercel Postgres
- Check that `DATABASE_URL` is set automatically
- Redeploy after database creation

### "OAuth redirect_uri_mismatch"
- Verify redirect URI in Google Console matches exactly
- Must be: `https://your-app.vercel.app/api/auth/google/callback`
- No trailing slashes!

### "Unauthorized" errors
- Check environment variables are set correctly
- Verify Google OAuth credentials
- Check Vercel deployment logs

---

## 📊 Next Steps After Production

1. **Monitor usage** in Vercel dashboard
2. **Check logs** if issues arise
3. **Add custom domain** (optional) in Vercel settings
4. **Set up monitoring** (optional) - Vercel Analytics
5. **Scale as needed** - Vercel handles this automatically

---

## 💰 Cost Estimate

**Free Tier (Perfect for Personal Use):**
- ✅ Vercel: Free (hobby plan)
- ✅ Vercel Postgres: Free (up to 256 MB)
- ✅ Google APIs: Free (within quotas)
- ✅ Total: **$0/month**

**If you grow:**
- Vercel Pro: $20/month (if needed)
- Vercel Postgres: Scales with usage
- Still very affordable for a personal project

---

## ✅ Ready to Deploy?

Follow the steps above in order. Each step takes just a few minutes. Total time: **~20 minutes** to go from GitHub to production!

