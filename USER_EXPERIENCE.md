# User Experience Guide

## 🎯 For End Users (After You Deploy)

### First Time Using the App

1. **Visit your app URL** (e.g., `https://your-app.vercel.app`)
2. **Click "Continue with Google"**
3. **Sign in** with their Google account
4. **Grant permissions:**
   - Calendar access (to create journal events)
   - Gmail send permission (for daily reminders)
5. **Done!** They're redirected to the journal page

**That's it - no setup, no configuration, just sign in and it works!**

---

## 📅 Daily Usage

### Morning/Anytime
- User can visit the app and write today's entry
- Entry is auto-saved as they type

### Evening (8pm local time)
- User receives an email reminder: "Time to do your daily journal"
- Email contains a link to `/today`
- User clicks link → fills in entry → submits

### After Submitting
- Entry is saved to the database
- All-day event is automatically created in their Google Calendar
- Event title: "Daily Journal ✅"
- Event description includes:
  - Short summary of their entry
  - Link to view full entry: `/entry/YYYY-MM-DD`
  - Optional image link (if AI image was generated)

### Viewing Past Entries
- User opens Google Calendar
- Clicks on any past "Daily Journal ✅" event
- Event description has a link to view the full entry
- User clicks link → sees their complete journal entry for that day

---

## ✨ What Makes It Effortless

### For End Users:
- ✅ **Zero setup** - Just sign in with Google
- ✅ **No configuration** - Everything works automatically
- ✅ **No database knowledge** - Completely abstracted
- ✅ **No server management** - All handled by Vercel
- ✅ **Automatic reminders** - Email sent daily at 8pm
- ✅ **Seamless integration** - Calendar events appear automatically
- ✅ **One entry per day** - Simple, focused experience

### For You (Developer):
- ✅ **One-time setup** - 10 minutes to deploy
- ✅ **Auto-provisioned database** - Vercel Postgres handles everything
- ✅ **No server management** - Vercel handles scaling, SSL, CDN
- ✅ **Automatic deployments** - Push to GitHub → Auto-deploy
- ✅ **Free tier** - Perfect for personal use

---

## 🔄 User Flow Diagram

```
User visits app
    ↓
Click "Continue with Google"
    ↓
Sign in with Google account
    ↓
Grant Calendar + Gmail permissions
    ↓
Redirected to /today page
    ↓
Fill in journal entry (auto-saves)
    ↓
Click "Save my day"
    ↓
Entry saved → Calendar event created
    ↓
Success page shown
    ↓
[Next day at 8pm]
    ↓
Email reminder sent
    ↓
User clicks link → Back to /today
    ↓
Repeat!
```

---

## 📧 Email Reminder Details

**When:** 8:00 PM in user's local timezone (from their Google Calendar settings)

**Subject:** "Time to do your daily journal"

**Body:**
```
Quick 2-minute check-in. Write today's entry here: 
https://your-app.vercel.app/today
```

**Rules:**
- Only sent if user hasn't submitted today's entry
- Only sent once per day per user
- Automatically accounts for DST (daylight saving time)
- Uses user's Google Calendar timezone

---

## 🎨 User Interface

### Login Page (`/login`)
- Clean, friendly design
- One button: "Continue with Google"
- Brief explanation of what the app does
- Note about required permissions

### Today Page (`/today`)
- Large date display (user's local timezone)
- Three input fields:
  1. "What did you get done today?" (large textarea)
  2. "One thing you'd do differently next time?" (single line)
  3. "One small win you're proud of?" (single line)
- Auto-save indicator ("Saving..." / "Saved")
- Submit button: "Save my day"
- Sign out link

### Complete Page (`/complete`)
- Success message: "Saved."
- Shows the submitted entry
- Optional: Generated AI image
- Link to view entry
- "Back to today" button

### Entry View (`/entry/[date]`)
- Read-only view of past entries
- Date header
- All three fields displayed
- Optional image
- "Back to today" button

### Settings Page (`/settings`)
- Connected Google account email
- Calendar being used
- Timezone (from Google Calendar)
- Reminder status
- Reconnect Google button
- Sign out button

---

## 🚫 What Users DON'T Need to Do

- ❌ Set up a database
- ❌ Configure environment variables
- ❌ Install anything
- ❌ Understand how it works
- ❌ Manage servers
- ❌ Set up OAuth
- ❌ Configure timezones
- ❌ Set up email sending
- ❌ Create calendar events manually
- ❌ Remember to journal (reminders handle this)

---

## ✅ What Happens Automatically

- ✅ Database connection (auto-configured)
- ✅ User authentication (Google OAuth)
- ✅ Token refresh (automatic)
- ✅ Calendar event creation (on submit)
- ✅ Calendar event updates (if entry edited)
- ✅ Email reminders (daily at 8pm)
- ✅ Timezone handling (from Google Calendar)
- ✅ DST adjustments (automatic)
- ✅ Draft auto-saving (as user types)
- ✅ Entry date calculation (user's local timezone)

---

## 🎉 Result

**End User Experience:**
1. Sign in with Google → **Works instantly**
2. Write journal entry → **Saves automatically**
3. Submit → **Calendar event appears**
4. Get reminder at 8pm → **Click and journal**
5. View past entries → **Click calendar event**

**Zero friction. Zero setup. Just works.**

