import MainLayout from "./components/layout/MainLayout";
import { Suspense, lazy } from "react";
import { Route, Routes } from "react-router";

const About = lazy(() => import("./pages/About"));
const NotFound = lazy(() => import("./pages/NotFound"));
const WebWorker = lazy(() => import("./pages/WebWorker"));
const Login = lazy(() => import("./pages/Login"));
const ProductList = lazy(() => import("./pages/Products/ProductList"));
const ProductDetail = lazy(() => import("./pages/Products/ProductDetail"));
const VideoCall = lazy(() => import("./pages/VideoCall"));
const DrawImageFromBE = lazy(() => import("./pages/Canvas"));

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Đang Tải...</div>}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<MainLayout />}>
          <Route path="/about" element={<About />} />
          <Route path="/ww" element={<WebWorker />} />
          <Route path="/" element={<ProductList />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/video" element={<VideoCall />} />
          <Route path="/canvas" element={<DrawImageFromBE />} />{" "}
          {/* Trang chính */}
        </Route>
        <Route path="*" element={<NotFound />} /> {/* Route không tìm thấy */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
