import { useAppDispatch } from '@/store/hooks';
import { setTheme } from '@/store/theme/theme-slice';
import { useEffect } from 'react';

export default function usePersistTheme() {
  const dispatch = useAppDispatch();
  useEffect(() => {
    dispatch(setTheme((localStorage.getItem('theme') as any) || 'dark'));
  }, []);
}
