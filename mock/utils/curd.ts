import type { FakeRoute } from 'vite-plugin-fake-server'
import type { BaseModel, WithPageParams } from '@/api/interface'
import { faker } from '@faker-js/faker'
import { filterByParams, joinURLs } from './index'
import { RF } from './response'

export function buildCURDRoutes<T extends BaseModel>(
  baseURL: string,
  collection: T[],
): FakeRoute[] {
  const routes: FakeRoute[] = [
    // #region 分页列表
    {
      method: 'get',
      url: 'page',
      response({ query }) {
        const { page, pageSize, ...otherParams } = query as WithPageParams<
          Record<string, any>
        >

        if (page == null || pageSize == null) {
          return RF.error('参数 page 和 pageSize 不能为空')
        }

        const filteredData = filterByParams(collection, otherParams)
        return RF.success({
          page,
          pageSize,
          total: filteredData.length,
          list: filteredData.slice((page - 1) * pageSize, page * pageSize),
        })
      },
    },
    // #endregion

    // #region 全部列表
    {
      method: 'get',
      url: 'list',
      response({ query }) {
        return RF.success(filterByParams(collection, query))
      },
    },
    // #endregion

    // #region 单个详情
    {
      method: 'get',
      url: ':id',
      response({ params }) {
        if (params.id == null) {
          return RF.error('缺失 id 参数')
        }
        return RF.success(collection.find(item => item.id === params.id))
      },
    },
    // #endregion

    // #region 新增数据
    {
      method: 'post',
      url: '',
      response({ body }) {
        collection.push({
          ...body,
          id: faker.string.uuid(),
          createTime: new Date().toISOString(),
          updateTime: new Date().toISOString(),
        } as T)
        return RF.success(null)
      },
    },
    // #endregion

    // #region 修改数据
    {
      method: 'put',
      url: '',
      response({ body }) {
        const item = collection.find(item => item.id === body.id)
        if (!item) {
          return RF.error('数据不存在')
        }
        Object.assign(item, body, {
          createTime: item.createTime,
          updateTime: new Date().toISOString(),
        })
        return RF.success(null)
      },
    },
    // #endregion

    // #region 删除数据
    {
      method: 'delete',
      url: ':id',
      response({ params }) {
        if (!params.id) {
          return RF.error('缺失 id 参数')
        }

        const idArray = params.id.toString().split(',')
        const newData = collection.filter(item => !idArray.includes(item.id))
        collection.length = 0
        collection.push(...newData)

        return RF.success(null)
      },
    },
    // #endregion
  ]

  return routes.map((route) => {
    route.url = joinURLs(baseURL, route.url)
    return route
  })
}
