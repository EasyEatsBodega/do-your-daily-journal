# Install Git - Quick Guide

## Step 1: Download Git

**Download from:** https://git-scm.com/download/win

Click the big "Download for Windows" button.

## Step 2: Install Git

1. **Run the installer** (Git-2.x.x-64-bit.exe)
2. **Click through the installer:**
   - ✅ "Use bundled OpenSSH" (default)
   - ✅ "Use the OpenSSL library" (default)
   - ✅ "Checkout Windows-style, commit Unix-style line endings" (default)
   - ✅ "Use bundled OpenSSH" (default)
   - ✅ "Use the native Windows Secure Channel library" (default)
   - ✅ "Git Credential Manager" (default)
   - ✅ "Enable file system caching" (default)
   - ✅ Default editor (or choose VS Code if you have it)
   - ✅ "Let Git decide" for PATH
   - ✅ "Use bundled OpenSSH"
   - ✅ "Use the OpenSSL library"
   - ✅ "Checkout Windows-style, commit Unix-style line endings"
   - ✅ "Use MinTTY"
   - ✅ Default (fast-forward or merge)
   - ✅ "Git Credential Manager"
   - ✅ "Enable file system caching"
   - ✅ "Enable symbolic links"
   - Click **Install**

**Just click "Next" through everything** - the defaults are fine!

## Step 3: Verify Installation

After installation, **close and reopen PowerShell** (or open a new terminal), then run:

```powershell
git --version
```

You should see something like: `git version 2.x.x`

## Step 4: Configure Git (One-Time)

```powershell
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

Use the name and email associated with your GitHub account.

---

## After Installation

Once Git is installed, come back and I'll help you:
1. Initialize the repository
2. Add all files
3. Create the first commit
4. Push to GitHub

**Let me know when Git is installed!**

