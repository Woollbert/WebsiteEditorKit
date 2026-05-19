import { NextRequest, NextResponse } from 'next/server';
import { Octokit } from '@octokit/rest';

// POST /api/save-page
// Body: { slug: string, data: PuckData }
//
// Commits the Puck JSON to src/content/pages/<slug>.json in the configured
// GitHub repo. The push triggers Vercel/Netlify rebuild → site is live in ~60s.
//
// Auth (MVP): shared secret header `x-editor-token`, checked against
// EDITOR_SHARED_TOKEN env var. The /admin/pages/[slug] page reads this token
// from a server-only env and injects it via a hidden form field or fetch
// header. Replace with proper JWT or session auth for multi-editor sites.

const SLUG_RE = /^[a-z0-9][a-z0-9-]{0,63}$/;

export async function POST(req: NextRequest) {
  // Auth check
  const token = req.headers.get('x-editor-token');
  const expected = process.env.EDITOR_SHARED_TOKEN;
  if (!expected) {
    return NextResponse.json(
      { error: 'Server misconfigured: EDITOR_SHARED_TOKEN env var is not set' },
      { status: 500 }
    );
  }
  if (!token || token !== expected) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // GitHub config
  const githubPat = process.env.GITHUB_PAT;
  const githubRepo = process.env.GITHUB_REPO;
  const githubBranch = process.env.GITHUB_BRANCH || 'main';
  if (!githubPat || !githubRepo) {
    return NextResponse.json(
      { error: 'Server misconfigured: GITHUB_PAT and GITHUB_REPO must be set' },
      { status: 500 }
    );
  }
  const [owner, repo] = githubRepo.split('/');
  if (!owner || !repo) {
    return NextResponse.json(
      { error: 'GITHUB_REPO must be formatted as "owner/repo"' },
      { status: 500 }
    );
  }

  // Parse + validate body
  let body: { slug?: string; data?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const { slug, data } = body;
  if (!slug || typeof slug !== 'string' || !SLUG_RE.test(slug)) {
    return NextResponse.json(
      { error: 'Invalid slug. Must match /^[a-z0-9][a-z0-9-]{0,63}$/' },
      { status: 400 }
    );
  }
  if (!data || typeof data !== 'object') {
    return NextResponse.json({ error: 'Missing or invalid `data` payload' }, { status: 400 });
  }

  // Commit to GitHub
  const octokit = new Octokit({ auth: githubPat });
  const path = `apps/reference-site/src/content/pages/${slug}.json`;
  const contentString = JSON.stringify(data, null, 2) + '\n';
  const contentB64 = Buffer.from(contentString, 'utf-8').toString('base64');

  // Get the current file SHA (required for update, undefined for create)
  let sha: string | undefined;
  try {
    const existing = await octokit.repos.getContent({ owner, repo, path, ref: githubBranch });
    if (!Array.isArray(existing.data) && existing.data.type === 'file') {
      sha = existing.data.sha;
    }
  } catch (e: any) {
    if (e.status !== 404) {
      return NextResponse.json(
        { error: `Failed to check existing file: ${e.message}` },
        { status: 502 }
      );
    }
    // 404 means new file — leave sha undefined
  }

  try {
    const commit = await octokit.repos.createOrUpdateFileContents({
      owner,
      repo,
      path,
      message: `Update page: ${slug}`,
      content: contentB64,
      branch: githubBranch,
      sha,
      committer: {
        name: 'Visual Editor',
        email: 'editor@example.com',
      },
    });
    return NextResponse.json({
      ok: true,
      slug,
      commitSha: commit.data.commit.sha,
      commitUrl: commit.data.commit.html_url,
    });
  } catch (e: any) {
    return NextResponse.json(
      { error: `GitHub commit failed: ${e.message}` },
      { status: 502 }
    );
  }
}
