import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Steppe Pinnacle – Luxury Automotive Marketing System for Mongolia',
  description: 'Strategic 30-day marketing framework for BYD, Jetour, and Changan in Mongolia.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
