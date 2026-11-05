import ingredientsReducer, { fetchIngredients } from '../ingredientsSlice';

const MOCK_INGREDIENTS = [
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
];

describe('Тестирование редюсера ingredientsSlice', () => {
  const initialState = {
    ingredients: [],
    isLoading: false,
    error: null,
  };

  test('должен возвращать начальное состояние при передаче неизвестного экшена (UNKNOWN)', () => {
    const result = ingredientsReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен обрабатывать экшен fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const result = ingredientsReducer(initialState, action);

    expect(result.isLoading).toBe(true);
    expect(result.error).toBeNull();
  });

  test('должен обрабатывать экшен fetchIngredients.rejected', () => {
    const errorMessage = 'Не удалось загрузить ингредиенты';
    const action = {
      type: fetchIngredients.rejected.type,
      error: { message: errorMessage },
    };
    const result = ingredientsReducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.error).toBe(errorMessage);
  });

  test('должен обрабатывать экшен fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: MOCK_INGREDIENTS,
    };
    const result = ingredientsReducer(initialState, action);

    expect(result.isLoading).toBe(false);
    expect(result.ingredients).toEqual(MOCK_INGREDIENTS);
  });
});
