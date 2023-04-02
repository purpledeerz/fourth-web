import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [nodePolyfills(), react()],
  define: {
    global: "globalThis",
  },
  build: {
    assetsDir: "",
    commonjsOptions: {
      transformMixedEsModules: true,
    },
    minify: "esbuild",
    emptyOutDir: true,
    rollupOptions: {
      input: "./src/index.jsx",
      output: {
        inlineDynamicImports: true,
        dir: "../tokengate/assets",
        entryFileNames: "index.js",
      },
    },
  },
  resolve: {
    alias: {
      "@safe-globalThis/safe-ethers-adapters": "@thirdweb-dev/wallets",
      "@safe-globalThis/safe-core-sdk": "@thirdweb-dev/wallets",
      "@safe-globalThis/safe-ethers-lib": "@thirdweb-dev/wallets",
    },
  },
});
