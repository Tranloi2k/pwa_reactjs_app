import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";

const Home = lazy(() => import("./pages/Home"));
const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WebWorker = lazy(() => import("./pages/WebWorker"));
const Login = lazy(() => import("./pages/Login"));
const RichTextEditor = lazy(() => import("./pages/RichTextEditor"));
const ProductList = lazy(() => import("./pages/Products"));
const VideoCall = lazy(() => import("./pages/VideoCall"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Đang Tải...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/ww" element={<WebWorker />} />
        <Route path="/login" element={<Login />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/editor" element={<RichTextEditor />} />
        <Route path="/video" element={<VideoCall />} />
        <Route path="*" element={<NotFound />} /> {/* Route không tìm thấy */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
