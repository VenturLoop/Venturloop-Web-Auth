import { Geist, Geist_Mono } from 'next/font/google';
import PropTypes from 'prop-types';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
// No need to import Head from 'next/head' in App Router

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  metadataBase: new URL('https://auth.venturloop.com'),
  title: {
    default: 'Venturloop Auth Portal',
    template: '%s | Venturloop Auth',
  },
  description:
    'Secure and seamless authentication for Venturloop applications. Sign in or create an account to continue.',
  icons: {
    icon: '/favicon.ico',
  },
  verification: {
    google: 'snd-I258bhB6IOfksIhOgqUy-8AiQJU4hS2J5TnvXIE',
  },
  openGraph: {
    type: 'website',
    siteName: 'Venturloop',
    title: 'Venturloop Auth Portal',
    description: 'Secure and seamless authentication for Venturloop applications.',
    url: 'https://auth.venturloop.com',
    images: [
      {
        url: 'https://auth.venturloop.com/image/appLogoT.png', // Replace with actual generic logo/image URL
        width: 1200,
        height: 630,
        alt: 'Venturloop',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@Venturloop', // Replace with actual Twitter handle if available
    title: 'Venturloop Auth Portal',
    description: 'Secure and seamless authentication for Venturloop applications.',
    images: ['https://auth.venturloop.com/image/appLogoT.png'], // Replace with actual generic logo/image URL
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Venturloop',
    url: 'https://auth.venturloop.com',
    logo: 'https://auth.venturloop.com/image/appLogoT.png', // Replace with actual logo URL
  };

  return (
    <html lang="en">
      <head>
        <link rel="canonical" href="https://auth.venturloop.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen overflow-x-hidden`}
      >
        <Navbar />
        <Providers>
          <main className="flex-1 w-full">{children}</main>
          <SpeedInsights />
        </Providers>
        <Footer />
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
