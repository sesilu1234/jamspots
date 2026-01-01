import './globals.css';
import SessionWrapper from './SessionWrapper';
import { ThemeProvider } from './ThemeProvider';

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
