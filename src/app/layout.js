import { Geist, Geist_Mono } from 'next/font/google';
import PropTypes from 'prop-types'; // Added for prop validation
import './globals.css';
import Providers from '@/components/Providers'; // Corrected import path

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
    default: 'Venturloop Auth Portal', // Default title
    template: '%s | Venturloop Auth', // Template for page-specific titles
  },
  description:
    'Secure and seamless authentication for Venturloop applications. Sign in or create an account to continue.', // Slightly more detailed description
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico', // Assuming favicon.ico is in public folder
  },
  // Add more metadata as needed: openGraph, twitter, etc.
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

RootLayout.propTypes = {
  children: PropTypes.node.isRequired,
};
