const fs = require('fs')
const fetch = require('fetch').fetchUrl

const main = function(scenexe2) {
  let options = {
    parentPort: {
      postMessage: function() {}
    },
    port: 3000,
    testing: 1,
    start: `load('./dim-abyss.js')`,
    secret: {
      p1: 'access-p1',
      p2: 'access-p2'
    },
    standalone: 1
  }
  let data = scenexe2.run(options)
  data.dimension.dims.test.gleaming = 1
}

fetch('https://beta-scenexe2.glitch.me/scenexe2.js', function(a, b, c) {
  let __module__ = {
    exports: {}
  }
  let s = c.toString().replace(`module`, `__module__`)
  eval(s)
  main(__module__.exports)
})