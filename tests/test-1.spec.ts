// import { test, expect } from '@playwright/test';

// test('test', async ({ page }) => {
//   await page.goto('http://localhost:3030/');
//   await expect(page.getByRole('button')).toMatchAriaSnapshot(`- button "Envoyer"`);
//   await page.getByPlaceholder('Tapez une lettre').click();
//   await page.getByPlaceholder('Tapez une lettre').click();
//   await expect(page.getByPlaceholder('Tapez une lettre')).toBeEmpty();
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByPlaceholder('Tapez une lettre').click();
//   await page.getByPlaceholder('Tapez une lettre').fill('q');
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByPlaceholder('Tapez une lettre').click();
//   await page.getByPlaceholder('Tapez une lettre').fill('v');
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByRole('button', { name: 'Envoyer' }).click();
//   await page.getByPlaceholder('Entrez votre pseudo').click();
//   await page.getByPlaceholder('Entrez votre pseudo').press('CapsLock');
//   await page.getByPlaceholder('Entrez votre pseudo').fill('S');
//   await page.getByPlaceholder('Entrez votre pseudo').press('CapsLock');
//   await page.getByPlaceholder('Entrez votre pseudo').fill('Shugo');
//   await page.getByPlaceholder('Entrez votre pseudo').press('Enter');
//   await page.getByRole('button', { name: 'Enregistrer le score' }).click();
//   await page.getByRole('button', { name: 'Partager' }).click();
// });