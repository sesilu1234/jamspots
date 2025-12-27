import { Geist, Geist_Mono } from 'next/font/google';
import { Oswald, Inter, Space_Grotesk } from 'next/font/google';
import './globals.css';
import SessionWrapper from './SessionWrapper';

const oswald = Oswald({ subsets: ['latin'], weight: ['400', '700'] });

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${oswald.className}`}>
      <body className={`antialiased min-h-screen bg-tone-5 text-tone-0`}>
        <SessionWrapper>{children}</SessionWrapper>
      </body>
    </html>
  );
}
