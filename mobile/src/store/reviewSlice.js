import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as reviewService from '../services/review';

// ── Async Thunks ──────────────────────────────────────────────────

export const loadProductReviews = createAsyncThunk(
  'reviews/loadForProduct',
  async (productId, { rejectWithValue }) => {
    try {
      const reviews = await reviewService.fetchProductReviews(productId);
      return { productId, reviews };
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const loadMyReviews = createAsyncThunk(
  'reviews/loadMine',
  async (accessToken, { rejectWithValue }) => {
    try {
      return await reviewService.fetchMyReviews(accessToken);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const addReview = createAsyncThunk(
  'reviews/add',
  async ({ payload, accessToken }, { rejectWithValue }) => {
    try {
      return await reviewService.submitReview(payload, accessToken);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/update',
  async ({ reviewId, payload, accessToken }, { rejectWithValue }) => {
    try {
      return await reviewService.editReview(reviewId, payload, accessToken);
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/delete',
  async ({ reviewId, accessToken }, { rejectWithValue }) => {
    try {
      await reviewService.removeReview(reviewId, accessToken);
      return reviewId;
    } catch (e) {
      return rejectWithValue(e.message);
    }
  }
);

// ── Slice ─────────────────────────────────────────────────────────

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    // keyed by productId so multiple product review lists can coexist
    byProduct: {},
    myReviews: [],
    loading: false,
    error: null,
  },
  reducers: {
    clearReviewError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    // loadProductReviews
    builder
      .addCase(loadProductReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadProductReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.byProduct[action.payload.productId] = action.payload.reviews;
      })
      .addCase(loadProductReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // loadMyReviews
    builder
      .addCase(loadMyReviews.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loadMyReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.myReviews = action.payload;
      })
      .addCase(loadMyReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // addReview
    builder
      .addCase(addReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addReview.fulfilled, (state, action) => {
        state.loading = false;
        const review = action.payload;
        const pid = review.product;
        if (state.byProduct[pid]) {
          state.byProduct[pid].unshift(review);
        } else {
          state.byProduct[pid] = [review];
        }
        state.myReviews.unshift(review);
      })
      .addCase(addReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // updateReview
    builder
      .addCase(updateReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const updated = action.payload;
        const pid = updated.product;

        // Update in byProduct
        if (state.byProduct[pid]) {
          const idx = state.byProduct[pid].findIndex((r) => r._id === updated._id);
          if (idx !== -1) state.byProduct[pid][idx] = updated;
        }
        // Update in myReviews
        const myIdx = state.myReviews.findIndex((r) => r._id === updated._id);
        if (myIdx !== -1) state.myReviews[myIdx] = updated;
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // deleteReview
    builder
      .addCase(deleteReview.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        const deletedId = action.payload;
        // Remove from all byProduct lists
        for (const pid in state.byProduct) {
          state.byProduct[pid] = state.byProduct[pid].filter((r) => r._id !== deletedId);
        }
        state.myReviews = state.myReviews.filter((r) => r._id !== deletedId);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearReviewError } = reviewSlice.actions;
export default reviewSlice.reducer;