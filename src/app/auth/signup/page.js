import SignUpForm from './signup-form'; // Assuming the client component will be renamed

export const metadata = {
  title: 'Sign Up for Venturloop',
  description: 'Create your Venturloop account to connect with co-founders, investors, and build your startup. Join our community today!',
  keywords: ['Venturloop', 'Sign Up', 'Create Account', 'Startup', 'Co-founder', 'Investor', 'Join'],
  alternates: {
    canonical: '/auth/signup',
  },
  openGraph: {
    title: 'Sign Up for Venturloop',
    description: 'Join Venturloop and start your entrepreneurial journey. Connect with like-minded individuals.',
    url: 'https://auth.venturloop.com/auth/signup',
    type: 'website',
    images: [
      {
        url: 'https://auth.venturloop.com/image/Cofounder_splash_screen.png', // Replace/confirm with a relevant image
        width: 1200,
        height: 630,
        alt: 'Venturloop Signup Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Sign Up for Venturloop',
    description: 'Join Venturloop and start your entrepreneurial journey. Connect with like-minded individuals.',
    images: ['https://auth.venturloop.com/image/Cofounder_splash_screen.png'], // Replace/confirm with a relevant image
  },
};

const SignupPageContainer = () => {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://auth.venturloop.com/auth/signup',
    name: 'Venturloop Signup',
    description: 'Create your Venturloop account.',
    isPartOf: {
      '@type': 'WebSite',
      url: 'https://auth.venturloop.com',
      name: 'Venturloop Auth',
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        key="webpage-jsonld"
      />
      <SignUpForm />
    </>
  );
};

export default SignupPageContainer;
