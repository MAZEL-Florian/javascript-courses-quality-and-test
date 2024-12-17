// @ts-check
const { test, expect } = require('@playwright/test');

test('has title', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  await expect(page).toHaveTitle(/The Hangman game/);
});

test('can type letter into input field', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  const input = page.locator('input[name="word"]');

  await expect(input).not.toBeDisabled();

  await input.fill('P');

  await expect(input).toHaveValue('P');

  await page.evaluate(() => {
    const input = document.querySelector('input[name="word"]');
    if (input) {
      input.setAttribute('disabled', 'true');
    } else {
      console.error('Input element not found!');
    }
  });
  await expect(input).toBeDisabled();
});
test('displays the rules of the game', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  const rules = page.locator('.score-container h3');
  await expect(rules).toHaveText('📜 Règles du jeu 📜');

  const ruleItems = page.locator('.score-container ul li');
  await expect(ruleItems).toHaveCount(7);
});

test('starts with 5 tries and 1000 points', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  const numberOfTries = page.locator('legend:has-text("Nombre d\'essais restant")');
  const score = page.locator('#score');

  await expect(numberOfTries).toContainText('Nombre d\'essais restant : 5');
  await expect(score).toHaveText('1000');
});

test('updates the word display when a correct letter is guessed', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  const input = page.locator('input[name="word"]');
  const form = page.locator('form');

  await input.fill('e');
  await form.press('Enter');

  const guessedWord = page.locator('h3:has-text("Votre mot :")');
  await expect(guessedWord).not.toHaveText(/####/);
});

test('reduces the number of tries on a wrong guess', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  const input = page.locator('input[name="word"]');
  const form = page.locator('form');

  const numberOfTries = page.locator('legend:has-text("Nombre d\'essais restant")');
  await input.fill('z');
  await form.press('Enter');

  await expect(numberOfTries).toContainText('Nombre d\'essais restant : 4');
});

test('shows winning message when the word is guessed', async ({ page }) => {
  await page.goto('http://localhost:3030/');

  const input = page.locator('input[name="word"]');
  const form = page.locator('form');

  const guessedWord = page.locator('h3:has-text("Votre mot :")');
  const word = await guessedWord.innerText();

  for (const letter of word.replace('Votre mot : ', '')) {
    await input.fill(letter);
    await form.press('Enter');
  }

  const winningMessage = page.locator('.uk-alert-success');
  await expect(winningMessage).toContainText('🎉 Félicitations ! 🎉');
});

test('checks Node.js version', async () => {
  const expectedVersion = '18.12.1';
  
  const actualVersion = process.version.replace('v', '');
  console.log(`Current Node.js version: ${actualVersion}`);

  expect(actualVersion).toBe(expectedVersion);
});