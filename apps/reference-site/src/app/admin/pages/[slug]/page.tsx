import PuckEditor from '@/components/PuckEditor.client';
import { loadPage, emptyPage } from '@/lib/pages';

export const dynamic = 'force-dynamic';

export default async function EditPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = (await loadPage(slug)) ?? emptyPage();

  // Read the shared editor token server-side and inject as a prop. The token
  // never appears in client source code — it only ships down with this rendered
  // response after the user has already authenticated to reach this route.
  // In production, gate this route behind DecapBridge auth or similar.
  const editorToken = process.env.EDITOR_SHARED_TOKEN ?? '';

  if (!editorToken) {
    return (
      <div style={{ padding: 40, fontFamily: 'system-ui' }}>
        <h1 style={{ marginBottom: 12 }}>Editor not configured</h1>
        <p>Set <code>EDITOR_SHARED_TOKEN</code> in your environment to enable the visual editor.</p>
        <p>See <code>.env.example</code> for the full list of required variables.</p>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh' }}>
      <PuckEditor slug={slug} initialData={data} editorToken={editorToken} />
    </div>
  );
}
