import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axios";

interface InitialState {
  items: any[];
  loading: boolean;
  error?: string;
}

const initialState: InitialState = {
  items: [],
  loading: false,
  error: undefined,
};
// Async thunk để fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response: { products: any[] } = await axiosInstance.get(
        "/products"
      );
      return response.products;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

const productsSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        console.log(state, action);
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        //   state.error = action.payload;
      });
  },
});

const productsReducer = productsSlice.reducer;

export default productsReducer;
