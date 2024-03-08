import { managedPromise } from "./managed-promise"

export type ManagedAsyncIterable<T> = AsyncIterableIterator<T> & {
  push(value: T): void
  end(): void
  ended: boolean
}

/** An `AsyncIterable` with methods to push data and end it
 * 
 * 
 * Example scenario with web workers:
 * ```javascript
 * const results = managedAsync()
 * worker.onmessage = e => {
 *    if (e.data === null)
 *      results.end()
 *    else
 *      results.push(e.data)
 * }
 * worker.postMessage(...)
 * 
 * for await (const x of results) {
 *  m...
 * }
 * ```
 */
export function managedAsync<T>(): ManagedAsyncIterable<T> {
  let xs: T[] = []
  let ended = false
  let nextPromise = managedPromise<void>()

  async function next(): Promise<IteratorResult<T>> {
    if (xs.length > 0) {
      const value = xs.shift() as T
      return { value, done: false }
    }
    else if (ended) {
      return { value: undefined, done: true }
    }
    else {
      await nextPromise
      nextPromise = managedPromise()
      return next()
    }
  }

  function push(value: T) {
    xs.push(value)
    if (nextPromise.status === 'pending')
      nextPromise.resolve()
  }

  function end() {
    ended = true
    if (nextPromise.status === 'pending')
      nextPromise.resolve()
  }

  return {
    next, push, end, ended,
    [Symbol.asyncIterator]() {
      return this;
    }
  }
}
