import {auth0RequestSuccessInterceptor, auth0RequestErrorInterceptor} from '@/common/axios/auth0-interceptor'

describe('auth0-interceptor', () => {

  beforeEach(function () {
    localStorage.clear()
  });

  it('should set token in header if present', () => {
    localStorage.setItem('access_token', "secret-token")
    let config = auth0RequestSuccessInterceptor({
      url: process.env.knowledge.url,
    })
    expect(config.headers.Authorization).to.be.defined
    expect(config.headers.Authorization).to.be.equal("Bearer: secret-token")
  })

  it('should not overwrite headers and other keys of config if present', () => {
    localStorage.setItem('access_token', "secret-token")
    let config = auth0RequestSuccessInterceptor({
      url: process.env.knowledge.url,
      headers : {
        "header1": "samson"
      },
      key1: "tiffy"
    })
    expect(config.headers.Authorization).to.be.defined
    expect(config.headers.Authorization).to.be.equal("Bearer: secret-token")
    expect(config.headers.header1).to.be.equal("samson")
    expect(config.key1).to.be.equal("tiffy")
  })

  it('should throw an error if no token is present', () => {
    expect(auth0RequestSuccessInterceptor.bind(auth0RequestSuccessInterceptor, {
      url: process.env.knowledge.url,
    })).to.throw("no token present!")
  })

  it('should not react on other api but defined ones', () => {
    localStorage.setItem('access_token', "secret-token")
    let config = auth0RequestSuccessInterceptor({
      url: "any wrong url",
    })
    expect(config.headers).to.be.not.defined
  })

})
