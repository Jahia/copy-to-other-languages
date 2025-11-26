import { defineConfig } from "vite";
import { federation } from "@module-federation/vite";
import pkg from "./package.json" with { type: "json" };

export default defineConfig({
  plugins: [
    federation({
      name: pkg.name,
      filename: "index.js",
      exposes: {
        "./init": "./src/javascript/init.js",
      },
      remotes: {
        "@jahia/jcontent": {
          type: "appshell",
          name: "@jahia/jcontent",
          entry: "global:appShell.remotes.jcontent",
        },
      },
      shared: {
        "react": { singleton: true },
        "react/": { singleton: true },
        "react-dom": { singleton: true },
        "@apollo/client": { singleton: true },
        "@jahia/ui-extender": { singleton: true },
        "@jahia/moonstone": { singleton: true },
        "rxjs": { singleton: true },
        "formik": { singleton: true },
      },
      runtimePlugins: ['./federation-runtime-plugin.ts'],
    }),
    {
      name: "iife-entrypoint",
      buildEnd() {
        this.emitFile({
          type: "asset",
          name: "remoteEntry.js",
          fileName: "remoteEntry.js",
          originalFileName: "remoteEntry.js",
          // The new module federation runtime is ESM, this is an IIFE wrapper
          source: `appShell.remotes[${JSON.stringify(pkg.name)}]={async init(...a){const m=await import("./index.js");await m.init(...a);Object.assign(this,m)}}`,
        });
        this.emitFile({
          type: "asset",
          name: "package.json",
          fileName: "package.json",
          originalFileName: "package.json",
          source: JSON.stringify(
            {
              "jahia": {
                "remotes": {
                  "jahia": "javascript/apps/remoteEntry.js"
                }
              }
            }
          ),
        })
      },
    },
  ],

  esbuild: { jsx: "automatic" },
  build: {
    assetsDir: "",
    minify: false,
    sourcemap: true,

    rollupOptions: {
      input: "src/javascript/init.js",
    },
    outDir: "src/main/resources/javascript/apps",
  },
  base: "",
});
