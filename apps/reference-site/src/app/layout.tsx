import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Reference Site — Next.js + Sveltia + Puck Kit',
  description:
    'Working demo of the visual editing kit. A small-business site whose owner can edit content (via Sveltia) and rearrange layouts (via Puck) without touching code.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
