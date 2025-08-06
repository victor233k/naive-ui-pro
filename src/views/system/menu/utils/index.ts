import type { Api } from '../index.api'

export type TreeNode<T extends Pick<Api.Model, 'id' | 'parentId'> = Api.Model>
  = T & { children?: TreeNode<T>[] }

export function buildTree<T extends Pick<Api.Model, 'id' | 'parentId'>>(
  data: T[],
) {
  const result: TreeNode<T>[] = []
  const map = new Map<string, TreeNode<T>>()

  data.forEach(item => map.set(item.id, { ...item, children: [] }))

  data.forEach((item) => {
    const node = map.get(item.id)!
    if (item.parentId && map.has(item.parentId)) {
      const parent = map.get(item.parentId)!
      parent.children!.push(node)
    }
    else {
      result.push(node)
    }
  })

  return result
}
