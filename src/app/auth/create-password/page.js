import CreatePasswordClientPage from './create-password-client'; // Component from the renamed page.jsx

export const metadata = {
  title: 'Create New Password - Venturloop',
  description: 'Set up a new password for your Venturloop account. Ensure your account is secure with a strong password.',
  keywords: ['Venturloop', 'Create Password', 'New Password', 'Account Security', 'Startup'],
  alternates: {
    canonical: '/auth/create-password',
  },
  openGraph: {
    title: 'Create New Password - Venturloop',
    description: 'Secure your Venturloop account by creating a new password.',
    url: 'https://auth.venturloop.com/auth/create-password',
    type: 'website',
    images: [
      {
        url: 'https://auth.venturloop.com/image/appView.png', // Replace/confirm with a relevant image
        width: 1200,
        height: 630,
        alt: 'Venturloop Create Password Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Create New Password - Venturloop',
    description: 'Secure your Venturloop account by creating a new password.',
    images: ['https://auth.venturloop.com/image/appView.png'], // Replace/confirm with a relevant image
  },
};

const CreatePasswordPageContainer = () => {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://auth.venturloop.com/auth/create-password',
    name: 'Venturloop Create Password',
    description: 'Set a new password for your Venturloop account.',
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
      <CreatePasswordClientPage />
    </>
  );
};

export default CreatePasswordPageContainer;
