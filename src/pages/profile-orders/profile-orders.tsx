import { ProfileOrdersUI } from '@ui-pages';
import { FC, useEffect } from 'react';
import { Preloader } from '@ui';
import { useDispatch, useSelector } from '../../services/store';

import { fetchUserOrders } from '../../services/slices/userOrderSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  const { orders, isLoading, error } = useSelector((state) => state.userOrders);
  const { user } = useSelector((state) => state.user);

  useEffect(() => {
    if (user && orders.length === 0 && !isLoading) {
      dispatch(fetchUserOrders());
    }
  }, [dispatch, user, orders.length, isLoading]);

  if (isLoading) {
    return <Preloader />;
  }

  if (error) {
    return <div>Ошибка: {error}</div>;
  }

  return <ProfileOrdersUI orders={orders} />;
};