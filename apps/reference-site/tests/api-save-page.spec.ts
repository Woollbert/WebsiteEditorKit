import { test, expect } from '@playwright/test';

// Tests for POST /api/save-page — focused on validation and auth, NOT the
// actual GitHub round-trip. The route will attempt the GitHub call when
// auth passes; we expect a 502 (GitHub PAT is bogus in test env) rather
// than a 200, because we don't want tests to hit real GitHub.

const TOKEN = 'test-secret-token-not-for-production'; // matches playwright.config.ts webServer.env

test.describe('POST /api/save-page', () => {
  test('rejects request without x-editor-token (401)', async ({ request }) => {
    const res = await request.post('/api/save-page', {
      data: { slug: 'home', data: { content: [], root: { props: {} } } },
    });
    expect(res.status()).toBe(401);
    const body = await res.json();
    expect(body.error).toBe('Unauthorized');
  });

  test('rejects request with wrong token (401)', async ({ request }) => {
    const res = await request.post('/api/save-page', {
      headers: { 'x-editor-token': 'wrong-token' },
      data: { slug: 'home', data: { content: [], root: { props: {} } } },
    });
    expect(res.status()).toBe(401);
  });

  test('rejects invalid slug (400)', async ({ request }) => {
    const res = await request.post('/api/save-page', {
      headers: { 'x-editor-token': TOKEN },
      data: { slug: '../../../etc/passwd', data: {} },
    });
    expect(res.status()).toBe(400);
    const body = await res.json();
    expect(body.error).toMatch(/Invalid slug/);
  });

  test('rejects slug with uppercase (400)', async ({ request }) => {
    const res = await request.post('/api/save-page', {
      headers: { 'x-editor-token': TOKEN },
      data: { slug: 'HomePage', data: {} },
    });
    expect(res.status()).toBe(400);
  });

  test('rejects missing data payload (400)', async ({ request }) => {
    const res = await request.post('/api/save-page', {
      headers: { 'x-editor-token': TOKEN },
      data: { slug: 'home' },
    });
    expect(res.status()).toBe(400);
  });

  test('rejects malformed JSON body (400)', async ({ request }) => {
    const res = await request.post('/api/save-page', {
      headers: { 'x-editor-token': TOKEN, 'Content-Type': 'application/json' },
      data: 'not-json-{',
    });
    expect(res.status()).toBe(400);
  });

  test('passes auth and validation, fails at GitHub call (502)', async ({ request }) => {
    // With a valid token + valid payload, the route reaches the GitHub call.
    // The test env has a bogus GITHUB_PAT, so we expect 502 with a clear error.
    // This confirms the auth + validation logic is correct AND the GitHub call
    // path is wired up (just not authorized to actually commit).
    const res = await request.post('/api/save-page', {
      headers: { 'x-editor-token': TOKEN },
      data: {
        slug: 'test-page',
        data: { content: [], root: { props: {} } },
      },
    });
    expect(res.status()).toBe(502);
    const body = await res.json();
    expect(body.error).toMatch(/GitHub|commit|check existing/i);
  });
});
