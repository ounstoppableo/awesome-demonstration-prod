import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';

export interface alertState {
  value: boolean;
  msg: string;
}

const initialState: alertState = {
  value: false,
  msg: '',
};

export const alertSlice = createSlice({
  name: 'backgroundEffects',
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<boolean>) {
      state.value = action.payload;
    },
    setAlertMsg(state, action: PayloadAction<string>) {
      state.msg = action.payload;
    },
  },
});

export const { setAlert, setAlertMsg } = alertSlice.actions;

export const selectAlert = (state: RootState) => state.alert.value;

export const selectAlertMsg = (state: RootState) => state.alert.msg;

export default alertSlice.reducer;
