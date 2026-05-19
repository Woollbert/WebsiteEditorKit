import { test, expect } from '@playwright/test';

// The home page renders src/content/pages/home.json through PuckRender.
// home.json contains a Hero, FeatureGrid, Testimonial, and CTABand —
// this test asserts each one's distinctive copy is visible.

test.describe('Public home page (Puck-rendered)', () => {
  test('renders the Hero block heading and CTA', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Welcome to Example Co.' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Edit this page' })).toBeVisible();
  });

  test('renders the FeatureGrid section with 3 features', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'Reference Blocks' })).toBeVisible();
    await expect(page.getByText('Visual Editing')).toBeVisible();
    await expect(page.getByText('Git-Backed')).toBeVisible();
    await expect(page.getByText('Free Forever')).toBeVisible();
  });

  test('renders the Testimonial banner', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByText(/replaced our \$49\/mo SaaS editor/)).toBeVisible();
  });

  test('renders the CTABand at the bottom', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'See it for yourself' })).toBeVisible();
    await expect(page.getByRole('link', { name: 'Open editor' })).toBeVisible();
  });

  test('shows the floating "Edit in Puck" link', async ({ page }) => {
    await page.goto('/');
    await expect(page.getByRole('link', { name: /Edit in Puck/ })).toBeVisible();
  });
});
