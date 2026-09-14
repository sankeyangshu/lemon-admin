import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: 'src/index.ts',
  platform: 'node',
  dts: true,
  unbundle: true,
});
