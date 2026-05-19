import { notFound } from 'next/navigation';
import Link from 'next/link';
import PuckRender from '@/components/PuckRender';
import { loadPage } from '@/lib/pages';

export default async function HomePage() {
  const data = await loadPage('home');
  if (!data) notFound();

  return (
    <>
      <PuckRender data={data} />
      <div
        style={{
          position: 'fixed',
          bottom: 14,
          right: 14,
          fontSize: 13,
          background: 'var(--color-ink)',
          color: 'var(--color-cream)',
          padding: '6px 12px',
          borderRadius: 6,
          opacity: 0.9,
          zIndex: 50,
        }}
      >
        <Link href="/admin/pages/home" style={{ color: 'inherit', textDecoration: 'none' }}>
          ✎ Edit in Puck
        </Link>
      </div>
    </>
  );
}
