import { Action, ThunkAction, configureStore } from '@reduxjs/toolkit';
import backgroundEffectsReducer from './background-effects/background-effects-slice';
import themeReducer from './theme/theme-slice';
import componentInfoReducer from './component-info/component-info-slice';

// ...
export const makeStore = () => {
  return configureStore({
    reducer: {
      backgroundEffects: backgroundEffectsReducer,
      theme: themeReducer,
      componentInfo: componentInfoReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;

export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
