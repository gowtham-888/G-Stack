import './globals.css'
import SiteNav from '@/components/site-nav'
import HudOverlay from '@/components/hud-overlay'

export const metadata = {
  title: 'ResQNet — AI Emergency Evacuation Intelligence',
  description: 'AI-powered evacuation intelligence for disaster response teams across Karnataka.',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark">
      <body className="min-h-screen bg-[#0a0a0f] text-slate-200 antialiased">
        <SiteNav />
        <HudOverlay />
        <main className="relative">{children}</main>
      </body>
    </html>
  )
}
