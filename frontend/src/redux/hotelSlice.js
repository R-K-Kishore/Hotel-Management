// Redux slice for hotel state management
// Manages the hotels list, loading states, and error messages

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  fetchHotels,
  fetchHotelById,
  createHotel,
  updateHotel,
  deleteHotel,
} from '../services/hotelApi';

// --- Async Thunks ---

// Fetch all hotels (with filters and pagination)
export const getHotels = createAsyncThunk(
  'hotels/getHotels',
  async (params, { rejectWithValue }) => {
    try {
      return await fetchHotels(params);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Fetch a single hotel by ID
export const getHotelById = createAsyncThunk(
  'hotels/getHotelById',
  async (id, { rejectWithValue }) => {
    try {
      return await fetchHotelById(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Create a new hotel
export const addHotel = createAsyncThunk(
  'hotels/addHotel',
  async (formData, { rejectWithValue }) => {
    try {
      return await createHotel(formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Update an existing hotel
export const editHotel = createAsyncThunk(
  'hotels/editHotel',
  async ({ id, formData }, { rejectWithValue }) => {
    try {
      return await updateHotel(id, formData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Delete a hotel
export const removeHotel = createAsyncThunk(
  'hotels/removeHotel',
  async (id, { rejectWithValue }) => {
    try {
      await deleteHotel(id);
      return id; // Return the deleted hotel's ID so we can remove it from state
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// --- Initial State ---
const initialState = {
  hotels: [],
  selectedHotel: null,
  totalRecords: 0,
  totalPages: 0,
  currentPage: 1,
  loading: false,
  detailLoading: false,
  error: null,
};

// --- Slice ---
const hotelSlice = createSlice({
  name: 'hotels',
  initialState,
  reducers: {
    // Clear any error message
    clearError(state) {
      state.error = null;
    },
    // Clear the selected hotel (used when leaving the details page)
    clearSelectedHotel(state) {
      state.selectedHotel = null;
    },
  },
  extraReducers: (builder) => {
    // --- getHotels ---
    builder
      .addCase(getHotels.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getHotels.fulfilled, (state, action) => {
        state.loading = false;
        state.hotels = action.payload.hotels;
        state.totalRecords = action.payload.totalRecords;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(getHotels.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- getHotelById ---
    builder
      .addCase(getHotelById.pending, (state) => {
        state.detailLoading = true;
        state.error = null;
        state.selectedHotel = null;
      })
      .addCase(getHotelById.fulfilled, (state, action) => {
        state.detailLoading = false;
        state.selectedHotel = action.payload;
      })
      .addCase(getHotelById.rejected, (state, action) => {
        state.detailLoading = false;
        state.error = action.payload;
      });

    // --- addHotel ---
    builder
      .addCase(addHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addHotel.fulfilled, (state) => {
        state.loading = false;
        // We don't add directly to the list; the list page will re-fetch
      })
      .addCase(addHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- editHotel ---
    builder
      .addCase(editHotel.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editHotel.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(editHotel.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // --- removeHotel ---
    builder
      .addCase(removeHotel.pending, (state) => {
        state.error = null;
      })
      .addCase(removeHotel.fulfilled, (state, action) => {
        // Remove the deleted hotel from the local list immediately
        state.hotels = state.hotels.filter(
          (hotel) => hotel.id !== action.payload
        );
        state.totalRecords = Math.max(0, state.totalRecords - 1);
      })
      .addCase(removeHotel.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSelectedHotel } = hotelSlice.actions;
export default hotelSlice.reducer;

