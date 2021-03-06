import {isFunction} from "util"

import invariant from "@octetstream/invariant"

import proxy from "helper/decorator/proxy"
import apply from "helper/proxy/selfInvokingClass"
import toListTypeIfNeeded from "helper/util/toListTypeIfNeeded"
import toRequiredTypeIfNeeded from "helper/util/toRequiredTypeIfNeeded"

import Base from "lib/Base"

/**
 * Implements resolver field on GraphQLObjectType
 *
 * @api private
 */
@proxy({apply})
class Resolver extends Base {
  constructor(cb) {
    super(null, null, cb)

    this.__resolve = null
    this.__arguments = {}
  }

  __setHandler = (kind, handler) => {
    const ref = `${kind.charAt(0).toUpperCase()}${kind.slice(1)}`

    invariant(
      isFunction(this[`__${kind}`]),
      "%s handler already exists. " +
      "Add this resolver to current object type " +
      "before describe the new one.", ref
    )

    invariant(
      !isFunction(handler), TypeError, "%s handler should be a function.", ref
    )

    this[`__${kind}`] = handler

    return this
  }

  /**
   * Define resolver handler
   *
   * @param {function} handler
   *
   * @return {Resolver}
   */
  resolve = handler => this.__setHandler("resolve", handler)

  subscribe = handler => this.__setHandler("subscribe", handler)

  /**
   * Define arguments for resolver handler
   *
   * @param {string} name – argument name
   * @param {object} type – argument *input* type
   * @param {boolean} required
   *
   * @return {Resolver}
   */
  arg = (name, type, required, defaultValue) => {
    type = toRequiredTypeIfNeeded(toListTypeIfNeeded(type), required)

    this.__arguments[name] = {
      type
    }

    if (defaultValue !== undefined) {
      this.__arguments[name].defaultValue = defaultValue
    }

    return this
  }

  /**
   * Add resolver object
   */
  end() {
    return super.end({
      resolve: this.__resolve,
      args: this.__arguments
    })
  }
}

export default Resolver
