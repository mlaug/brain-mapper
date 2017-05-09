var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',

  eventstore: {
    url: '"http://127.0.0.1:2113"'
  },

  knowledge: {
    url: '"http://127.0.0.1:8080"'
  },

  media: {
    image : {
      url : '"http://127.0.0.1:3000"'
    }
  }

})
