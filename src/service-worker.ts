import { precacheAndRoute } from "workbox-precaching";
import { registerRoute } from "workbox-routing";
import { StaleWhileRevalidate } from "workbox-strategies";

// Precache tài nguyên
precacheAndRoute(self.__WB_MANIFEST);

// Cache các yêu cầu mạng
registerRoute(
  ({ url }) => url.origin === "https://api.example.com",
  new StaleWhileRevalidate()
);

// Xử lý sự kiện install
self.addEventListener("install", (event) => {
  console.log("Service Worker installing.");
});

// Xử lý sự kiện activate
self.addEventListener("activate", (event) => {
  console.log("Service Worker activating.");
});
