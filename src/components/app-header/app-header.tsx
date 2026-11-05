import { AppHeaderUI } from '@ui';

import { useSelector } from '@services/store.ts';

export const AppHeader = (): React.JSX.Element => {
  /* TODO: Получите имя пользователя из хранилища */
  const { user } = useSelector((state) => state.user);
  const userName = user?.name ?? undefined;
  return <AppHeaderUI userName={userName} />;
};
