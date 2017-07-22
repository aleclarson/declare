'use strict'

const assertType = require('assertType')
const Either = require('Either')
const isType = require('isType')

const forEach = [].forEach

function declare(getConstructor) {
  const constructor = getConstructor.call(helpers, init, inherit)
  const decl = new Declaration(constructor)
  return decl

  function init(inst, args) {
    if (!decl._values) {
      return
    } 
    decl._values.forEach(values => {
      if (isType(values, Function)) {
        values = values.apply(inst, args)
      }
      if (!isType(values, Object)) {
        return
      }
      Object.keys(values).forEach(key => {
        if (values[key] === undefined) {
          return
        }
        if (key[0] === '_') {
          Object.defineProperty(inst, key, {
            value: values[key]
          })
        } else {
          inst[key] = values[key]
        }
      })
    })
  }

  function inherit(inst, args) {
    decl._kind.apply(inst, args)
  }
}

class Declaration {
  constructor(ctr) {
    this._ctr = ctr
    this._values = null
    this._methods = []
  }
  inherit(ctr) {
    assertType(ctr, Function)
    this._kind = ctr
  }
  define(values) {
    assertType(values, Either(Object, Function))
    if (!this._values) {
      this._values = [values]
    } else {
      this._values.push(values)
    }
  }
  extend(methods) {
    assertType(methods, Object)
    this._methods.push(methods)
  }
  build() {
    const ctr = this._ctr
    this._methods.forEach(methods => {
      Object.keys(methods).forEach(key => {
        Object.defineProperty(ctr.prototype, key, {
          value: methods[key]
        })
      })
    })
    if (this._kind) {
      Object.setPrototypeOf(ctr.prototype, this._kind.prototype)
    }
    return ctr
  }
}

// Used as the context when creating a constructor.
const helpers = {
  args() {
    const types = []
    forEach.call(arguments, (type) => {
      types.push(type) 
    })
    return (args) => {
      let index = -1
      while (++index < types.length) {
        if (types[index]) {
          assertType(args[index], types[index], `args[${index}]`)
        }
      }
    }
  },
  options(types) {
    assertType(types, Object)
    return (options) => {
      if (isType(options, Object)) {
        Object.keys(types).forEach(key => {
          assertType(options[key], types[key], key)
        })
      }
    }
  }
}

module.exports = declare

