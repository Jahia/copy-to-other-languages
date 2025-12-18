import { defineConfig } from "vite";
import jahiaFederationPlugin from "@jahia/vite-federation-plugin";

export default defineConfig({
  build: {
    outDir: "src/main/resources/javascript/apps",
  },

  plugins: [
    jahiaFederationPlugin({
      exposes: {
        "./init": "./src/javascript/init.js",
      },
    }),
  ],
});
