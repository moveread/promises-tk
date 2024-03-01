export type ManagedPromise<T> = Promise<T> & {
  resolve(x: T): void
  reject(): void
}

/** A promise with methods to resolve/reject it
 * 
 * ```javascript
 * const loaded = managedPromise()
 * img.onload = () => loaded.resolve()
 * img.src = '...'
 * await loaded
 * ```
 */
export function managedPromise<T = void>() {
  let resolve: (x: T) => void = () => {}
  let reject: () => void = () => {}
  const promise = new Promise<T>((rs, rj) => { resolve = rs; reject = rj })
  return Object.assign(promise, { resolve, reject})
}