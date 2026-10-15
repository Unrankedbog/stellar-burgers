import { updateUserThunk } from '@slices/userSlice';
import { ProfileUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store.ts';

export const Profile = (): React.JSX.Element => {
  const dispatch = useDispatch();

  // 1. Берем реальные данные авторизованного пользователя из Redux
  const { user } = useSelector((state) => state.user);

  const [formValue, setFormValue] = useState({
    name: user?.name ?? '',
    email: user?.email ?? '',
    password: '',
  });

  // 2. Синхронизируем локальную форму, если данные пользователя в сторе обновились
  useEffect(() => {
    setFormValue((prevState) => ({
      ...prevState,
      name: user?.name ?? '',
      email: user?.email ?? '',
    }));
  }, [user]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  // 3. Отправка обновленных данных профиля на сервер
  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (isFormChanged) {
      void dispatch(
        updateUserThunk({
          name: formValue.name,
          email: formValue.email,
          password: formValue.password,
        })
      );
    }
  };

  // 4. Сброс изменений к исходным серверным данным
  const handleCancel = (e: SyntheticEvent): void => {
    e.preventDefault();
    setFormValue({
      name: user?.name ?? '',
      email: user?.email ?? '',
      password: '',
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormValue((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
