import ObsProvider from '@/providers/obs_provider'
import { Rubik } from 'next/font/google'
import '@/app/globals.css'
import { Metadata } from 'next'

const rubik = Rubik({
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'OBS agent - QikStream',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={rubik.className}>
      <body className="container mx-auto text-sm px-4">
        <ObsProvider>{children}</ObsProvider>
      </body>
    </html>
  )
}
