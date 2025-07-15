import { nextTick } from 'vue'
import { useThemeStore } from '@/store/use-theme-store'

export function useToggleThemeWithAnimation() {
  const theme = useThemeStore()

  function toggle(event: MouseEvent) {
    if (
      !('startViewTransition' in document)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      theme.toggleThemeMode()
      return
    }
    const x = event.clientX
    const y = event.clientY
    const endRadius = Math.hypot(
      Math.max(x, innerWidth - x),
      Math.max(y, innerHeight - y),
    )
    const transition = document.startViewTransition(async () => {
      theme.toggleThemeMode()
      await nextTick()
    })
    transition.ready.then(() => {
      const clipPath = [
        `circle(0 at ${x}px ${y}px)`,
        `circle(${endRadius}px at ${x}px ${y}px)`,
      ]
      document.documentElement.animate(
        {
          clipPath: theme.isDark
            ? clipPath
            : [...clipPath.reverse()],
        },
        {
          duration: 500,
          easing: 'ease-in',
          pseudoElement: '::view-transition-new(root)',
        },
      )
    })
  }

  return {
    toggle,
  }
}
