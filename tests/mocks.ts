export const MOCK_INGREDIENTS = [
  {
    _id: 'bun1',
    name: 'Краторная булка N-200i',
    type: 'bun',
    proteins: 80,
    fat: 24,
    carbohydrates: 53,
    calories: 420,
    price: 1255,
    image: 'https://yandex.net',
    image_mobile: 'https://yandex.net',
    image_large: 'https://yandex.net',
  },
  {
    _id: 'sauce1',
    name: 'Соус Spicy-X',
    type: 'sauce',
    proteins: 30,
    fat: 20,
    carbohydrates: 40,
    calories: 90,
    price: 90,
    image: 'https://yandex.net',
    image_mobile: 'https://yandex.net',
    image_large: 'https://yandex.net',
  },
  {
    _id: 'main1',
    name: 'Биокотлета из марсианской говядины',
    type: 'main',
    proteins: 420,
    fat: 142,
    carbohydrates: 242,
    calories: 4242,
    price: 424,
    image: 'https://yandex.net',
    image_mobile: 'https://yandex.net',
    image_large: 'https://yandex.net',
  },
];

export const MOCK_USER = {
  success: true,
  user: {
    email: 'test@example.com',
    name: 'Саша',
  },
};

export const MOCK_ORDER_RESPONSE = {
  success: true,
  name: 'Краторный Спайси Бургер',
  order: {
    number: 7777,
    createdAt: new Date().toISOString(),
    ingredients: ['bun1', 'sauce1', 'main1', 'bun1'],
    _id: 'order123',
    status: 'done',
    name: 'Краторный Спайси Бургер',
    updatedAt: new Date().toISOString(),
  },
};
