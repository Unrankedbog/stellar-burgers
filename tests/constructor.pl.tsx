import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4000';

const BUN_ID = '6acd6b8163765e371c0bd9eb';
const BUN_NAME = 'Краторная булка N-200i';

test.describe('Тестирование страницы конструктора бургера и модальных окон', function () {
  test.beforeEach(async ({ page }) => {

    await page.routeFromHAR('tests/hars/api-mock.har', {
      url: '**/api/**',
      update: false,
    });

    await page.goto(BASE_URL);
  });

  test('Добавление ингредиента из списка в конструктор бургера', async ({ page }) => {
    const bunCard = page.getByTestId(`ingredient-card-${BUN_ID}`);
    await bunCard.locator('button', { hasText: 'Добавить' }).click();

    const constructorSection = page.getByTestId('burger-constructor');
    await expect(constructorSection.locator(`text=${BUN_NAME}`)).toHaveCount(2);
  });

  test('Открытие и закрытие модального окна с описанием ингредиента', async ({
    page,
  }) => {
    await page.getByTestId(`ingredient-card-${BUN_ID}`).locator('a').click();

    const modalContainer = page.getByTestId('modal-container');
    await expect(modalContainer).toBeVisible();

    await expect(modalContainer.locator('h3').first()).toHaveText('Детали ингредиента');
    await expect(modalContainer.locator(`text=${BUN_NAME}`)).toBeVisible();
    await expect(modalContainer.locator('text=Калории, ккал')).toBeVisible();
    await expect(modalContainer.locator('text=420')).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(modalContainer).not.toBeVisible();

    await page.getByTestId(`ingredient-card-${BUN_ID}`).locator('a').click();
    await expect(modalContainer).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modalContainer).not.toBeVisible();
  });

  test('Процесс создания заказа', async ({ page, context }) => {
    await context.addCookies([
      {
        name: 'accessToken',
        value: 'Bearer-mock-token',
        domain: 'localhost',
        path: '/',
      },
    ]);
    await page.evaluate(() => {
      localStorage.setItem('refreshToken', 'mock-refresh-token');
    });

    await page.reload();

    const bunCard = page.getByTestId(`ingredient-card-${BUN_ID}`);
    await bunCard.locator('button', { hasText: 'Добавить' }).click();

    await page.locator('button', { hasText: 'Оформить заказ' }).click();

    const modalContainer = page.getByTestId('modal-container');
    await expect(modalContainer).toBeVisible();
    await expect(modalContainer.locator('text=7777')).toBeVisible();

    await page.getByTestId('modal-close-button').click();
    await expect(modalContainer).not.toBeVisible();

    await expect(page.getByTestId('constructor-bun-top-placeholder')).toBeVisible();
    await expect(page.getByTestId('constructor-ingredients-placeholder')).toBeVisible();
  });
});
