import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'MazdoorPing - Employer Portal',
  description: 'Find and hire skilled daily wage workers in Pakistan. Post jobs, browse workers, and manage your workforce.',
};

export const viewport: Viewport = {
  themeColor: '#2563EB',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.variable} min-h-screen bg-gray-50 text-foreground antialiased`}>
        {children}
      </body>
    </html>
  );
}
