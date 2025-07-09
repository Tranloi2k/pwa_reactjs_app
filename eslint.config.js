import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    plugins: {
      js,
    },
    extends: ["js/recommended"],
  },
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  // Cấu hình TypeScript
  tseslint.configs.recommended,
  // Cấu hình React (flat)
  pluginReact.configs.flat.recommended,
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}"],
    rules: {
      "react/react-in-jsx-scope": "off", // Không yêu cầu import React khi dùng JSX (React 17+)
      // Thêm rule khác nếu muốn, ví dụ:
      // "semi": ["error", "always"],
      // "quotes": ["error", "double"]
    },
  },
  // Ignore các file/thư mục phổ biến
  {
    ignores: [
      "node_modules",
      "dist",
      "build",
      "out",
      "coverage",
      "**/*.js",
      "**/*.jsx",
      "**/*.test.ts",
      "**/*.test.tsx",
      "**/*.spec.ts",
      "**/*.spec.tsx",
      "**/*.d.ts",
      "public",
      ".next",
      ".turbo",
      "*.config.js",
      "*.config.cjs",
    ],
  },
]);
