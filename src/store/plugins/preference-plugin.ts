import type { Pinia, PiniaPluginContext, Store } from 'pinia'
import { useClipboard, useEventListener } from '@vueuse/core'
import { cloneDeep, get, has, set } from 'lodash-es'

declare module 'pinia' {
  // eslint-disable-next-line unused-imports/no-unused-vars
  export interface DefineStoreOptionsBase<S, Store> {
    preference?: {
      /**
       *
       */
      pick: [string[], string]
    }
  }

  export interface PiniaCustomProperties {
    /**
     * 重置所有 store 的偏好
     */
    $resetAllPreference: () => void
    /**
     * 复制所有 store 的偏好到剪贴板
     */
    $copyAllPreference: () => void
  }
}

const { copy } = useClipboard()
let registedBeforeunloadEvent = false
const storeIdToKeysInitialValueRecord = new Map<string, {
  prefixPath: string
  initialValueMap: Map<string, any>
}>()

export function preferencePlugin({ pinia, options, store }: PiniaPluginContext) {
  if (options.preference) {
    const { pick } = options.preference
    const [keys, prefixPath] = pick
    keys.forEach((key) => {
      if (!has(store, key)) {
        return
      }
      if (!storeIdToKeysInitialValueRecord.has(store.$id)) {
        storeIdToKeysInitialValueRecord.set(store.$id, {
          prefixPath,
          initialValueMap: new Map(),
        })
      }
      storeIdToKeysInitialValueRecord
        .get(store.$id)!
        .initialValueMap
        .set(key, cloneDeep(store[key]))
      const finalValue = getPreferenceFromStorage(`${prefixPath}.${key}`, store[key])
      store[key] = finalValue
    })
  }
  store.$resetAllPreference = () => {
    const storeMap = (pinia as any)._s as Map<string, Store>
    storeMap.forEach((s) => {
      if (!storeIdToKeysInitialValueRecord.has(s.$id)) {
        return
      }
      const { initialValueMap } = storeIdToKeysInitialValueRecord.get(s.$id)!
      initialValueMap.forEach((value, key) => {
        (s as any)[key] = value
      })
    })
  }
  store.$copyAllPreference = () => {
    const preferences = getAllPreference(pinia)
    copy(JSON.stringify(preferences, null, 2))
  }

  if (!registedBeforeunloadEvent) {
    registedBeforeunloadEvent = true
    useEventListener('beforeunload', () => {
      localStorage.setItem('preference', JSON.stringify(getAllPreference(pinia)))
    })
  }
}

function getAllPreference(pinia: Pinia) {
  const preferences = {} as any
  const storeMap = (pinia as any)._s as Map<string, Store>
  storeMap.forEach((s) => {
    if (!storeIdToKeysInitialValueRecord.has(s.$id)) {
      return
    }
    const {
      prefixPath,
      initialValueMap,
    } = storeIdToKeysInitialValueRecord.get(s.$id)!
    initialValueMap.forEach((_, key) => {
      set(preferences, `${prefixPath}.${key}`, (s as any)[key])
    })
  })
  return preferences
}

function getPreferenceFromStorage(key: string, fallback: any) {
  const preference = localStorage.getItem('preference')
  if (preference) {
    const parsedPreference = JSON.parse(preference)
    return get(parsedPreference, key, fallback)
  }
  return fallback
}
