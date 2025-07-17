import type { MockMethod } from 'vite-plugin-mock'
import { faker } from '@faker-js/faker'

const users = [
  {
    username: 'super',
    password: '123456',
    token: faker.string.uuid(),
    roles: ['super'],
    name: 'Super',
    codes: ['1001', '1002', '1003', '1004'],
  },
  {
    username: 'admin',
    password: '123456',
    token: faker.string.uuid(),
    roles: ['admin'],
    name: 'Admin',
    codes: ['1003'],
  },
  {
    username: 'user',
    password: '123456',
    token: faker.string.uuid(),
    roles: ['user'],
    name: 'User',
    codes: [],
  },
]

function createSuccessResponse(data: any) {
  return {
    data,
    code: 200,
    message: 'success',
  }
}

function createErrorResponse(message: string) {
  return {
    message,
    code: 201,
    data: null,
  }
}

function isInvalidToken(token: string) {
  return !token || !users.some(user => user.token === token)
}

export default [
  {
    url: '/user/login',
    method: 'post',
    response: ({ body }) => {
      const user = users.find(user => user.username === body.username && user.password === body.password)
      if (!user) {
        return createErrorResponse('用户名或密码错误')
      }
      return createSuccessResponse({ token: user.token })
    },
  },
  {
    url: '/user/info',
    method: 'get',
    response: ({ headers }) => {
      const token = (headers.authorization ?? '').slice(7)
      if (isInvalidToken(token)) {
        return createErrorResponse('token 无效')
      }
      const user = users.find(user => user.token === token)
      if (!user) {
        return createErrorResponse('用户名或密码错误')
      }
      return createSuccessResponse({
        name: user.name,
        roles: user.roles,
        codes: user.codes,
      })
    },
  },
] as MockMethod[]
