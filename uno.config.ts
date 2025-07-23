import { presetWind3 } from '@unocss/preset-wind3'
import { defineConfig, presetTypography } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|svelte|[jt]sx|vine.ts|mdx?|astro|elm|php|phtml|html)($|\?)/,
        'packages/router/**/*.ts',
      ],
    },
  },
  presets: [
    presetWind3(),
    presetTypography(),
  ],
})
