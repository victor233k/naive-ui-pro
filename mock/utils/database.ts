import { fakerZH_CN as faker } from '@faker-js/faker'
import { SysEnableDisable, SysUserGender } from './dicts'

export const database = {
  user: [] as any[],
  role: [] as any[],
  menu: [] as any[],
}

// #region 初始化角色数据
const builtinRoles = [
  { code: 'admin', name: '管理员' },
  { code: 'user', name: '普通用户' },
  { code: 'guest', name: '访客' },
]

database.role = Array.from(
  { length: builtinRoles.length },
  (_, i) =>
    ({
      ...builtinRoles[i],
      id: faker.string.uuid(),
      status: faker.helpers.arrayElement(Object.values(SysEnableDisable)),
      remark: faker.lorem.paragraph({ min: 1, max: 3 }),
      createTime: faker.date.past().toISOString(),
      updateTime: faker.date.past().toISOString(),
    }),
)
// #endregion

// #region 初始化用户数据
database.user = Array.from(
  { length: 100 },
  () =>
    ({
      id: faker.string.uuid(),
      nickname: faker.person.fullName(),
      username: faker.internet.username(),
      password: faker.internet.password(),
      roleIds: faker.helpers.arrayElements(
        database.role.map(item => item.id),
      ),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      gender: faker.helpers.arrayElement(Object.values(SysUserGender)),
      status: faker.helpers.arrayElement(Object.values(SysEnableDisable)),
      remark: faker.person.bio(),
      createTime: faker.date.past().toISOString(),
      updateTime: faker.date.past().toISOString(),
    }),
)
// #endregion

// #region 初始化菜单数据
database.menu = [
  {
    id: '1',
    type: '1',
    path: '/home',
    component: '/home/index.vue',
    meta: {
      title: '首页',
      icon: 'material-symbols:dashboard-outline-rounded',
      titleI18nKey: 'routes.home',
    },
  },
  {
    id: '2',
    type: '0',
    path: '/demos',
    children: [
      {
        id: '2-1',
        type: '0',
        path: 'access',
        children: [
          {
            id: '2-1-1',
            type: '1',
            path: 'toggle',
            component: '/demos/access/toggle/index.vue',
            meta: {
              title: '权限切换',
              icon: 'mdi:page-previous-outline',
              titleI18nKey: 'routes.accessToggle',
            },
          },
        ],
        meta: {
          title: '权限',
          icon: 'material-symbols:lock-outline',
          titleI18nKey: 'routes.access',
        },
      },
      {
        id: '2-2',
        type: '0',
        path: 'external',
        meta: {
          title: '外部页面',
          titleI18nKey: 'routes.externalPage',
          icon: 'ant-design:link-outlined',
        },
        children: [
          {
            id: '2-2-1',
            type: '0',
            path: 'iframe',
            children: [
              {
                id: '2-2-1-1',
                type: '1',
                path: 'form',
                component: '',
                meta: {
                  title: '复杂表单',
                  titleI18nKey: 'routes.complexForm',
                  icon: 'lets-icons:form',
                  link: 'https://naive-ui.pro-components.cn/zh-CN/os-theme/components/form-list#list-nest.vue',
                  linkMode: 'iframe',
                },
              },
            ],
            meta: {
              title: '内嵌',
              titleI18nKey: 'routes.embedded',
              icon: 'material-symbols:iframe',
            },
          },
          {
            id: '2-2-2',
            type: '0',
            path: 'link',
            children: [
              {
                id: '2-2-2-1',
                type: '1',
                path: 'vite',
                component: '',
                meta: {
                  icon: 'logos:vitejs',
                  title: 'Vite',
                  link: 'https://vite.dev',
                },
              },
              {
                id: '2-2-2-2',
                type: '1',
                path: 'vue',
                component: '',
                meta: {
                  icon: 'logos:vue',
                  title: 'Vue',
                  link: 'https://vuejs.org/',
                },
              },
            ],
            meta: {
              title: '外链',
              titleI18nKey: 'routes.externalLink',
              icon: 'akar-icons:link-out',
            },
          },
        ],
      },
    ],
    meta: {
      title: '演示',
      icon: 'hugeicons:codesandbox',
      titleI18nKey: 'routes.demo',
    },
  },
  {
    id: '3',
    type: '0',
    path: '/system',
    children: [
      {
        id: '3-1',
        type: '1',
        path: 'user',
        component: '/system/user/index.vue',
        meta: {
          title: '用户管理',
          icon: 'ant-design:user-outlined',
          titleI18nKey: 'routes.userManagement',
        },
      },
      {
        id: '3-2',
        type: '1',
        path: 'role',
        component: '/system/role/index.vue',
        meta: {
          title: '角色管理',
          icon: 'carbon:user-role',
          titleI18nKey: 'routes.roleManagement',
        },
      },
      {
        id: '3-3',
        type: '1',
        path: 'menu',
        component: '/system/menu/index.vue',
        meta: {
          title: '菜单管理',
          icon: 'ant-design:menu-outlined',
          titleI18nKey: 'routes.menuManagement',
        },
      },
    ],
    meta: {
      title: '系统管理',
      icon: 'ant-design:setting-outlined',
      titleI18nKey: 'routes.system',
    },
  },
]
// #endregion
