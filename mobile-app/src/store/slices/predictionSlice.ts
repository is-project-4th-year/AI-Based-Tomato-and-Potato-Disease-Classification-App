/**
 * Prediction Slice
 * Manages prediction history and current predictions
 */

import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import type {PredictionState, Prediction, LocalPrediction} from '@types';

// Initial state
const initialState: PredictionState = {
  predictions: [],
  localPredictions: [],
  currentPrediction: null,
  isLoading: false,
  error: null,
  lastFetch: null,
};

// Async thunks (will be fully implemented in Phase 4-5)
export const fetchPredictions = createAsyncThunk(
  'predictions/fetchAll',
  async (_, {rejectWithValue}) => {
    try {
      // TODO: Implement API call in Phase 4
      return [];
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to fetch predictions');
    }
  },
);

export const createPrediction = createAsyncThunk(
  'predictions/create',
  async (imageUri: string, {rejectWithValue}) => {
    try {
      // TODO: Implement in Phase 5
      throw new Error('Prediction API not yet implemented');
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to create prediction');
    }
  },
);

export const deletePrediction = createAsyncThunk(
  'predictions/delete',
  async (id: number, {rejectWithValue}) => {
    try {
      // TODO: Implement API call in Phase 6
      return id;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Failed to delete prediction');
    }
  },
);

// Slice
const predictionSlice = createSlice({
  name: 'predictions',
  initialState,
  reducers: {
    setCurrentPrediction: (state, action: PayloadAction<Prediction | null>) => {
      state.currentPrediction = action.payload;
    },
    addLocalPrediction: (state, action: PayloadAction<LocalPrediction>) => {
      state.localPredictions.unshift(action.payload);
      // Keep only last 100 predictions
      if (state.localPredictions.length > 100) {
        state.localPredictions = state.localPredictions.slice(0, 100);
      }
    },
    removeLocalPrediction: (state, action: PayloadAction<string>) => {
      state.localPredictions = state.localPredictions.filter(p => p.id !== action.payload);
    },
    markPredictionSynced: (state, action: PayloadAction<{localId: string; prediction: Prediction}>) => {
      const localIndex = state.localPredictions.findIndex(p => p.id === action.payload.localId);
      if (localIndex !== -1) {
        state.localPredictions[localIndex].synced = true;
        state.localPredictions[localIndex].syncedAt = new Date().toISOString();
      }
      state.predictions.unshift(action.payload.prediction);
    },
    clearPredictions: state => {
      state.predictions = [];
      state.localPredictions = [];
      state.currentPrediction = null;
      state.lastFetch = null;
    },
  },
  extraReducers: builder => {
    // Fetch predictions
    builder
      .addCase(fetchPredictions.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPredictions.fulfilled, (state, action) => {
        state.isLoading = false;
        state.predictions = action.payload;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchPredictions.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Create prediction
    builder
      .addCase(createPrediction.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createPrediction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentPrediction = action.payload;
        state.predictions.unshift(action.payload);
      })
      .addCase(createPrediction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });

    // Delete prediction
    builder
      .addCase(deletePrediction.pending, state => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deletePrediction.fulfilled, (state, action) => {
        state.isLoading = false;
        state.predictions = state.predictions.filter(p => p.id !== action.payload);
      })
      .addCase(deletePrediction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setCurrentPrediction,
  addLocalPrediction,
  removeLocalPrediction,
  markPredictionSynced,
  clearPredictions,
} = predictionSlice.actions;

export default predictionSlice.reducer;
