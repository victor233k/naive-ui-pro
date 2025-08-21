/**
 * 平滑离开：保留原位置避免动画抖动
 */
function handleBeforeLeave(el: Element) {
  const dom = el as HTMLElement
  const { offsetLeft, offsetHeight } = dom

  Object.assign(dom.style, {
    position: 'absolute',
    left: `${offsetLeft}px`,
    height: `${offsetHeight}px`,
  })
}

/**
 * 使用 tabbar 动画过渡的组合函数
 */
export function useTabbarTransition() {
  const transitionProps = {
    onBeforeLeave: handleBeforeLeave,
    leaveToClass: 'translate-x--5 scale-95  opacity-0',
    enterFromClass: 'translate-x--5 scale-45 opacity-0',
    moveClass: 'transition-[opacity,transform]! duration-300 ease',
    enterActiveClass: 'transition-[opacity,transform] duration-300 ease',
    leaveActiveClass: 'transition-[opacity,transform] duration-300 ease',
  }

  return {
    transitionProps,
  }
}
