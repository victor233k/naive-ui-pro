import { isArray, isString, toString } from 'lodash-es'

/**
 * 拼接 URL
 * @param baseURL 接口基路经
 * @param relativeURLs 一个或多个相对路径
 * @returns 拼接后的接口路径
 *
 * @example
 * ```ts
 * const url = joinURLs('/user', '/list')
 * // => '/user/list'
 * ```
 */
export function joinURLs(baseURL: string, ...relativeURLs: string[]) {
  return relativeURLs
    .filter(Boolean)
    .reduce(
      (base, relative) =>
        `${base.replace(/\/+$/, '')}/${relative.replace(/^\/+/, '')}`,
      baseURL,
    )
}

/**
 * 简版的根据参数过滤数据
 *
 * @param data - 数据源，对象数组
 * @param params - 参数对象，仅支持浅层过滤，深层仅支持值类型数组
 * @returns 过滤后的数据
 *
 * @example
 * ```ts
 * const data = [
 *   { id: 1, name: '张三', age: 18 },
 *   { id: 2, name: '李四', age: 19 },
 *   { id: 3, name: '王五', age: 20 },
 * ]
 *
 * filterByParams(data, { name: '三', age: 18 })
 * ```
 */
// eslint-disable-next-line ts/no-empty-object-type
export function filterByParams<T extends {}>(
  data: T[],
  params: Record<string, any>,
): T[] {
  return data.filter((item) => {
    return Object.keys(params).every(
      key => !(key in item) || filter(item[key as keyof T], params[key]),
    )
  })

  function filter(value: any, params: any) {
    if (params == null) {
      return true
    }
    if (isString(params)) {
      return toString(value).toLowerCase().includes(params.toLowerCase())
    }
    if (isArray(params)) {
      params = params.filter(v => v != null && v !== '')
      return params.length === 0 || params.some((param: any) => filter(value, param))
    }
    return value === params
  }
}
