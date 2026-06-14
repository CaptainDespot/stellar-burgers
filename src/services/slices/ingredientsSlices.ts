import { getIngredientsApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { TIngredient } from '@utils-types';

export type TIngredientsSlice = {
  isLoading: boolean;
  data: TIngredient[];
  error: string | null;
};

export const initialState: TIngredientsSlice = {
  isLoading: false,
  data: [],
  error: null
};

export const getIngredients = createAsyncThunk(
  'constructor/getIngredients',
  async () => getIngredientsApi()
);

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    ingredientsStateSelector: (state) => state
  },
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getIngredients.rejected, (state) => {
        state.isLoading = false;
        state.error = 'Произошла ошибка при запросе ингредиентов';
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  }
});

export const { ingredientsStateSelector } = ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
