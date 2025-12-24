import { Geist, Geist_Mono } from 'next/font/google'
import { Oswald, Inter } from 'next/font/google'
import './globals.css'
import SessionWrapper from './SessionWrapper'


const oswald = Oswald({ subsets: ['latin'], weight: ['400','700'] })
const inter = Inter({ subsets: ['latin'], weight: ['400','700'] })
const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
import { Bebas_Neue } from 'next/font/google'

const bebas = Bebas_Neue({ subsets: ['latin'], weight: ['400'] })


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`dark ${oswald.className}`}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen bg-tone-5 text-tone-0`}
      >
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  )
}
