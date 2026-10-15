import { getOrders } from '@slices/feedSlice.ts';
import { getIngredients } from '@slices/ingredientsSlice.ts';
import { Preloader, OrderInfoUI } from '@ui';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

import { useSelector } from '@services/store.ts';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  /** TODO: взять переменные orderData и ingredients из стора */
  const { number } = useParams<{ number: string }>();
  const ingredients = useSelector(getIngredients);
  const orders = useSelector(getOrders);
  const orderData = useMemo(() => {
    if (!number || !orders.length) return null;
    return orders.find((item) => item.number === Number(number)) ?? null;
  }, [orders, number]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = Record<string, TIngredient & { count: number }>;

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1,
            };
          }
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

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total,
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
