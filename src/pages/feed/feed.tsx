import { fetchFeeds, getOrders } from '@slices/feedSlice.ts';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import type React from 'react';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store.ts';
export const Feed = (): React.JSX.Element => {
  // TODO: Взять переменную из стора
  const dispatch = useDispatch();
  const orders = useSelector(getOrders);

  useEffect(() => {
    void dispatch(fetchFeeds());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    // TODO: Запросить ленту заказов
    void dispatch(fetchFeeds());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
