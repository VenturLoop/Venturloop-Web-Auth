import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Providers from '@/components/Providers';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

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
  viewport: 'width=device-width, initial-scale=1',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen`}
      >
        <Navbar />

        <Providers>
          <main className="flex-1 w-full">
            {children}
          </main>
          <SpeedInsights />
        </Providers>

        <Footer />
      </body>
    </html>
  );
}
