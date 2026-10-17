import { getFeedState } from '@slices/feedSlice';
import { FeedInfoUI } from '@ui';
import { useMemo } from 'react';

import { useSelector } from '@services/store.ts';

export const FeedInfo = (): React.JSX.Element => {
  // 1. Забираем весь объект состояния ленты из Redux
  const feedState = useSelector(getFeedState);
  const { orders } = feedState;

  // 2. Фильтруем готовые заказы
  const readyOrders = useMemo(
    () =>
      orders
        .filter((item) => item.status === 'done')
        .map((item) => item.number)
        .slice(0, 20),
    [orders]
  );

  // 3. Фильтруем заказы в работе
  const pendingOrders = useMemo(
    () =>
      orders
        .filter((item) => item.status === 'pending')
        .map((item) => item.number)
        .slice(0, 20),
    [orders]
  );

  return (
    <FeedInfoUI
      readyOrders={readyOrders}
      pendingOrders={pendingOrders}
      feed={feedState}
    />
  );
};
