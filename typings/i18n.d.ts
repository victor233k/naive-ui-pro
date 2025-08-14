import type {
  I18nKeyPath as _I18nKeyPath,
  IsI18nKey as _IsI18nKey,
  MaybeI18nKeyPath as _MaybeI18nKeyPath,
  Translate as _Translate,
} from '@/locales/locales'

declare global {
  export type I18nKeyPath = _I18nKeyPath
  export type IsI18nKey<K> = _IsI18nKey<K>
  export type MaybeI18nKeyPath = _MaybeI18nKeyPath
  export type Translate<K extends MaybeI18nKeyPath> = _Translate<K>
}

export {}
