import { AppHeader, OrderInfo, Modal, IngredientDetails } from '@components';
import {
  ConstructorPage,
  Feed,
  Login,
  ForgotPassword,
  Profile,
  ProfileOrders,
  ResetPassword,
  NotFound404,
  Register,
} from '@pages';
import { getUserThunk } from '@slices/userSlice';
import { Preloader } from '@ui';
import { useEffect } from 'react';
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom';

import { ProtectedRoute } from '@components/protectedRoute/protectedRoute.tsx';
import { useDispatch, useSelector } from '@services/store.ts';

import { fetchIngredients } from '../../services/slices/ingredientsSlice';

import type { AppContentProps } from './type';

import '../../index.css';

import styles from './app.module.css';


const App = (): React.JSX.Element => {
  const dispatch = useDispatch();

  const { ingredients, isLoading, error } = useSelector((state) => state.ingredients);

  useEffect(() => {
    void dispatch(fetchIngredients());
    void dispatch(getUserThunk());
  }, [dispatch]);

  const serializedError = error ? { message: error } : null;

  return (
    <div className={styles.app}>
      <AppHeader />
      <AppMainContent
        ingredients={ingredients}
        isLoading={isLoading}
        error={serializedError}
      />
    </div>
  );
};

export default App;

// 2. Дочерний компонент контента — тут хуки роутера работают абсолютно безопасно!
const AppMainContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  const location = useLocation();
  const navigate = useNavigate();

  // Извлекаем фоновый маршрут для модальных окон
  const backgroundLocation = (location.state as { background?: Location })?.background;

  const handleModalClose = (): void => {
    void navigate(-1);
  };

  return (
    <>
      {/* Передаем backgroundLocation ТОЛЬКО когда он реально существует, чтобы не зацикливать обычные страницы */}
      <Routes location={backgroundLocation || undefined}>
        <Route
          path="/"
          element={
            <AppContent ingredients={ingredients} isLoading={isLoading} error={error} />
          }
        />
        <Route path="/feed" element={<Feed />} />
        <Route path="/feed/:number" element={<OrderInfo />} />
        <Route path="/ingredients/:id" element={<IngredientDetails />} />

        <Route
          path="/login"
          element={<ProtectedRoute onlyUnauth component={<Login />} />}
        />
        <Route
          path="/register"
          element={<ProtectedRoute onlyUnauth component={<Register />} />}
        />
        <Route
          path="/forgot-password"
          element={<ProtectedRoute onlyUnauth component={<ForgotPassword />} />}
        />
        <Route
          path="/reset-password"
          element={<ProtectedRoute onlyUnauth component={<ResetPassword />} />}
        />

        <Route path="/profile" element={<ProtectedRoute component={<Profile />} />} />
        <Route
          path="/profile/orders"
          element={<ProtectedRoute component={<ProfileOrders />} />}
        />
        <Route
          path="/profile/orders/:number"
          element={<ProtectedRoute component={<OrderInfo />} />}
        />
        <Route path="*" element={<NotFound404 />} />
      </Routes>

      {backgroundLocation && (
        <Routes>
          <Route
            path="/feed/:number"
            element={
              <Modal title="Информация о заказе" onClose={handleModalClose}>
                <OrderInfo />
              </Modal>
            }
          />
          <Route
            path="/ingredients/:id"
            element={
              <Modal title="Детали ингредиента" onClose={handleModalClose}>
                <IngredientDetails />
              </Modal>
            }
          />
          <Route
            path="/profile/orders/:number"
            element={
              <ProtectedRoute
                component={
                  <Modal title="Информация о заказе" onClose={handleModalClose}>
                    <OrderInfo />
                  </Modal>
                }
              />
            }
          />
        </Routes>
      )}
    </>
  );
};

// 3. Компонент-враппер для контроля загрузки продуктов на главной странице
const AppContent = ({
  ingredients,
  isLoading,
  error,
}: AppContentProps): React.JSX.Element => {
  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>
        Не удалось загрузить ингредиенты
        {error.message ? `: ${error.message}` : '.'}
      </p>
    );
  }

  if (!ingredients.length) {
    return (
      <p className={`${styles.message} text text_type_main-medium`}>Нет ингредиентов</p>
    );
  }

  return <ConstructorPage />;
};
