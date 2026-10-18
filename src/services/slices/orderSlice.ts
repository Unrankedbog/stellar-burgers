import { orderBurgerApi, getOrderByNumberApi } from '@api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@utils-types';

export const postOrderThunk = createAsyncThunk(
  'order/postOrder',
  async (ingredientIds: string[]) => {
    const data = await orderBurgerApi(ingredientIds);
    return data.order;
  }
);
export const fetchOrderByNumberThunk = createAsyncThunk(
  'order/fetchByNumber',
  async (number: number) => {
    const data = await getOrderByNumberApi(number);
    return data.orders[0]; // Берем первый заказ из полученного массива
  }
);

type TOrderState = {
  orderModalData: TOrder | null;
  orderByNumberData: TOrder | null;
  orderRequest: boolean;
  error: string | null;
};

const initialState: TOrderState = {
  orderModalData: null,
  orderByNumberData: null,
  orderRequest: false,
  error: null,
};

export const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    // Очистка окна успешного заказа
    resetOrderInfo: (state) => {
      state.orderModalData = null;
    },
    // Очистка при закрытии модалки просмотра старого заказа
    clearOrderPreview: (state) => {
      state.orderByNumberData = null;
    },
  },
  selectors: {
    getOrderState: (state) => state,
  },
  extraReducers: (builder) => {
    builder
      // Создание заказа
      .addCase(postOrderThunk.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(postOrderThunk.rejected, (state, action) => {
        state.orderRequest = false;
        state.error = action.error.message ?? 'Не удалось оформить заказ';
      })
      .addCase(postOrderThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload; // Записываем только сюда
      })
      // Просмотр заказа по номеру
      .addCase(fetchOrderByNumberThunk.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(fetchOrderByNumberThunk.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderByNumberData = action.payload; // Записываем в отдельное поле
      });
  },
});

export const { resetOrderInfo, clearOrderPreview } = orderSlice.actions;
export const { getOrderState } = orderSlice.selectors;
export default orderSlice.reducer;
