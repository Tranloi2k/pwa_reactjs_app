// ApolloClient.ts
import { ApolloClient, InMemoryCache } from "@apollo/client";

const client = new ApolloClient({
  uri: process.env.REACT_APP_BE_URL + "/graphql", // Thay bằng endpoint của bạn
  cache: new InMemoryCache(),
});

export default client;
