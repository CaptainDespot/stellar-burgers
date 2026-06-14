import {
  ingredientsSlice,
  getIngredients,
  initialState
} from '../slices/ingredientsSlices';
import { TIngredient } from '@utils-types';

const reducer = ingredientsSlice.reducer;

const mockIngredients: TIngredient[] = [
  {
    _id: '1',
    name: 'Булка',
    type: 'bun',
    proteins: 10,
    fat: 5,
    carbohydrates: 20,
    calories: 200,
    price: 100,
    image: '',
    image_mobile: '',
    image_large: ''
  }
];

describe('ingredientsSlice reducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('getIngredients.pending — устанавливает isLoading: true и сбрасывает error', () => {
    const state = reducer(
      { isLoading: false, data: [], error: 'старая ошибка' },
      getIngredients.pending('', undefined)
    );
    expect(state.isLoading).toBe(true);
    expect(state.error).toBeNull();
  });

  it('getIngredients.rejected — устанавливает isLoading: false и записывает ошибку', () => {
    const state = reducer(
      { isLoading: true, data: [], error: null },
      getIngredients.rejected(new Error(), '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.error).toBe('Произошла ошибка при запросе ингредиентов');
  });

  it('getIngredients.fulfilled — сохраняет данные и сбрасывает isLoading', () => {
    const state = reducer(
      { isLoading: true, data: [], error: null },
      getIngredients.fulfilled(mockIngredients, '', undefined)
    );
    expect(state.isLoading).toBe(false);
    expect(state.data).toEqual(mockIngredients);
  });
});
