import { svelte } from "@sveltejs/vite-plugin-svelte";
import { rmdirSync } from "fs";
import { internalIpV4 } from "internal-ip";
import { resolve } from "path";
import sveltePreprocess from "svelte-preprocess";
import { defineConfig } from "vite";

// @ts-expect-error process is a nodejs global
const mobile = !!/android|ios/.exec(process.env.TAURI_ENV_PLATFORM);

type ExcludeOptions = {
  directories: string[]
}

/**
 * Removes the provided directories from build.
 * @param config The plugin's configuration options.
 * @returns A Vite plugin.
 */
function excludeDirectories(config?: ExcludeOptions) {
  return {
    name: 'remove-progress-images',
    resolveId (source: string) {
      return source === 'virtual-module' ? source : null;
    },
    renderStart (outputOptions: any, inputOptions: any) {
      const outDir = outputOptions.dir;
      
      if (config) {
        for (const directory of config.directories) {
          const directoryPath = resolve(outDir, directory);
          rmdirSync(directoryPath, { recursive: true });
          console.log(`Deleted ${directoryPath}`);
        }
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    svelte({
      preprocess: [
        sveltePreprocess({
          typescript: true,
        }),
      ],
    }),
    excludeDirectories({
      directories: ["readme-images"]
    })
  ],

  resolve: {
    alias: {
      "@interactables": resolve(__dirname, "./src/components/interactables"),
      "@layout": resolve(__dirname, "./src/components/layout"),
      "@views": resolve(__dirname, "./src/components/views"),
      "@component-utils": resolve(__dirname, "./src/components/utils"),
      "@stores": resolve(__dirname, "./src/stores"),
      "@controllers": resolve(__dirname, "./src/lib/controllers"),
      "@models": resolve(__dirname, "./src/lib/models"),
      "@directives": resolve(__dirname, "./src/lib/directives"),
      "@utils": resolve(__dirname, "./src/lib/utils"),
      "@types": resolve(__dirname, "./src/lib/types"),
      "@icons": resolve(__dirname, "./src/lib/icons")
    }
  },

  // Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
  // prevent vite from obscuring rust errors
  clearScreen: false,
  // tauri expects a fixed port, fail if that port is not available
  server: {
    port: 1420,
    strictPort: true,
    host: mobile ? "0.0.0.0" : false,
    hmr: mobile
      ? {
          protocol: "ws",
          host: await internalIpV4(),
          port: 1421,
        }
      : undefined,
    watch: {
      // 3. tell vite to ignore watching `src-tauri`
      ignored: ["**/src-tauri/**"],
    },
  },
  // to make use of `TAURI_DEBUG` and other env variables
  // https://tauri.studio/v1/api/config#buildconfig.beforedevcommand
  envPrefix: ["VITE_", "TAURI_"],
  build: {
    // Tauri supports es2021
    target: process.env.TAURI_PLATFORM == "windows" ? "chrome105" : "safari15",
    // don't minify for debug builds
    minify: !process.env.TAURI_DEBUG ? "esbuild" : false,
    // produce sourcemaps for debug builds
    sourcemap: !!process.env.TAURI_DEBUG,

    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/windows/main/main.html'),
        popout: resolve(__dirname, 'src/windows/popout/popout.html'),
      },
      external: [
        "/public/readme-images"
      ],
    },
  },
  define: {
    'APP_VERSION': JSON.stringify(process.env.npm_package_version),
    'IS_MOBILE': mobile
  }
});
