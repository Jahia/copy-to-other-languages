import { defineConfig } from "vite";
import sbom from "rollup-plugin-sbom";
import jahiaFederationPlugin from "@jahia/vite-federation-plugin";

export default defineConfig({
  build: {
    outDir: "src/main/resources/javascript/apps",
  },

  define: {
    // jss 9, bundled by @material-ui/core 3, reads the Node `global`
    global: "globalThis",
  },

  plugins: [
    sbom({ specVersion: "1.4" }),
    jahiaFederationPlugin({
      exposes: {
        "./init": "./src/javascript/init.js",
      },
    }),
  ],
});
