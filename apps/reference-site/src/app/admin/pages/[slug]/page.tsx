import PuckEditor from '@/components/PuckEditor.client';
import { loadPage, emptyPage } from '@/lib/pages';

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = (await loadPage(slug)) ?? emptyPage();

  return (
    <div style={{ minHeight: '100vh' }}>
      <PuckEditor slug={slug} initialData={data} />
    </div>
  );
}
