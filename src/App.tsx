import { BrowserRouter as Router } from "react-router";
import AppRoutes  from "./routes";
import './index.css'

export default function App() {
  return (
    <Router>
      <AppRoutes  />
    </Router>
  );
}
