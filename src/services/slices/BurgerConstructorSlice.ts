import { TConstructorIngredient, TIngredient } from '@utils-types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';

type TBurgerConstructorSlice = {
  bun: TIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurgerConstructorSlice = {
  bun: null,
  ingredients: []
};

export const BurgerConstructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    addIngredients: {
      reducer: (state, action: PayloadAction<TConstructorIngredient>) => {
        if (action.payload.type === 'bun') {
          state.bun = action.payload;
          return;
        }
        state.ingredients.push(action.payload);
      },
      prepare: (ingredient: TIngredient) => ({
        payload: { ...ingredient, id: uuidv4() } as TConstructorIngredient
      })
    },
    moveDown: (state, action: PayloadAction<number>) => {
      const movingElement = state.ingredients[action.payload];
      state.ingredients.splice(action.payload, 1);
      state.ingredients.splice(action.payload + 1, 0, movingElement);
    },
    moveUp: (state, action: PayloadAction<number>) => {
      const movingElement = state.ingredients[action.payload];
      state.ingredients.splice(action.payload, 1);
      state.ingredients.splice(action.payload - 1, 0, movingElement);
    },
    deleteIngredient: (state, action: PayloadAction<number>) => {
      state.ingredients.splice(action.payload, 1);
    },
    clearIngredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    },
    // Добавь эти два редьюсера внутрь reducers: { ... }
    moveIngredient: (
      state,
      action: PayloadAction<{ dragIndex: number; hoverIndex: number }>
    ) => {
      const { dragIndex, hoverIndex } = action.payload;
      const movingElement = state.ingredients[dragIndex];
      state.ingredients.splice(dragIndex, 1);
      state.ingredients.splice(hoverIndex, 0, movingElement);
    },
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.ingredients = state.ingredients.filter(
        (item) => item.id !== action.payload
      );
    }
  }
});

export const BurgerConstructorSelector = (state: {
  burgerConstructor: TBurgerConstructorSlice;
}) => state.burgerConstructor;

export const {
  addIngredients,
  moveDown,
  moveUp,
  deleteIngredient,
  clearIngredients,
  moveIngredient,
  removeIngredient
} = BurgerConstructorSlice.actions;

export default BurgerConstructorSlice.reducer;
