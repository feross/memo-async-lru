/*! memo-async-lru. MIT License. Feross Aboukhadijeh <https://feross.org/opensource> */
'use strict'

module.exports = memoAsyncLRU

const AsyncLRU = require('async-lru')

function memoAsyncLRU (load, opts) {
  opts = Object.assign({
    max: 100,
    maxAge: 60 * 60 * 1000 // 1 hour
  }, opts)

  const cache = new AsyncLRU({
    max: opts.max,
    maxAge: opts.maxAge,
    load: load
  })

  return loadWithCache

  function loadWithCache (...args) {
    if (args.length < 2) {
      throw new Error('Must be called with at least 2 arguments')
    } else if (args.length === 2) {
      const key = args[0]
      const cb = args[1]
      if (typeof key === 'string') {
        cache.get(key, cb)
      } else {
        cache.get(JSON.stringify(key), key, cb)
      }
    } else {
      const loadArgs = args.slice(0, args.length - 1)
      const cb = args[args.length - 1]
      const key = loadArgs.map(arg => {
        return (typeof arg === 'string') ? arg : JSON.stringify(arg)
      }).join('~')
      cache.get(key, loadArgs, cb)
    }
  }
}
