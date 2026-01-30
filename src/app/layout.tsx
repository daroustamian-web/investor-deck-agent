import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Investor Deck Generator | Professional Real Estate Pitch Decks',
  description:
    'Create professional investor decks for real estate development projects. AI-powered pitch deck generator with custom branding.',
  keywords: ['investor deck', 'pitch deck', 'real estate', 'capital raise', 'LP', 'syndication'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  );
}
