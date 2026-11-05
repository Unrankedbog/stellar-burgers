import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4000';

// Берем реальные данные из вашей базы данных в HAR-файле
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
    // Находим карточку булки по её реальному ID и добавляем в конструктор
    const bunCard = page.getByTestId(`ingredient-card-${BUN_ID}`);
    await bunCard.locator('button', { hasText: 'Добавить' }).click();

    // Проверяем, что булка отображается сразу в верхней и нижней части
    const constructorSection = page.getByTestId('burger-constructor');
    await expect(constructorSection.locator(`text=${BUN_NAME}`)).toHaveCount(2);
  });

  test('Открытие и закрытие модального окна с описанием ингредиента', async ({
    page,
  }) => {
    // 1. Открытие модального окна
    await page.getByTestId(`ingredient-card-${BUN_ID}`).locator('a').click();

    const modalContainer = page.getByTestId('modal-container');
    await expect(modalContainer).toBeVisible();


    await expect(modalContainer.locator('h3').first()).toHaveText('Детали ингредиента');
    await expect(modalContainer.locator(`text=${BUN_NAME}`)).toBeVisible();
    await expect(modalContainer.locator('text=Калории, ккал')).toBeVisible();
    await expect(modalContainer.locator('text=420')).toBeVisible();

    // 2. Закрытие по клику на крестик
    await page.getByTestId('modal-close-button').click();
    await expect(modalContainer).not.toBeVisible();

    // 3. Закрытие по клику на оверлей
    await page.getByTestId(`ingredient-card-${BUN_ID}`).locator('a').click();
    await expect(modalContainer).toBeVisible();

    // Кликаем по оверлею в левый верхний угол относительно самого элемента, чтобы не попасть в контент окна
    await page.getByTestId('modal-overlay').click({ position: { x: 10, y: 10 } });
    await expect(modalContainer).not.toBeVisible();
  });

  test('Процесс создания заказа', async ({ page, context }) => {
    // ИСПРАВЛЕНО: Перебиваем HAR-файл для запроса юзера, чтобы приложение не считало нас гостем (401 из HAR) [1]
    await page.route('**/api/auth/user', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          user: { email: 'test@example.com', name: 'Саша' },
        }),
      });
    });

    // Дополнительно страхуем отправку заказа точечным моком ответа, чтобы не зависеть от токенов в HAR [1]
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Краторный Бургер',
          order: { number: 7777 },
        }),
      });
    });
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

    // Собираем бургер
    const bunCard = page.getByTestId(`ingredient-card-${BUN_ID}`);
    await bunCard.locator('button', { hasText: 'Добавить' }).click();

    // Оформляем заказ
    await page.locator('button', { hasText: 'Оформить заказ' }).click();


    const modalContainer = page.getByTestId('modal-container');
    await expect(modalContainer).toBeVisible();
    await expect(modalContainer.locator('text=7777')).toBeVisible();

    // Закрываем окно успеха
    await page.getByTestId('modal-close-button').click();
    await expect(modalContainer).not.toBeVisible();

    //Проверка очистки конструктора бургера от добавленных ингредиентов [1]
    await expect(page.getByTestId('constructor-bun-top-placeholder')).toBeVisible();
    await expect(page.getByTestId('constructor-ingredients-placeholder')).toBeVisible();
  });
});
