import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type { BaseQueryFn } from "@reduxjs/toolkit/query";

const baseUrl = process.env.REACT_APP_BE_URL;

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result.error && result.error.status === 401) {
    const refreshToken = localStorage.getItem("refresh_token");
    if (refreshToken) {
      const refreshResult = await baseQuery(
        {
          url: "/token",
          method: "POST",
          body: { refreshToken },
        },
        api,
        extraOptions
      );
      if (refreshResult.data) {
        type RefreshResponse = { accessToken: string; refreshToken: string };
        const { accessToken, refreshToken: newRefreshToken } =
          refreshResult.data as RefreshResponse;
        localStorage.setItem("access_token", accessToken);
        localStorage.setItem("refresh_token", newRefreshToken);
        result = await baseQuery(args, api, extraOptions);
      } else {
        window.location.href = "/login";
      }
    } else {
      window.location.href = "/login";
    }
  }
  return result;
};

export const baseApi = createApi({
  reducerPath: "baseApi",
  baseQuery: baseQueryWithReauth,
  endpoints: () => ({}),
});
