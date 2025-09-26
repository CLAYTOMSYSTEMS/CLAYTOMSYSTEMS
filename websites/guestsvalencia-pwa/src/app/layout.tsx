import type { Metadata } from 'next';
import '../../styles/globals.css';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FABSandra from '@/components/FABSandra';

export const metadata: Metadata = {
  title: 'GuestsValencia PWA Pro+ | Sandra IA',
  description: 'Alojamientos premium en Valencia con Sandra IA Pro+, 5 chatbots especializados y dashboards avanzados.',
  manifest: '/manifest.json',
  themeColor: '#0ea5e9',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'GuestsValencia PWA',
  },
  openGraph: {
    title: 'GuestsValencia PWA Pro+ | Sandra IA',
    description: 'Experiencia premium con 5 chatbots especializados y tecnología avanzada',
    type: 'website',
    locale: 'es_ES',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'GuestsValencia PWA Pro+',
    description: 'Alojamientos con Sandra IA y tecnología avanzada',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className="h-full">
      <head>
        <link rel="icon" href="/favicon.ico" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="min-h-full flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
        <FABSandra />
      </body>
    </html>
  );
}