import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['index.ts'],
  clean: true,
  dts: true,
  minify: 'terser',
  format: ['cjs', 'esm'],
})
