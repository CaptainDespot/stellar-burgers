import {
  BurgerConstructorSlice,
  addIngredients,
  moveDown,
  moveUp,
  deleteIngredient,
  clearIngredients,
  initialState
} from './BurgerConstructorSlice';
import { TIngredient } from '@utils-types';

const reducer = BurgerConstructorSlice.reducer;

const mockBun: TIngredient = {
  _id: 'bun-1',
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
};

const mockIngredient: TIngredient = {
  _id: 'ing-1',
  name: 'Соус',
  type: 'sauce',
  proteins: 3,
  fat: 2,
  carbohydrates: 5,
  calories: 50,
  price: 50,
  image: '',
  image_mobile: '',
  image_large: ''
};

const mockIngredient2: TIngredient = {
  _id: 'ing-2',
  name: 'Котлета',
  type: 'main',
  proteins: 20,
  fat: 15,
  carbohydrates: 0,
  calories: 300,
  price: 200,
  image: '',
  image_mobile: '',
  image_large: ''
};

describe('burgerConstructorSlice reducer', () => {
  it('должен вернуть начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'UNKNOWN' })).toEqual(initialState);
  });

  it('addIngredients — добавляет булку в bun', () => {
    const state = reducer(initialState, addIngredients(mockBun));
    expect(state.bun).toEqual(mockBun);
    expect(state.ingredients).toHaveLength(0);
  });

  it('addIngredients — заменяет существующую булку новой', () => {
    const stateWithBun = reducer(initialState, addIngredients(mockBun));
    const newBun: TIngredient = {
      ...mockBun,
      _id: 'bun-2',
      name: 'Другая булка'
    };
    const state = reducer(stateWithBun, addIngredients(newBun));
    expect(state.bun).toEqual(newBun);
  });

  it('addIngredients — добавляет не-булку в ingredients с полем id', () => {
    const state = reducer(initialState, addIngredients(mockIngredient));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockIngredient._id);
    expect(state.ingredients[0]).toHaveProperty('id');
  });

  it('moveDown — перемещает элемент вниз по списку', () => {
    let state = reducer(initialState, addIngredients(mockIngredient));
    state = reducer(state, addIngredients(mockIngredient2));
    state = reducer(state, moveDown(0));
    expect(state.ingredients[0]._id).toBe(mockIngredient2._id);
    expect(state.ingredients[1]._id).toBe(mockIngredient._id);
  });

  it('moveUp — перемещает элемент вверх по списку', () => {
    let state = reducer(initialState, addIngredients(mockIngredient));
    state = reducer(state, addIngredients(mockIngredient2));
    state = reducer(state, moveUp(1));
    expect(state.ingredients[0]._id).toBe(mockIngredient2._id);
    expect(state.ingredients[1]._id).toBe(mockIngredient._id);
  });

  it('deleteIngredient — удаляет элемент по индексу', () => {
    let state = reducer(initialState, addIngredients(mockIngredient));
    state = reducer(state, addIngredients(mockIngredient2));
    state = reducer(state, deleteIngredient(0));
    expect(state.ingredients).toHaveLength(1);
    expect(state.ingredients[0]._id).toBe(mockIngredient2._id);
  });

  it('clearIngredients — сбрасывает bun и ingredients', () => {
    let state = reducer(initialState, addIngredients(mockBun));
    state = reducer(state, addIngredients(mockIngredient));
    state = reducer(state, addIngredients(mockIngredient2));
    state = reducer(state, clearIngredients());
    expect(state.bun).toBeNull();
    expect(state.ingredients).toHaveLength(0);
  });
});
