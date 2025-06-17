import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Geist, Geist_Mono } from 'next/font/google';
import PropTypes from 'prop-types';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/react';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { trackEvent } from '@/utils/analytics';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: {
    default: 'Venturloop Auth Portal',
    template: '%s | Venturloop Auth',
  },
  description:
    'Secure and seamless authentication for Venturloop applications. Sign in or create an account to continue.',
  // viewport removed from here
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'snd-I258bhB6IOfksIhOgqUy-8AiQJU4hS2J5TnvXIE',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  const path = usePathname();

  useEffect(() => {
    trackEvent('ScreenVisit', { path });
  }, [path]);

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}
      >
        <Navbar />

        <Providers>
          <main className="flex-1 w-full">{children}</main>
          <SpeedInsights />
          <Analytics />
        </Providers>

        <Footer />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
