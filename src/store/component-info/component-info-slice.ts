import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState, AppThunk } from '../store';
import { removeParticle, setParticle } from '@/utils/particleControl';
import { cloneDeep, merge } from 'lodash';
import { ComponentInfoForViewerType as ComponentInfo } from '@/utils/addComponentFormDataFormat';

export interface ComponentInfoState {
  value: ComponentInfo;
}

const initialState: ComponentInfoState = {
  value: {
    id: '',
    entryFile: '',
    relevantPackages: [],
    externalFiles: [],
    currentFile: '',
    fileContentsMap: {},
    framework: [],
    currentFramework: '',
  },
};

export const componentInfoSlice = createSlice({
  name: 'ComponentInfoSlice',
  initialState,
  reducers: {
    setComponentInfo(state, action: PayloadAction<Partial<ComponentInfo>>) {
      state.value = merge(cloneDeep(state.value), action.payload);
    },
    clearComponentInfo(state, action) {
      state.value = {
        id: '',
        entryFile: '',
        relevantPackages: [],
        externalFiles: [],
        currentFile: '',
        fileContentsMap: {},
        framework: [],
        currentFramework: '',
      };
    },
  },
});
export const { setComponentInfo, clearComponentInfo } =
  componentInfoSlice.actions;

export const selectComponentInfo = (state: RootState) =>
  state.componentInfo.value;

export default componentInfoSlice.reducer;
