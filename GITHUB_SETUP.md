# Push to GitHub - Quick Guide

## Option 1: Using GitHub Desktop (Easiest)

1. **Download GitHub Desktop:** https://desktop.github.com/
2. **Install and sign in** with your GitHub account
3. **Add this repository:**
   - File → Add Local Repository
   - Browse to: `C:\Users\easye\OneDrive\Desktop\Daily Journal`
   - Click "Add Repository"
4. **Commit all files:**
   - Review the changes
   - Write commit message: "Initial commit - Calendar Journal app"
   - Click "Commit to main"
5. **Publish to GitHub:**
   - Click "Publish repository"
   - Choose name: `calendar-journal` (or any name)
   - Make it Public or Private
   - Click "Publish Repository"

**Done!** Your code is now on GitHub.

---

## Option 2: Using Git Command Line

### Step 1: Install Git

**Download Git for Windows:** https://git-scm.com/download/win

During installation, choose:
- ✅ "Git from the command line and also from 3rd-party software"
- ✅ Default editor (or choose your preferred)
- ✅ "Use bundled OpenSSH"
- ✅ "Checkout Windows-style, commit Unix-style line endings"

### Step 2: Open Git Bash or PowerShell

After installation, open **Git Bash** or **PowerShell** in this directory.

### Step 3: Initialize and Push

```bash
# Navigate to project (if not already there)
cd "C:\Users\easye\OneDrive\Desktop\Daily Journal"

# Initialize git repository
git init

# Add all files
git add .

# Create initial commit
git commit -m "Initial commit - Calendar Journal app"

# Create repository on GitHub first, then:
# 1. Go to https://github.com/new
# 2. Repository name: calendar-journal
# 3. Don't initialize with README (we already have one)
# 4. Click "Create repository"

# Add remote (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/calendar-journal.git

# Push to GitHub
git branch -M main
git push -u origin main
```

---

## Option 3: Using VS Code

1. **Open VS Code** in this folder
2. **Install Git extension** (if not already installed)
3. **Open Source Control panel** (Ctrl+Shift+G)
4. **Click "Initialize Repository"** (if not already initialized)
5. **Stage all changes** (click + next to "Changes")
6. **Commit** with message: "Initial commit - Calendar Journal app"
7. **Publish to GitHub:**
   - Click "..." menu → "Publish to GitHub"
   - Choose repository name: `calendar-journal`
   - Choose Public or Private
   - Click "Publish"

---

## What Gets Pushed

✅ All source code
✅ Configuration files
✅ Documentation (README, SETUP, DEPLOY guides)
✅ Prisma schema

❌ NOT pushed (protected by .gitignore):
- `node_modules/` (dependencies)
- `.env.local` (your secrets)
- `.next/` (build files)
- Database files

---

## After Pushing

Once your code is on GitHub, you can:

1. **Deploy to Vercel:**
   - Go to https://vercel.com
   - Click "New Project"
   - Import your GitHub repository
   - Follow the DEPLOY.md guide

2. **Share with others:**
   - Give them the GitHub repository URL
   - They can clone and set up locally

3. **Continue development:**
   - Make changes locally
   - Commit and push updates
   - Vercel will auto-deploy on push (if configured)

---

## Quick Commands Reference

```bash
# Check status
git status

# Add all files
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# View commit history
git log
```

