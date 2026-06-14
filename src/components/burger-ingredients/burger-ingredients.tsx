import { useState, useRef, FC } from 'react';
import { TTabMode, TIngredient } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { useSelector } from '../../services/store';
import { RootState } from '../../services/store';
import { Preloader } from '@ui';

export const BurgerIngredients: FC = () => {
  const { data: ingredients, isLoading } = useSelector(
    (state: RootState) => state.ingredients
  );

  const buns = ingredients.filter((item: TIngredient) => item.type === 'bun');
  const mains = ingredients.filter((item: TIngredient) => item.type === 'main');
  const sauces = ingredients.filter(
    (item: TIngredient) => item.type === 'sauce'
  );

  const [currentTab, setCurrentTab] = useState<TTabMode>('bun');

  const titleBunRef = useRef<HTMLHeadingElement>(null);
  const titleMainRef = useRef<HTMLHeadingElement>(null);
  const titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  const handleScroll = () => {
    if (
      !containerRef.current ||
      !titleBunRef.current ||
      !titleMainRef.current ||
      !titleSaucesRef.current
    )
      return;

    const containerTop = containerRef.current.getBoundingClientRect().top;

    const bunDiff = Math.abs(
      titleBunRef.current.getBoundingClientRect().top - containerTop
    );
    const mainDiff = Math.abs(
      titleMainRef.current.getBoundingClientRect().top - containerTop
    );
    const sauceDiff = Math.abs(
      titleSaucesRef.current.getBoundingClientRect().top - containerTop
    );

    if (bunDiff < mainDiff && bunDiff < sauceDiff) {
      setCurrentTab('bun');
    } else if (mainDiff < bunDiff && mainDiff < sauceDiff) {
      setCurrentTab('main');
    } else {
      setCurrentTab('sauce');
    }
  };

  const onTabClick = (tab: string) => {
    setCurrentTab(tab as TTabMode);

    let elementToScroll: HTMLHeadingElement | null = null;
    if (tab === 'bun') elementToScroll = titleBunRef.current;
    if (tab === 'main') elementToScroll = titleMainRef.current;
    if (tab === 'sauce') elementToScroll = titleSaucesRef.current;

    if (elementToScroll) {
      elementToScroll.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  };

  if (isLoading) return <Preloader />;

  return (
    <BurgerIngredientsUI
      currentTab={currentTab}
      buns={buns}
      mains={mains}
      sauces={sauces}
      titleBunRef={titleBunRef}
      titleMainRef={titleMainRef}
      titleSaucesRef={titleSaucesRef}
      containerRef={containerRef}
      onScroll={handleScroll}
      onTabClick={onTabClick}
    />
  );
};
