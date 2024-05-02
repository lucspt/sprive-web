import { defineConfig } from 'vitest/config'
import { configDefaults } from 'vitest/config'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  },
  test: {
    setupFiles: ["./src/__tests__/setup.js"],
    exclude: [
      ...configDefaults.exclude,
      "**/types.ts"
    ],
    environment: "jsdom",
    dir: "./src/__tests__",
    globals: true,
    // watch: false,
    coverage: {
      provider: "v8",
      enabled: true,
    },
    deps: {
      optimizer: {
        web: {
          include: [ "vitest-canvas-mock" ] // required to test <canvas> element (for chartjs)
        }
      }
    }
  }
})
