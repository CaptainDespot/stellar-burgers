import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page, context }) => {
  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false
  });
  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user',
    update: false
  });
  await page.routeFromHAR('tests/hars/order.har', {
    url: '**/api/orders',
    update: false
  });

  await page.addInitScript(() => {
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.test',
      url: 'http://localhost:4000'
    }
  ]);

  await page.goto('/');
});

test('открыть модальное окно с ингредиентом', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').click();

  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  const modal = page.getByTestId('modal');
  await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();
  await expect(modal.getByText('420')).toBeVisible(); // calories
  await expect(modal.getByText('80')).toBeVisible(); // proteins
  await expect(modal.getByText('24')).toBeVisible(); // fat
  await expect(modal.getByText('53')).toBeVisible(); // carbohydrates
});

test('закрыть модальное окно через кнопку', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').click();

  await expect(page.getByTestId('modal')).toBeVisible();

  await page.getByTestId('modal-close').click();

  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('закрыть модальное окно через оверлей', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').click();

  await page.getByTestId('modal-overlay').click({
    position: { x: 5, y: 5 }
  });

  await expect(page.getByTestId('modal')).not.toBeVisible();
});

test('добавить ингредиент в конструктор', async ({ page }) => {
  await page
    .getByTestId('add-bun-id')
    .getByRole('button', { name: 'Добавить' })
    .click();
  await page
    .getByTestId('add-main-id')
    .getByRole('button', { name: 'Добавить' })
    .click();

  const constructor = page.getByTestId('burger-constructor');

  await expect(
    constructor.getByText('Краторная булка N-200i (верх)')
  ).toBeVisible();
  await expect(
    constructor.getByText('Биокотлета из марсианской Магнолии')
  ).toBeVisible();
});

test('сделать заказ', async ({ page }) => {
  await page
    .getByTestId('add-bun-id')
    .getByRole('button', { name: 'Добавить' })
    .click();
  await page
    .getByTestId('add-main-id')
    .getByRole('button', { name: 'Добавить' })
    .click();

  await page.getByTestId('order-button').click();

  const modal = page.getByTestId('modal');

  await expect(modal.getByText('12345')).toBeVisible();
  await expect(modal.getByText('идентификатор заказа')).toBeVisible();

  await page.getByTestId('modal-close').click();

  await expect(page.getByTestId('constructor-bun-empty')).toBeVisible();
  await expect(page.getByTestId('constructor-main-empty')).toBeVisible();
});