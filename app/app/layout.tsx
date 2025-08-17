
import './globals.css'
import { ClerkProvider, SignedIn, SignedOut, UserButton } from '@clerk/nextjs'
import Link from 'next/link'

export default function RootLayout({ children }:{ children: React.ReactNode }){
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <header className="header">
            <div className="container py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-6">
                <Link href="/" className="text-lg font-semibold">GENUINE Pro</Link>
                <nav className="hidden sm:flex gap-4 text-sm">
                  <Link href="/dashboard">Dashboard</Link>
                  <Link href="/contacts">Contacts</Link>
                  <Link href="/resources">Resources</Link>
                  <Link href="/profile">Profile</Link>
                  <Link href="/account">Account</Link>
                </nav>
              </div>
              <div className="flex items-center gap-3">
                <SignedIn><UserButton /></SignedIn>
                <SignedOut><a className="btn" href="/sign-in">Sign in</a></SignedOut>
                <img src="/logo.png" alt="ARCH Impacts" className="h-8 w-auto" />
              </div>
            </div>
          </header>
          <main>{children}</main>
          <footer className="footer mt-10">
            <div className="container py-6 text-xs">
              ARCH Impacts | genuinerelationships.com • <a className="underline" href="/legal/privacy">Privacy</a> • <a className="underline" href="/legal/terms">Terms</a>
            </div>
          </footer>
        </ClerkProvider>
      </body>
    </html>
  )
}
