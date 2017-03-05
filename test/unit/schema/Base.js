import test from "ava"

import isFunction from "lodash.isfunction"

import Base from "schema/Base"

test(
  "Should have overwritten \"inspect\", \"toString\" and \"valueOf\" methods",
  t => {
    const base = new Base()

    t.true(isFunction(base.inspect))
    t.true(isFunction(base.toString))
    t.true(isFunction(base.valueOf))

    t.is(base.inspect(), "ParaspriteBase", "Should return a valid string")
    t.is(base.toString(), "ParaspriteBase", "Should return a valid string")
    t.is(base.valueOf(), "ParaspriteBase", "Should return a valid string")
  }
)