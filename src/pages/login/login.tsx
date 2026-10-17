import { loginUserThunk } from '@slices/userSlice';
import { LoginUI } from '@ui-pages';
import { type SyntheticEvent, useEffect, useState } from 'react';

import { useDispatch, useSelector } from '@services/store.ts';

export const Login = (): React.JSX.Element => {
  const dispatch = useDispatch();

  // Достаем из Redux ошибку (если пароль неверный)
  const { error } = useSelector((state) => state.user);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    if (error && error !== 'You should be authorised') {
      setSubmitError(error);
    } else {
      setSubmitError('');
    }
  }, [error]);

  const handleSubmit = (e: SyntheticEvent): void => {
    e.preventDefault();
    if (email && password) {
      void dispatch(loginUserThunk({ email, password }));
    }
  };

  return (
    <LoginUI
      errorText={submitError}
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};
