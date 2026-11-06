import type { Metadata } from 'next';
import { Fredoka, Nunito } from 'next/font/google';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import ToastContainer from '@/components/ui/ToastContainer';

const fredoka = Fredoka({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-fredoka',
  display: 'swap',
});

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800'],
  variable: '--font-nunito',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FLASH&FIT — High-Concurrency D2C Streetwear Flash Drops',
  description:
    'Experience zero-oversell 10-minute atomic stock locks, interactive 3D volumetric fit biometrics, Local Vault 24h express returns, and simulated live payments.',
  keywords: ['streetwear', 'flash drop', '3d fit studio', 'local vault', 'zero oversell', 'cyberpunk'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${fredoka.variable} ${nunito.variable} dark`}>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className="bg-carbon text-creamText min-h-screen selection:bg-neonAcid selection:text-black antialiased cyber-grid">
        <AppProvider>
          {children}
          <ToastContainer />
        </AppProvider>
      </body>
    </html>
  );
}

