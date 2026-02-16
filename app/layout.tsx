import { Metadata } from 'next'; // Add this import
import './globals.css';
import SessionWrapper from './SessionWrapper';
import { ThemeProvider } from './ThemeProvider';
import { getServerSession } from "next-auth"; // Add this
import { authOptions } from "@/app/api/auth/[...nextauth]/route"; // P

// ADD THIS BLOCK
export const metadata: Metadata = {
  metadataBase: new URL('https://jamspots.xyz'),
  title: {
    default: 'Jamspots',
    template: '%s | Jamspots',
  },
  description:
    'Discover local jam sessions and open mics. Play, watch, hang out, or just meet people.',
  openGraph: {
    title: 'Jamspots',
    description:
      'Find jam sessions and open mics. Play, watch, or just hang out.',
    url: 'https://jamspots.xyz',
    siteName: 'Jamspots',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Jamspots',
    description: 'Jam sessions, open mics, and bars where people hang out.',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className="dark">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="antialiased min-h-screen bg-tone-5 text-tone-0">
        <ThemeProvider defaultTheme="dark">
          <SessionWrapper session={session}>{children}</SessionWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
