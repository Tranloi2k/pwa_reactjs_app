const CACHE_NAME = "my-pwa-cache-v1";
const manifest = self.__WB_MANIFEST;

const ASSETS_TO_CACHE = [
  // "/assets",
  "/",
  "/assets/landscape.webp",
  // "/manifest.json",
];

// Tên cache và phiên bản (đổi khi cập nhật ứng dụng)
const CACHE_VERSION = "v1";
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const API_CACHE = `api-${CACHE_VERSION}`;
const IMAGE_CACHE = `images-${CACHE_VERSION}`;

// Danh sách tài nguyên tĩnh cần cache ngay từ đầu
const PRE_CACHE_ASSETS = [
  "/",
  "/index.html",
  "/assets/landscape.webp",
  "/icons",
  "/public",
];

const API_ENDPOINTS = [
  "/products", // API sản phẩm
  "/users", // Thêm các API khác nếu cần
  "/ws",
];

// ========== Cài đặt Service Worker ========== //
self.addEventListener("install", (event) => {
  console.log("[SW] Đang cài đặt...");

  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log("[SW] Đang cache tài nguyên tĩnh");
        return cache.addAll(PRE_CACHE_ASSETS);
      })
      .then(() => self.skipWaiting()) // Kích hoạt ngay SW mới
  );
});

// ========== Kích hoạt và dọn dẹp cache cũ ========== //
self.addEventListener("activate", (event) => {
  console.log("[SW] Đang kích hoạt...");

  const cacheWhitelist = [STATIC_CACHE, API_CACHE, IMAGE_CACHE];

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            // Xóa cache không nằm trong whitelist
            if (!cacheWhitelist.includes(cacheName)) {
              console.log("[SW] Xóa cache cũ:", cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => self.clients.claim()) // Kiểm soát tất cả clients ngay
  );
});

// ========== Chiến lược caching ========== //
function cacheFirst(request, cacheName) {
  return caches.match(request).then((cachedResponse) => {
    // Trả về cache nếu có, không thì fetch từ mạng
    return (
      cachedResponse ||
      fetch(request).then((networkResponse) => {
        // Cache response mới cho lần sau
        const responseClone = networkResponse.clone();
        caches
          .open(cacheName)
          .then((cache) => cache.put(request, responseClone));
        return networkResponse;
      })
    );
  });
}

function networkFirst(request, cacheName) {
  return fetch(request)
    .then((networkResponse) => {
      // Cache response mới
      const responseClone = networkResponse.clone();
      caches.open(cacheName).then((cache) => cache.put(request, responseClone));
      return networkResponse;
    })
    .catch(() => {
      // Fallback về cache nếu mạng thất bại
      return caches
        .match(request)
        .then(
          (cachedResponse) => cachedResponse || caches.match("/offline.html")
        );
    });
}

function staleWhileRevalidate(request, cacheName) {
  return caches.match(request).then((cachedResponse) => {
    // Luôn fetch từ mạng để cập nhật cache
    const fetchPromise = fetch(request)
      .then((networkResponse) => {
        const responseClone = networkResponse.clone();
        caches
          .open(cacheName)
          .then((cache) => cache.put(request, responseClone));
      })
      .catch(() => {}); // Bỏ qua lỗi fetch

    // Trả về cache ngay lập tức, cập nhật sau
    return cachedResponse || fetchPromise.then(() => fetch(request));
  });
}

// ========== Xử lý các yêu cầu fetch ========== //
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // API - Network First
  if (API_ENDPOINTS.some((endpoint) => url.pathname.includes(endpoint))) {
    console.log(`[SW] Xử lý API: ${url.pathname}`);
    event.respondWith(networkFirst(request));
  }
  // Hình ảnh - Stale While Revalidate
  else if (request.destination === "image") {
    event.respondWith(staleWhileRevalidate(request, IMAGE_CACHE));
  }
  // Tài nguyên tĩnh - Cache First
  else {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  }
});

// File: sw.js
self.addEventListener("message", async (event) => {
  console.log("SW received message:", event.data);
  if (event.data.type === "TAB_HIDDEN") {
    await self.registration.showNotification(event.data.title, {
      body: event.data.body,
      icon: "/icons/PWA.png", // Thay bằng đường dẫn icon của bạn
      vibrate: [200, 100, 200], // Rung (trên mobile)
      actions: [{ action: "open", title: "Mở tab" }],
    });
  }
});

// Xử lý khi người dùng click vào thông báo
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  if (event.action === "open") {
    clients.openWindow("/"); // Mở lại trang chính
  } else {
    clients.matchAll({ type: "window" }).then((clientList) => {
      if (clientList.length > 0) {
        clientList[0].focus();
      } else {
        clients.openWindow("/");
      }
    });
  }
});
