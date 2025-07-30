import type { FakeRoute } from 'vite-plugin-fake-server'
import type { BaseModel, WithPageParams } from '@/api/interface'
import { filterByParams, joinURLs } from './index'
import { RF } from './response'

export interface CURD<T extends object> {
  baseURL: string
  data: T[]
  routes: FakeRoute[]
}

export function buildCURD<T extends BaseModel>(
  baseURL: string,
  idGenerator: () => string,
): CURD<T> {
  const data: T[] = []
  const routes: FakeRoute[] = [
    // #region 分页列表
    {
      method: 'get',
      url: 'page',
      response({ query }) {
        const {
          page = 1,
          pageSize = 20,
          ...otherParams
        } = query as WithPageParams<Record<string, any>>
        const filteredData = filterByParams(data, otherParams)
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
        return RF.success(filterByParams(data, query))
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
        return RF.success(data.find(item => item.id === params.id))
      },
    },
    // #endregion

    // #region 新增数据
    {
      method: 'post',
      url: '',
      response({ body }) {
        data.push({
          ...body,
          id: idGenerator(),
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
        const item = data.find(item => item.id === body.id)
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
        const newData = data.filter(item => !idArray.includes(item.id))
        data.length = 0
        data.push(...newData)

        return RF.success(null)
      },
    },
    // #endregion
  ]
  return {
    baseURL,
    data,
    routes: routes.map((route) => {
      route.url = joinURLs(baseURL, route.url)
      return route
    }),
  }
}
