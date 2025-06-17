import LoginForm from './login-form'; // Assuming the client component will be renamed

export const metadata = {
  title: 'Login to Venturloop',
  description: 'Access your Venturloop account. Login with your credentials or use social login options for a seamless experience.',
  keywords: ['Venturloop', 'Login', 'Authentication', 'Account Access', 'Startup', 'Co-founder'],
  alternates: {
    canonical: '/login',
  },
  openGraph: {
    title: 'Login to Venturloop',
    description: 'Access your Venturloop account. Secure and easy login process.',
    url: 'https://auth.venturloop.com/login',
    type: 'website',
    images: [
      {
        url: 'https://auth.venturloop.com/image/appView.png', // Replace with a relevant image for login page
        width: 1200,
        height: 630,
        alt: 'Venturloop Login Page',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Login to Venturloop',
    description: 'Access your Venturloop account. Secure and easy login process.',
    images: ['https://auth.venturloop.com/image/appView.png'], // Replace with a relevant image for login page
  },
};

const LoginPage = () => {
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    url: 'https://auth.venturloop.com/login',
    name: 'Venturloop Login',
    description: 'Login to your Venturloop account.',
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
      <LoginForm />
    </>
  );
};

export default LoginPage;
