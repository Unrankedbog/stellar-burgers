import { clearConstructor, getConstructorState } from '@slices/constructorSlice';
import { getOrderState, postOrderThunk, resetOrderInfo } from '@slices/orderSlice';
import { BurgerConstructorUI } from '@ui';
import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import { useDispatch, useSelector } from '@services/store.ts';

import type { TConstructorIngredient, TConstructorState } from '@utils-types';

export const BurgerConstructor = (): React.JSX.Element | null => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const constructorItems = useSelector(getConstructorState) as TConstructorState;
  const { user } = useSelector((state) => state.user);
  const { orderRequest, orderModalData } = useSelector(getOrderState);

  const onOrderClick = (): void => {
    if (!constructorItems.bun || orderRequest) return;

    if (!user) {
      void navigate('/login');
      return;
    }
    const orderData = [
      constructorItems.bun._id,
      ...constructorItems.ingredients.map((item) => item._id),
      constructorItems.bun._id,
    ];
    void dispatch(postOrderThunk(orderData));
  };

  const closeOrderModal = (): void => {
    // Закрываем модальное окно, очищаем данные заказа и обнуляем конструктор бургера
    dispatch(resetOrderInfo());
    dispatch(clearConstructor());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
