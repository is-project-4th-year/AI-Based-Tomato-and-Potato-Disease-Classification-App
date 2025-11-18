/**
 * App Slice
 * Manages general app state (connectivity, theme, etc.)
 */

import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import type {AppState} from '@types';

// Initial state
const initialState: AppState = {
  isOnline: true,
  theme: 'light',
  language: 'en',
};

// Slice
const appSlice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<'en'>) => {
      state.language = action.payload;
    },
  },
});

export const {setOnlineStatus, setTheme, setLanguage} = appSlice.actions;
export default appSlice.reducer;
