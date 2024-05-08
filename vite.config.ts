import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import sveltePreprocess from "svelte-preprocess";
import { resolve } from "path";
import { rmdirSync } from "fs";

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
  server: {
    port: 1420,
    strictPort: true,
  },
  
  build: {
    rollupOptions: {
      external: [
        "/public/readme-images"
      ],
    },
  },
  define: {
    'APP_VERSION': JSON.stringify(process.env.npm_package_version),
  }
});
