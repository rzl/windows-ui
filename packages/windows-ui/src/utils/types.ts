export type ComponentSize = 'large' | 'default' | 'small'

export interface ConfigProviderContext {
  prefix?: string
  size?: ComponentSize
  zIndex?: number
  locale?: string
}
