'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function SetupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [config, setConfig] = useState({
    googleClientId: '',
    googleClientSecret: '',
    appUrl: typeof window !== 'undefined' ? window.location.origin : '',
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // In a real implementation, this would save to a config file or API
    // For now, we'll just show instructions
    alert('Please add these to your Vercel environment variables or .env.local file')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-xl p-8">
          <h1 className="text-3xl font-bold mb-8">Calendar Journal Setup</h1>

          <div className="space-y-6">
            <div className="border-l-4 border-blue-500 pl-4">
              <h2 className="text-xl font-semibold mb-2">Quick Setup Guide</h2>
              <p className="text-neutral-600 dark:text-neutral-400">
                Follow these steps to get your app running in minutes.
              </p>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">🚀 Recommended: Deploy to Vercel</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Push code to GitHub</li>
                  <li>Go to <a href="https://vercel.com" className="text-blue-600 underline">vercel.com</a> and import project</li>
                  <li>Add Vercel Postgres database (auto-provisioned)</li>
                  <li>Add environment variables (see below)</li>
                  <li>Deploy!</li>
                </ol>
              </div>

              <div className="p-4 bg-neutral-50 dark:bg-neutral-700 rounded-lg">
                <h3 className="font-semibold mb-2">📋 Required Environment Variables</h3>
                <div className="space-y-2 text-sm font-mono">
                  <div>
                    <code className="text-blue-600">APP_BASE_URL</code> = {config.appUrl}
                  </div>
                  <div>
                    <code className="text-blue-600">SESSION_SECRET</code> = [generate random 32-char string]
                  </div>
                  <div>
                    <code className="text-blue-600">DATABASE_URL</code> = [auto-set by Vercel Postgres]
                  </div>
                  <div>
                    <code className="text-blue-600">GOOGLE_CLIENT_ID</code> = [from Google Cloud Console]
                  </div>
                  <div>
                    <code className="text-blue-600">GOOGLE_CLIENT_SECRET</code> = [from Google Cloud Console]
                  </div>
                  <div>
                    <code className="text-blue-600">GOOGLE_REDIRECT_URI</code> = {config.appUrl}/api/auth/google/callback
                  </div>
                </div>
              </div>

              <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <h3 className="font-semibold mb-2">✅ Google OAuth Setup</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm">
                  <li>Go to <a href="https://console.cloud.google.com" className="text-blue-600 underline" target="_blank">Google Cloud Console</a></li>
                  <li>Create project → Enable Calendar API + Gmail API</li>
                  <li>Create OAuth credentials (Web application)</li>
                  <li>Add redirect URI: <code className="bg-neutral-200 dark:bg-neutral-700 px-1 rounded">{config.appUrl}/api/auth/google/callback</code></li>
                  <li>Copy Client ID and Secret to environment variables</li>
                </ol>
              </div>

              <div className="pt-4">
                <a
                  href="https://console.cloud.google.com"
                  target="_blank"
                  className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
                >
                  Open Google Cloud Console →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

