import { Suspense, lazy  } from "react";
import { Route, Routes } from "react-router";

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const NotFound = lazy(() => import('./pages/NotFound'))

const AppRoutes = () => {
  return (
    <Suspense fallback={<div>Đang Tải...</div>}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NotFound />} /> {/* Route không tìm thấy */}
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
