import { defineFakeRoute } from 'vite-plugin-fake-server/client'

const users = [
  {
    username: 'super',
    password: '123456',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJzdXBlciIsImV4cCI6MTczMjI0MzYyNn0.super',
    roles: ['super'],
    name: 'Super',
    codes: ['1001', '1002', '1003', '1004'],
  },
  {
    username: 'admin',
    password: '123456',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJhZG1pbiIsImV4cCI6MTczMjI0MzYyNn0.admin',
    roles: ['admin'],
    name: 'Admin',
    codes: ['1003'],
  },
  {
    username: 'user',
    password: '123456',
    token: 'eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJ1c2VyIiwiZXhwIjoxNzMyMjQzNjI2fQ.user',
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

export default defineFakeRoute([
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
])
