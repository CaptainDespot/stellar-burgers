import { FC, useMemo } from 'react';
import { TConstructorIngredient, TIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useDispatch, useSelector } from '../../services/store'; // проверь путь до своего store
import { useNavigate } from 'react-router-dom';
import { clearIngredients } from '../../services/slices/BurgerConstructorSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);

  const orderRequest = useSelector(
    (state) => state.order?.orderRequest || false
  );
  const orderModalData = useSelector(
    (state) => state.order?.orderModalData || null
  );

  const onOrderClick = () => {
    if (!bun) return;
  };

  const closeOrderModal = () => {
    dispatch(clearIngredients());
  };

  const price = useMemo(
    () =>
      (bun ? bun.price * 2 : 0) +
      ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [bun, ingredients]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={{ bun, ingredients }}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
