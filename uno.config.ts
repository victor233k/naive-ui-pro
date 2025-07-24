import { presetWind3 } from '@unocss/preset-wind3'
import { defineConfig, presetTypography } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      include: [
        /\.(vue|[jt]sx|[jt]s|html)($|\?)/,
      ],
    },
  },
  presets: [
    presetWind3(),
    presetTypography(),
  ],
})
