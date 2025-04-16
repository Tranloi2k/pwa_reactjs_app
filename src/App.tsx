import { BrowserRouter } from "react-router";
import AppRoutes from "./routes";
import "./index.css";
import { Provider } from "react-redux";
import store from "./store";
import { ApolloProvider } from "@apollo/client";
import client from "./config/apolo";

export default function App() {
  return (
    <ApolloProvider client={client}>
      <Provider store={store}>
        <BrowserRouter>
          <AppRoutes />
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  );
}
