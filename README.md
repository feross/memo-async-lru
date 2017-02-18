# memo-async-lru [![travis][travis-image]][travis-url] [![npm][npm-image]][npm-url] [![downloads][downloads-image]][downloads-url]

[travis-image]: https://img.shields.io/travis/feross/memo-async-lru/master.svg
[travis-url]: https://travis-ci.org/feross/memo-async-lru
[npm-image]: https://img.shields.io/npm/v/memo-async-lru.svg
[npm-url]: https://npmjs.org/package/memo-async-lru
[downloads-image]: https://img.shields.io/npm/dm/memo-async-lru.svg
[downloads-url]: https://npmjs.org/package/memo-async-lru

### Memoize Node.js style callback-last functions, using an in-memory LRU store

Also works in the browser with [browserify](http://browserify.org/)!

## install

```
npm install memo-async-lru
```

## usage

```js
const memo = require('memo-async-lru')

function fn (arg, cb) {
  t.equal(arg, 'foo')
  cb(null, 'bar')
}

const memoFn = memo(fn)

memoFn('foo', (err, result) => {
  console.log(result) // prints 'bar'

  memoFn('foo', (err, result) => {
    console.log(result) // prints 'bar', cached, does not call fn()
  })
})
```

## API

### `memo(fn, [opts])`

Memoize the given function `fn`, using
[`async-lru`](https://www.npmjs.com/package/), a simple async LRU cache supporting
O(1) set, get and eviction of old keys.

The function must be a Node.js style function, where the last argument is a callback.

  function(key: Object, [...], fetch: function(err: Error, value: Object))

So, if you were to do:

```js
const readFile = memo(fs.readFile)
readFile('file.txt', fn)
readFile('file.txt', fn) // <-- this uses the cache
```

The file would only be read from disk once, it's value cached, and returned
anytime the first argument is 'file.txt'.

Repeated calls to the function with the same first argument will return a
cached value, rather than re-fetch the data.

Optionally, an `opts` parameter can be specified with the following properties:
Optional options:

```js
{
  max: maxElementsToStore,
  maxAge: maxAgeInMilliseconds
}
```

If you pass `max`, items will be evicted if the cache is storing more than `max` items.
If you pass `maxAge`, items will be evicted if they are older than `maxAge` when you access them.

## license

MIT. Copyright (c) [Feross Aboukhadijeh](http://feross.org).
