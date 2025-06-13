import { presetWind3 } from '@unocss/preset-wind3'
import { defineConfig, presetTypography } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetTypography(),
  ],
})
