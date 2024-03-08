export type ManagedPromise<T> = Promise<T> & {
  resolve(x: T): void
  reject(reason?: any): void
} & State<T>

export type State<T> = {
  status: 'pending'
} | {
  status: 'resolved'
  value: T
} | {
  status: 'rejected'
  reason?: any
}

/** A promise with methods to resolve/reject it + direct access to its state
 * 
 * ```javascript
 * const loaded = managedPromise()
 * img.onload = () => loaded.resolve()
 * img.src = '...'
 * await loaded
 * ```
 */
export function managedPromise<T = void>(): ManagedPromise<T> {
  let resolve: (x: T) => void = () => {}
  let reject: (reason?: any) => void = () => {}
  let state: State<T> = { status: 'pending' }
  const promise = new Promise<T>((rs, rj) => {
    resolve = value => { state = { status: 'resolved', value }; rs(value) }
    reject = reason => { state = { status: 'rejected', reason }; rj(reason) }
  })
  return Object.assign(promise, { resolve, reject, ...state })
}
