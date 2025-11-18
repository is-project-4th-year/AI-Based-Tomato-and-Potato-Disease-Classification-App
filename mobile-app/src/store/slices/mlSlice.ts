/**
 * ML Slice
 * Manages ML model state and operations
 */

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import type {MLState, MLModelInfo} from '@types';

// Initial state
const initialState: MLState = {
  modelLoaded: false,
  modelInfo: null,
  isLoadingModel: false,
  error: null,
};

// Async thunks (will be implemented in Phase 2)
export const loadModel = createAsyncThunk('ml/loadModel', async (_, {rejectWithValue}) => {
  try {
    // TODO: Implement TensorFlow Lite model loading in Phase 2
    throw new Error('ML model loading not yet implemented');
  } catch (error) {
    return rejectWithValue(error instanceof Error ? error.message : 'Failed to load model');
  }
});

export const predict = createAsyncThunk(
  'ml/predict',
  async (imageUri: string, {rejectWithValue}) => {
    try {
      // TODO: Implement on-device inference in Phase 2
      throw new Error('ML prediction not yet implemented');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Prediction failed');
    }
  },
);

// Slice
const mlSlice = createSlice({
  name: 'ml',
  initialState,
  reducers: {
    setModelInfo: (state, action: PayloadAction<MLModelInfo>) => {
      state.modelInfo = action.payload;
    },
    setModelLoaded: (state, action: PayloadAction<boolean>) => {
      state.modelLoaded = action.payload;
    },
    clearMLError: state => {
      state.error = null;
    },
  },
  extraReducers: builder => {
    // Load model
    builder
      .addCase(loadModel.pending, state => {
        state.isLoadingModel = true;
        state.error = null;
      })
      .addCase(loadModel.fulfilled, (state, action) => {
        state.isLoadingModel = false;
        state.modelLoaded = true;
        state.modelInfo = action.payload;
      })
      .addCase(loadModel.rejected, (state, action) => {
        state.isLoadingModel = false;
        state.modelLoaded = false;
        state.error = action.payload as string;
      });

    // Predict
    builder
      .addCase(predict.pending, state => {
        state.error = null;
      })
      .addCase(predict.fulfilled, state => {
        // Prediction results handled by prediction slice
      })
      .addCase(predict.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const {setModelInfo, setModelLoaded, clearMLError} = mlSlice.actions;
export default mlSlice.reducer;
