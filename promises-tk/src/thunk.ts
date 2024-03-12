/** Lazily evaluated promise */
export function thunkPromise<T>(get: () => Promise<T>): () => Promise<T> {
  let value: T | undefined
  return async () => {
    if (!value)
      value = await get()
    return value
  }
}