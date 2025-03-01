// src/types.d.ts
declare module "*.webp";
declare module "*.png";
declare module "*.jpg";
declare module "*.jpeg";
declare module "*.gif";
declare module "*.svg";

declare var __WB_MANIFEST: Array<{ url: string; revision?: string }>;
declare var self: ServiceWorkerGlobalScope;
