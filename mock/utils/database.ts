/* eslint-disable no-lone-blocks */
import type { Api as MenuApi } from '@/views/system/menu/index.api'
import type { Api as RoleApi } from '@/views/system/role/index.api'
import type { Api as UserApi } from '@/views/system/user/index.api'
import { fakerZH_CN as faker } from '@faker-js/faker'
import { SysEnableDisable, SysUserGender } from './dicts'

export const database = {
  user: [] as UserApi.Model[],
  role: [] as RoleApi.Model[],
  menu: [] as MenuApi.Model[],
}

// #region 初始化角色数据
{
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
      } as RoleApi.Model),
  )
}
// #endregion

// #region 初始化用户数据
{
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
      } as UserApi.Model),
  )
}
// #endregion

// #region 初始化菜单数据
{
  database.menu = [
    {
      id: 'system',
      code: 'System',
      type: '0',
      routePath: '/system',
      title: '系统管理',
      icon: 'ant-design:setting-outlined',
      keepAlive: true,
      linkMode: '0',
      sort: 1,
      status: '1',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
    {
      parentId: 'system',
      id: 'system:user',
      code: 'User',
      type: '1',
      routePath: 'user',
      routeFile: 'system/user/index',
      title: '用户管理',
      icon: 'ant-design:user-outlined',
      keepAlive: true,
      linkMode: '0',
      sort: 1,
      status: '1',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
    {
      parentId: 'system',
      id: 'system:role',
      code: 'Role',
      type: '1',
      routePath: 'role',
      routeFile: 'system/role/index',
      title: '角色管理',
      icon: 'ant-design:user-role',
      keepAlive: true,
      linkMode: '0',
      sort: 2,
      status: '1',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
    {
      parentId: 'system',
      id: 'system:menu',
      code: 'Menu',
      type: '1',
      routePath: 'menu',
      routeFile: 'system/menu/index',
      title: '菜单管理',
      icon: 'ant-design:menu-outlined',
      keepAlive: true,
      linkMode: '0',
      sort: 3,
      status: '1',
      createTime: new Date().toISOString(),
      updateTime: new Date().toISOString(),
    },
  ]
}
// #endregion
