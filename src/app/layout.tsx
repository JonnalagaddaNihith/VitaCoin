import type { Metadata } from 'next';
import './globals.css';
import { AuthProvider } from '@/context/AuthContext';
import { Toaster } from '@/components/ui/toaster';

export const metadata: Metadata = {
  title: 'VitaDash - Earn Coins Through Learning',
  description: 'Join VitaDash and earn coins by completing quizzes, maintaining streaks, and climbing the leaderboard. Test your knowledge in Mathematics, Aptitude, Grammar, and Programming.',
  keywords: 'VitaDash, quiz app, earn coins, learning platform, mathematics, aptitude, grammar, programming, education',
  authors: [{ name: 'VitaDash Team' }],
  creator: 'VitaDash',
  publisher: 'VitaDash',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: 'VitaDash - Earn Coins Through Learning',
    description: 'Join VitaDash and earn coins by completing quizzes, maintaining streaks, and climbing the leaderboard.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VitaDash - Earn Coins Through Learning',
    description: 'Join VitaDash and earn coins by completing quizzes, maintaining streaks, and climbing the leaderboard.',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#F0B90B" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="VitaDash" />
      </head>
      <body className="antialiased">
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}
