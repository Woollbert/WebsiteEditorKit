import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16 max-w-3xl mx-auto">
      <header className="mb-12">
        <h1 className="text-4xl font-semibold mb-2" style={{ fontFamily: 'var(--font-display)' }}>
          Reference Site
        </h1>
        <p className="text-lg" style={{ color: 'var(--color-ink-soft)' }}>
          Demo of the Next.js + Sveltia + Puck visual editing kit.
        </p>
      </header>

      <section className="space-y-6">
        <p>
          This is a deliberately plain Next.js site. Its only purpose is to host the editor
          stack so you can see how a non-technical owner would edit content.
        </p>

        <div className="grid sm:grid-cols-2 gap-4 pt-4">
          <Link
            href="/admin/"
            className="block p-5 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: 'var(--color-line)' }}
          >
            <h2 className="font-semibold text-lg mb-1">📝 /admin/</h2>
            <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
              Sveltia CMS — edit structured content (services, hours, team) via forms.
            </p>
          </Link>

          <Link
            href="/admin/pages/home"
            className="block p-5 rounded-lg border transition-colors hover:bg-white"
            style={{ borderColor: 'var(--color-line)' }}
          >
            <h2 className="font-semibold text-lg mb-1">🎨 /admin/pages/home</h2>
            <p className="text-sm" style={{ color: 'var(--color-ink-soft)' }}>
              Puck visual editor — drag blocks, edit copy, reorder sections.
            </p>
          </Link>
        </div>

        <div className="pt-8 text-sm" style={{ color: 'var(--color-ink-soft)' }}>
          <p className="mb-2"><strong>Phase status:</strong></p>
          <ul className="space-y-1 list-disc list-inside">
            <li>✅ Phase 2 — Next.js skeleton + Tailwind</li>
            <li>🚧 Phase 3 — Sveltia CMS mount (in progress)</li>
            <li>⏳ Phase 4 — Puck editor + block library</li>
            <li>⏳ Phase 5 — Save pipeline (GitHub Contents API)</li>
            <li>⏳ Phase 6 — SETUP guide + Aviara port</li>
          </ul>
        </div>
      </section>
    </main>
  );
}
