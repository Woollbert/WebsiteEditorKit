import { notFound } from 'next/navigation';
import PuckRender from '@/components/PuckRender';
import { loadPage, listPageSlugs } from '@/lib/pages';

// Statically generate one route per src/content/pages/*.json on build.
// New pages added via Puck require a redeploy to appear — that's expected with
// static generation. For instant-publish behavior, switch to `force-dynamic` or
// add revalidation. See SETUP.md.
export async function generateStaticParams() {
  const slugs = await listPageSlugs();
  // Exclude "home" since that's served at /
  return slugs.filter((s) => s !== 'home').map((slug) => ({ slug }));
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await loadPage(slug);
  if (!data) notFound();
  return <PuckRender data={data} />;
}
