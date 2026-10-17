import { registerUserThunk } from '@slices/userSlice';
import { RegisterUI } from '@ui-pages';
import { type SyntheticEvent, useState, useEffect } from 'react';

import { useDispatch, useSelector } from '@services/store.ts';

export const Register = (): React.JSX.Element => {
  const dispatch = useDispatch();

  // Достаем из стора потенциальную ошибку регистрации (например, если email уже занят)
  const { error } = useSelector((state) => state.user);

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  // Фильтруем технические ошибки фоновой проверки токена при монтировании страницы
  useEffect(() => {
    if (error && error !== 'You should be authorised') {
      setSubmitError(error);
    } else {
      setSubmitError('');
    }
  }, [error]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();

    // Передаем имя, email и пароль на сервер для создания нового аккаунта
    if (userName && email && password) {
      void dispatch(registerUserThunk({ name: userName, email, password }));
    }
  };

  return (
    <RegisterUI
      errorText={submitError}
      email={email}
      userName={userName}
      password={password}
      setEmail={setEmail}
      setPassword={setPassword}
      setUserName={setUserName}
      handleSubmit={handleSubmit}
    />
  );
};
