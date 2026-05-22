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
  title: 'Cyber Attack Visualizer',
  description: 'Pelajari mekanisme serangan siber secara interaktif step-by-step',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body className={`${jetbrainsMono.variable} ${orbitron.variable}`}>{children}</body>
    </html>
  );
}
