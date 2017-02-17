const test = require('tape')
const memo = require('../')

test('one argument function', (t) => {
  t.plan(3)

  function fn (arg, cb) {
    t.equal(arg, 'foo')
    cb(null, 'bar')
  }

  const memoFn = memo(fn)

  memoFn('foo', (err, result) => {
    t.error(err)
    t.equal(result, 'bar')
  })
})

test('one argument function, called twice', (t) => {
  t.plan(5)

  function fn (arg, cb) {
    t.equal(arg, 'foo')
    cb(null, 'bar')
  }

  const memoFn = memo(fn)

  memoFn('foo', (err, result) => {
    t.error(err)
    t.equal(result, 'bar')

    memoFn('foo', (err, result) => { // should be cached, so `fn` is not called again
      t.error(err)
      t.equal(result, 'bar')
    })
  })
})

test('two argument function, called twice', (t) => {
  t.plan(14)

  var called = 0
  function fn (arg1, arg2, cb) {
    called += 1
    if (called === 1) {
      t.equal(arg1, 'foo1')
      t.equal(arg2, 'foo2')
      cb(null, 'bar')
    } else if (called === 2) {
      t.equal(arg1, 'foo1')
      t.equal(arg2, 'baz')
      cb(null, 'new')
    } else if (called === 3) {
      t.equal(arg1, 'baz')
      t.equal(arg2, 'foo2')
      cb(null, 'new2')
    } else if (called === 4) {
      t.fail('fn should not be called 4 times')
    }
  }

  const memoFn = memo(fn)

  memoFn('foo1', 'foo2', (err, result) => {
    t.error(err)
    t.equal(result, 'bar')

    memoFn('foo1', 'foo2', (err, result) => { // should be cached, so `fn` is not called again
      t.error(err)
      t.equal(result, 'bar')

      memoFn('foo1', 'baz', (err, result) => { // should not be cached, since one arg changed
        t.error(err)
        t.equal(result, 'new')

        memoFn('baz', 'foo2', (err, result) => { // should not be cached, since one arg changed
          t.error(err)
          t.equal(result, 'new2')
        })
      })
    })
  })
})
