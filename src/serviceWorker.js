const CACHE_NAME = "my-pwa-cache-v1";
const ASSETS_TO_CACHE = [
  // "/assets",
  "/",
  "/assets/landscape.webp",
  // "/manifest.json",
];

const manifest = self.__WB_MANIFEST;
const resourcesToCache = ASSETS_TO_CACHE.concat(
  manifest.map((entry) => entry.url)
);

// Cài đặt Service Worker và cache tài nguyên
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Đang cache tài nguyên...");
      return cache.addAll(resourcesToCache);
    })
  );
});

// Phản hồi các yêu cầu mạng từ cache
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Trả về tài nguyên từ cache nếu có
      if (response) {
        return response;
      }
      // Nếu không có trong cache, tải từ mạng
      return fetch(event.request)
        .then((networkResponse) => {
          // Trả về response từ mạng
          return networkResponse;
        })
        .catch((error) => {
          // Xử lý lỗi nếu có
          console.error("Fetch failed:", error);
          return new Response("Network error", { status: 500 });
        });
    })
  );
});

// Xóa cache cũ khi cập nhật Service Worker
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
