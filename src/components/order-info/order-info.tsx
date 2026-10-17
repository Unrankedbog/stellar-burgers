import { getIngredients } from '@slices/ingredientsSlice';
import { fetchOrderByNumberThunk, getOrderState } from '@slices/orderSlice';
import { Preloader, OrderInfoUI } from '@ui';
import { memo, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store.ts';

import type { TIngredient } from '@utils-types';

export const OrderInfo = memo(function OrderInfo(): React.JSX.Element | null {
  const { number } = useParams<{ number: string }>();
  const dispatch = useDispatch();
  const ingredients = useSelector(getIngredients);
  const { orderModalData: orderData } = useSelector(getOrderState);

  useEffect(() => {
    if (number) {
      void dispatch(fetchOrderByNumberThunk(Number(number)));
    }
  }, [number, dispatch]);

  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;
    const date = new Date(orderData.createdAt);
    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) acc[item] = { ...ingredient, count: 1 };
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );
    return { ...orderData, ingredientsInfo, date, total };
  }, [orderData, ingredients]);

  if (!orderInfo) return <Preloader />;
  return <OrderInfoUI orderInfo={orderInfo} />;
});
