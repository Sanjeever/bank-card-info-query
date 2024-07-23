const defaultCache = new Map<string, any>()

export const cache = {
  get<T>(key: string): T | undefined {
    return defaultCache.get(key)
  },
  set(key: string, value: any) {
    defaultCache.set(key, value)
  },
  del(key: string) {
    defaultCache.delete(key)
  },
}
