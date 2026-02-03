import { Metadata } from 'next'; // Add this import
import "./globals.css";
import SessionWrapper from "./SessionWrapper";
import { ThemeProvider } from "./ThemeProvider";

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
    description:
      'Jam sessions, open mics, and bars where people hang out.',
  },
};



export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en" className="dark">
            <body className="antialiased min-h-screen bg-tone-5 text-tone-0">
                <ThemeProvider defaultTheme="dark">
                    <SessionWrapper>{children}</SessionWrapper>
                </ThemeProvider>
            </body>
        </html>
    );
}