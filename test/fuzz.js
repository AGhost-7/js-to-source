const assert = require('assert').strict
const vm = require('vm')
const toSource = require('../index')

// This takes too long to run (tests 200 billion combinations). Only execute if
// pen testing it, don't run in the CI.
describe.skip('fuzz', () => {
  it('doesnt explode', () => {
    for (let a = 0; a < 6000; a++) {
      for (let b = 0; b < 6000; b++) {
        for (let c = 0; c < 6000; c++) {
          const input =
            String.fromCharCode(a) +
            String.fromCharCode(b) +
            String.fromCharCode(c)
          let result
          try {
            result = vm.runInNewContext(toSource(input))
          } catch (err) {
            const message = `Failed on input char codes: ${a} - ${b} - ${c}\n${
              err.message
            }`
            err.message = message
            throw err
          }
          assert.equal(input, result)
        }
      }
    }
  })
})
