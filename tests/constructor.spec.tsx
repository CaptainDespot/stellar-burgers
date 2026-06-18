import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  await page.goto('http://localhost:4000/');
});

test('открыть модальное окно с ингредиентом', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();
  
  await expect(page.getByText('Детали ингредиента')).toBeVisible();
  await expect(page.getByText('Краторная булка N-200i').last()).toBeVisible();
  
  await expect(page.getByText('420').last()).toBeVisible();
  await expect(page.getByText('80').last()).toBeVisible();
  await expect(page.getByText('24').last()).toBeVisible();
  await expect(page.getByText('53').last()).toBeVisible();
});

test('закрыть модальное окно через кнопку', async ({ page }) => {
  await page.getByText('Краторная булка N-200i').first().click();
  await expect(page.getByText('Детали ингредиента')).toBeVisible();

  const closeButton = page.locator('button svg').first();
  await closeButton.click({ force: true });

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
  
  // Добавляем .first(), чтобы Playwright не ругался на две булки (верх и низ)
  await expect(constructorZone.getByText(/Краторная булка/).first()).toBeVisible();
  await expect(constructorZone.getByText(/Биокотлета/).first()).toBeVisible();
});

test('сделать заказ', async ({ page }) => {
  // 1. Подкидываем фейковые токены в localStorage
  await page.evaluate(() => {
    localStorage.setItem('accessToken', 'Bearer test-token');
    localStorage.setItem('refreshToken', 'test-refresh-token');
  });

  // 2. Перехватываем запрос проверки пользователя, чтобы бэкенд не сбросил наши токены
  await page.route('**/api/auth/user', async route => {
    await route.fulfill({
      status: 200,
      json: { success: true, user: { email: 'test@test.ru', name: 'Tester' } }
    });
  });

  // 3. Перехватываем запрос на создание заказа и принудительно возвращаем номер 12345
  await page.route('**/api/orders', async route => {
    await route.fulfill({
      status: 200,
      json: { success: true, name: 'Тестовый бургер', order: { number: 12345 } }
    });
  });

  // Перезагружаем страницу, чтобы React-приложение подхватило наши фейковые токены и "залогинило" робота
  await page.reload();

  // 4. Собираем бургер (нашими проверенными локаторами)
  await page.locator('li').filter({ hasText: /Краторная булка/ }).locator('button').click({ force: true });
  await page.locator('li').filter({ hasText: /Биокотлета/ }).locator('button').click({ force: true });

  // 5. Оформляем заказ
  await page.getByRole('button', { name: 'Оформить заказ' }).click();

  // 6. Проверяем появление заветного номера заказа в модалке!
  await expect(page.getByText('12345')).toBeVisible();

  // Закрываем модалку заказа через крестик
  await page.locator('button svg').first().click({ force: true });
// Проверяем, что конструктор успешно очистился
  // Проверяем, что конструктор успешно очистился
  await expect(page.getByText('Выберите булки').first()).toBeVisible();
  await expect(page.getByText('Выберите начинку').first()).toBeVisible();
});