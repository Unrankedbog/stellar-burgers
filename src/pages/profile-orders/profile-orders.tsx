import { getProfileOrdersSelector, getProfileOrdersThunk } from '@slices/userSlice.ts';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store.ts';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const orders = useSelector(getProfileOrdersSelector);

  useEffect(() => {
    void dispatch(getProfileOrdersThunk());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
