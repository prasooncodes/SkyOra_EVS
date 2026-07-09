import { test, expect } from '@playwright/test';

test('homepage loads successfully', async ({ page }) => {
  await page.goto('/');
  await expect(page).toHaveTitle(/SkyOraFrontend|SkyOra/);
  await expect(page.locator('body')).toContainText('SkyOra');
});

test('login page is reachable and shows login heading', async ({ page }) => {
  await page.goto('/login');
  await expect(page.locator('h1')).toContainText('Welcome back to SkyOra');
});
