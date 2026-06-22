import { test, expect } from '@playwright/test';
import mockIngredients from '../src/utils/ingredients-mock.json';

test.beforeEach(async ({ page }) => {
  await page.route('**/api/ingredients', async (route) => {
    await route.fulfill({
      status: 200,
      json: mockIngredients,
    });
  });

  await page.goto('http://localhost:4000/');
});

test('открыть модальное окно с ингредиентом', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();
  await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();
});

test('закрыть модальное окно через кнопку', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();
  await page.locator('button svg').first().click({ force: true });
  await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
});

test('закрыть модальное окно через оверлей', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();
  await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 } });
  await expect(page.getByText('Детали ингредиента')).not.toBeVisible();
});

test('добавить ингредиент в constructor', async ({ page }) => {
  await page.locator('li').filter({ hasText: /Краторная булка/ }).locator('button').click({ force: true });
  await page.locator('li').filter({ hasText: /Биокотлета/ }).locator('button').click({ force: true });

  const constructorZone = page.getByTestId('burger-constructor');
  await expect(constructorZone.getByText(/Краторная булка/).first()).toBeVisible();
  await expect(constructorZone.getByText(/Биокотлета/).first()).toBeVisible();
});

test('сделать заказ', async ({ page, context }) => {
  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      json: { success: true, user: { email: 'test@test.ru', name: 'Tester' } }
    });
  });

  await page.route('**/api/orders', async (route) => {
    await route.fulfill({
      status: 200,
      json: { success: true, name: 'Тестовый бургер', order: { number: 12345 } }
    });
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer test-token',
      url: 'http://localhost:4000/',
    }
  ]);
  await page.evaluate(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  // Перезагружаем страницу, чтобы React "увидел" куки и localStorage
  await page.reload();

  // Собираем бургер
  await page.locator('li').filter({ hasText: /Краторная булка/ }).locator('button').click({ force: true });
  await page.locator('li').filter({ hasText: /Биокотлета/ }).locator('button').click({ force: true });

  // Оформляем заказ
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  // Проверяем модалку
  await expect(page.getByText('12345')).toBeVisible();
  await page.locator('button svg').first().click({ force: true });

  // Проверяем очистку конструктора
  await expect(page.getByText('Выберите булки').first()).toBeVisible();
  await expect(page.getByText('Выберите начинку').first()).toBeVisible();

  await context.clearCookies();
  await page.evaluate(() => {
    localStorage.clear();
  });
});