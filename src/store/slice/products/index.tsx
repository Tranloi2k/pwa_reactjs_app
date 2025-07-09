import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../../config/axios";

interface InitialState {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: any[];
  loading: boolean;
  error?: string;
}

const initialState: InitialState = {
  items: [],
  loading: false,
  error: undefined,
};

interface Product {
  id: number;
  name: string;
  price: number;
  rating: number;
  reviewCount: number;
  image: string;
  isNew?: boolean;
  discount?: number;
}
// Async thunk để fetch products
export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response: { products: Product[] } =
        await axiosInstance.get("/products");
      return response.products;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
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
        state.error = action.payload as string;
      });
  },
});

const productsReducer = productsSlice.reducer;

export default productsReducer;
