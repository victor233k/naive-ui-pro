import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useMenuStore = defineStore('menu', () => {
  const menus = ref<any[]>([
    {
      name: 'Home',
      path: '/home',
      component: 'user',
      meta: {
        title: '首页',
        icon: 'material-symbols:dashboard-outline-rounded',
        keepAlive: true,
        hideInBreadcrumb: false,
      },
    },
    {
      name: 'System',
      path: '/system',
      meta: {
        title: '系统管理',
        icon: 'ant-design:setting-outlined',
        keepAlive: true,
        hideInBreadcrumb: false,
      },
      children: [
        {
          name: 'User',
          path: 'user',
          component: 'user',
          meta: {
            title: '用户管理',
            icon: 'ant-design:user-outlined',
            keepAlive: true,
            hideInBreadcrumb: false,
          },
        },
        {
          name: 'Role',
          path: 'role',
          component: 'Role',
          meta: {
            title: '角色管理',
            icon: 'carbon:user-role',
            keepAlive: true,
            hideInBreadcrumb: false,
          },
        },
        {
          name: 'Menu',
          path: 'menu',
          component: 'Menu',
          meta: {
            title: '菜单管理',
            icon: 'ant-design:menu-outlined',
            keepAlive: true,
            hideInBreadcrumb: false,
          },
        },
      ],
    },
    {
      name: 'External',
      path: '/external',
      component: 'External',
      meta: {
        title: '外部页面',
        icon: 'ant-design:link-outlined',
        keepAlive: false,
        hideInBreadcrumb: true,
      },
      children: [
        {
          name: 'Baidu',
          path: 'baidu',
          component: 'Baidu',
          meta: {
            title: '百度',
            icon: 'ri:baidu-fill',
            keepAlive: false,
          },
          link: 'https://www.baidu.com',
        },
      ],
    },
  ])

  return {
    menus,
  }
})
