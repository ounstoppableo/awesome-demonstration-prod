import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { removeParticle, setParticle } from '@/utils/particleControl';
import { cloneDeep, merge } from 'lodash';

type ComponentInfo = {
  id: string;
  entryFile: string;
  relaventPackages: string[];
  currentFile: string;
  fileContentsMap: { [key: string]: string };
};

export interface ComponentInfoState {
  value: ComponentInfo;
}

const initialState: ComponentInfoState = {
  value: {
    id: '',
    entryFile: '',
    relaventPackages: [],
    currentFile: '',
    fileContentsMap: {},
  },
};

export const componentInfoSlice = createSlice({
  name: 'ComponentInfoSlice',
  initialState,
  reducers: {
    setComponentInfo(state, action: PayloadAction<Partial<ComponentInfo>>) {
      state.value = merge(cloneDeep(state.value), action.payload);
    },
  },
});
export const { setComponentInfo } = componentInfoSlice.actions;

export const selectComponentInfo = (state: RootState) =>
  state.componentInfo.value;

export default componentInfoSlice.reducer;
