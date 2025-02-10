import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

type theme = 'dark' | 'light';

export interface themeState {
  value: theme;
}

const initialState: themeState = {
  value: 'dark',
};

export const themeSlice = createSlice({
  name: 'backgroundEffects',
  initialState,
  reducers: {
    setTheme(state, action: PayloadAction<theme>) {
      document.documentElement.classList.remove(state.value);
      state.value = action.payload;
      document.documentElement.classList.add(action.payload);
    },
  },
});

export const { setTheme } = themeSlice.actions;

export const selectTheme = (state: RootState) => state.theme.value;

export default themeSlice.reducer;
