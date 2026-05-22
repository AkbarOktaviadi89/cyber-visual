import type { Metadata } from 'next';
import { JetBrains_Mono, Orbitron } from 'next/font/google';
import './globals.css';

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

const orbitron = Orbitron({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-orbitron',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'CyberThreat Lab',
  description: 'Platform visualisasi serangan siber interaktif — pelajari 40+ teknik serangan step-by-step',
  icons: {
    icon: [
      { url: '/icon.svg', type: 'image/svg+xml' },
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
    ],
    shortcut: '/icon.svg',
    apple: '/icon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jetbrainsMono.variable} ${orbitron.variable}`}>{children}</body>
    </html>
  );
}
