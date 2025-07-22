import type { ProConfigProviderProps } from 'pro-naive-ui'
import { generate } from '@ant-design/colors'
import { preferenceConfig } from '@root/preference'
import { usePreferredDark } from '@vueuse/core'
import { darkTheme } from 'naive-ui'
import { defineStore } from 'pinia'
import { computed, nextTick, ref, watchEffect } from 'vue'

export const useThemeStore = defineStore('theme', () => {
  const systemThemeIsDark = usePreferredDark()
  const grayscale = ref(preferenceConfig.theme.grayscale)
  const primaryColor = ref(preferenceConfig.theme.primaryColor)
  const colorWeakness = ref(preferenceConfig.theme.colorWeakness)
  const themeMode = ref<'light' | 'dark' | 'auto'>(preferenceConfig.theme.mode as any)

  const isDark = computed(() => {
    return themeMode.value === 'dark' || (themeMode.value === 'auto' && systemThemeIsDark.value)
  })

  const themeProps = computed<ProConfigProviderProps>(() => {
    const colors = generate(primaryColor.value, {
      theme: isDark.value ? 'dark' : 'default',
    })
    return {
      theme: isDark.value ? darkTheme : undefined,
      themeOverrides: {
        common: {
          primaryColor: colors[5],
          primaryColorHover: colors[6],
          primaryColorSuppl: colors[4],
          primaryColorPressed: colors[7],
        },
      },
    }
  })

  function toggleThemeMode() {
    themeMode.value = isDark.value ? 'light' : 'dark'
  }

  function toggleThemeModeWithAnimation(event: MouseEvent) {
    if (
      !('startViewTransition' in document)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      toggleThemeMode()
      return
    }
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    
    const transition = document.startViewTransition(async () => {
      toggleThemeMode()
      return nextTick()
    })
    
    transition.ready.then(() => {
      const clipPath = [
        `circle(0 at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: isDark.value ? clipPath : [...clipPath].reverse(),
        },
        {
          duration: 400,
          easing: 'ease-in',
          pseudoElement: isDark.value
            ? '::view-transition-new(root)'
            : '::view-transition-old(root)',
        }
      )
    })
  }

  function $reset() {
    grayscale.value = preferenceConfig.theme.grayscale
    themeMode.value = preferenceConfig.theme.mode as any
    primaryColor.value = preferenceConfig.theme.primaryColor
    colorWeakness.value = preferenceConfig.theme.colorWeakness
  }

  watchEffect(() => {
    const grayscaleStyle = grayscale.value ? 'grayscale(100%)' : 'grayscale(0%)'
    const colorWeaknessStyle = colorWeakness.value ? 'invert(80%)' : 'invert(0%)'
    document.documentElement.style.filter = `${grayscaleStyle} ${colorWeaknessStyle}`
  })

  watchEffect(() =>{
    document.documentElement.classList.toggle('dark', isDark.value)
  })

  return {
    $reset,
    isDark,
    grayscale,
    themeMode,
    themeProps,
    primaryColor,
    colorWeakness,
    toggleThemeMode,
    toggleThemeModeWithAnimation,
  }
})
