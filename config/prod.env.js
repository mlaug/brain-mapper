module.exports = {
  NODE_ENV: '"production"',

  auth: {
    callback: '"http://brain-mapper.s3-website.eu-central-1.amazonaws.com/callback"'
  },

  eventstore: {
    url: '"http://eventstore-25f46711.e084dea4.svc.dockerapp.io:2113"'
  },

  knowledge: {
    url: '"http://brain-0a93d78e.34c51afa.svc.dockerapp.io"'
  },

  media: {
    image: {
      url: '"http://brain-media-upload-45ebe617.f345241d.svc.dockerapp.io"'
    }
  }

}
