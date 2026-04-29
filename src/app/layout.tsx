import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'MazdoorPing - Employer App',
  description: 'Find and hire skilled daily wage workers in Pakistan. Post jobs, browse workers, and manage your workforce.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-white text-gray-900 antialiased">
        {children}
      </body>
    </html>
  );
}
