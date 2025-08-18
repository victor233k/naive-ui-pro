import type { FakeRoute } from 'vite-plugin-fake-server'
import { faker } from '@faker-js/faker'
import { orderBy } from 'lodash-es'
import { filterByParams, joinURLs } from './index'
import { RF } from './response'

export interface BaseModel {
  id: string
  createTime: string
  updateTime: string
}

export function buildCURDRoutes<T extends BaseModel>(
  baseURL: string,
  collection: T[],
): FakeRoute[] {
  const getOrderedCollection = () => orderBy(collection, ['updateTime'], ['desc'])

  const routes: FakeRoute[] = [
    // #region 分页列表
    {
      method: 'get',
      url: 'page',
      response({ query }) {
        const { page, pageSize, ...otherParams } = query as ApiUtil.WithPaginationParams<
          Record<string, any>
        >

        if (page == null || pageSize == null) {
          return RF.error('参数 page 和 pageSize 不能为空')
        }

        const filteredData = filterByParams(getOrderedCollection(), otherParams)
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
        return RF.success(filterByParams(getOrderedCollection(), query))
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
        return RF.error('演示环境，不支持删除！')
        // return RF.success(null)
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
        return RF.error('演示环境，不支持修改！')
        // Object.assign(item, body, {
        //   createTime: item.createTime,
        //   updateTime: new Date().toISOString(),
        // })
        // return RF.success(null)
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
        return RF.error('演示环境，不支持删除！')
        // const idArray = params.id.toString().split(',')
        // const newData = collection.filter(item => !idArray.includes(item.id))
        // collection.length = 0
        // collection.push(...newData)

        // return RF.success(null)
      },
    },
    // #endregion
  ]

  return routes.map((route) => {
    route.url = joinURLs(baseURL, route.url)
    return route
  })
}
