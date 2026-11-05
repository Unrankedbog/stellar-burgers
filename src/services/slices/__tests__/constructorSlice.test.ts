import constructorReducer, {
  addIngredient,
  removeIngredient,
  moveIngredient,
  clearConstructor,
} from '../constructorSlice';

const MOCK_BUN = {
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
};

const MOCK_SAUCE = {
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
};

describe('Тестирование редюсера constructorSlice', () => {
  const initialState = {
    bun: null,
    ingredients: [],
  };

  test('должен возвращать начальное состояние при передаче неизвестного экшена (UNKNOWN)', () => {
    const result = constructorReducer(undefined, { type: 'UNKNOWN' });
    expect(result).toEqual(initialState);
  });

  test('должен добавлять булку в конструктор при экшене addIngredient', () => {
    const action = addIngredient(MOCK_BUN);
    const result = constructorReducer(initialState, action);

    expect(result.bun).toEqual(
      expect.objectContaining({
        _id: MOCK_BUN._id,
        type: 'bun',
      })
    );
    expect(result.bun).toHaveProperty('id'); // Проверка генерации uuid
  });

  test('должен добавлять начинку в массив ингредиентов при экшене addIngredient', () => {
    const action = addIngredient(MOCK_SAUCE);
    const result = constructorReducer(initialState, action);

    expect(result.ingredients).toHaveLength(1);
    expect(result.ingredients[0]).toEqual(
      expect.objectContaining({
        _id: MOCK_SAUCE._id,
        type: 'sauce',
      })
    );
    expect(result.ingredients[0]).toHaveProperty('id');
  });

  test('должен удалять ингредиент по id при экшене removeIngredient', () => {
    const stateWithItem = {
      bun: null,
      ingredients: [{ ...MOCK_SAUCE, id: 'test-unique-id-123' }],
    };

    const action = removeIngredient('test-unique-id-123');
    const result = constructorReducer(stateWithItem, action);

    expect(result.ingredients).toHaveLength(0);
  });

  test('должен менять порядок ингредиентов при экшене moveIngredient', () => {
    const stateWithItems = {
      bun: null,
      ingredients: [
        { ...MOCK_SAUCE, id: 'id-1' },
        { ...MOCK_SAUCE, id: 'id-2' },
      ],
    };

    const action = moveIngredient({ fromIndex: 0, toIndex: 1 });
    const result = constructorReducer(stateWithItems, action);

    expect(result.ingredients[0].id).toBe('id-2');
    expect(result.ingredients[1].id).toBe('id-1');
  });

  test('должен полностью очищать стейт при экшене clearConstructor', () => {
    const filledState = {
      bun: { ...MOCK_BUN, id: 'mock-bun-id' },
      ingredients: [{ ...MOCK_SAUCE, id: 'mock-sauce-id' },
      ],
    };

    const action = clearConstructor();
    const result = constructorReducer(filledState, action);

    expect(result).toEqual(initialState);
  });
});
