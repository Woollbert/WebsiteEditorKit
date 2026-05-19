import { test, expect } from '@playwright/test';

// These tests verify the admin surfaces load. They do NOT exercise the full
// editing flow (drag, save, commit) — that would require real GitHub creds
// and a DecapBridge UUID. See the README for the manual end-to-end checklist.

test.describe('/admin/ Sveltia CMS mount', () => {
  test('Sveltia HTML loads with the script tag', async ({ page }) => {
    const response = await page.goto('/admin/index.html');
    expect(response?.status()).toBe(200);
    const html = await page.content();
    expect(html).toContain('sveltia-cms.js');
    expect(html).toContain('id="loading"');
  });

  test('config.yml is served', async ({ page }) => {
    const response = await page.goto('/admin/config.yml');
    expect(response?.status()).toBe(200);
    const body = await response?.text();
    expect(body).toContain('collections:');
    expect(body).toContain('backend:');
  });
});

test.describe('/admin/pages/[slug] Puck editor mount', () => {
  test('editor route mounts when EDITOR_SHARED_TOKEN is set', async ({ page }) => {
    await page.goto('/admin/pages/home');
    // Puck renders an editor toolbar — look for one of its stable text bits.
    // The actual Puck UI element selectors are version-dependent; this just
    // confirms the page loaded without the "Editor not configured" fallback.
    await expect(page.locator('text=Editor not configured')).toHaveCount(0);
    // The PuckEditor.client wrapper mounts within ~3s; the Puck toolbar appears.
    await page.waitForLoadState('networkidle');
  });

  test('shows the "not configured" fallback when no shared token exists', async ({ page }) => {
    // Note: this test can't truly run without spawning a separate server with
    // a different env. Documenting the expected behavior here for review.
    // The fallback message is rendered server-side; we'd need to either:
    //   (a) start a second Next dev process with EDITOR_SHARED_TOKEN unset, or
    //   (b) refactor the page to read the token at request time via cookies
    // Skipping for v0.1; tracked in SPEC.md §8 open questions.
    test.skip();
  });
});
