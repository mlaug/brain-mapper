module.exports = {
  NODE_ENV: '"production"',

  auth: {
    callback: '"https://d2okb46agr3hfe.cloudfront.net/callback"'
  },

  eventstore: {
    url: '"http://eventstore.bulbs.7dde450f.svc.dockerapp.io:2113"'
  },

  knowledge: {
    url: '"http://knowledge.bulbs.4fa60b1c.svc.dockerapp.io:9000"'
  },

  media: {
    image: {
      url: '"http://image-upload.bulbs.0fb11f39.svc.dockerapp.io:3000"'
    }
  }

}
