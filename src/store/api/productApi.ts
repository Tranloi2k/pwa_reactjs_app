import { baseApi } from "./baseApi";
import { ProductData } from "../../types/product";

export const productApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPosts: builder.query<ProductData, void>({
      query: () => "products",
    }),
    addPost: builder.mutation({
      query: (newPost) => ({
        url: "/posts",
        method: "POST",
        body: newPost,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetPostsQuery, useAddPostMutation } = productApi;
