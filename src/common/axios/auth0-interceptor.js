export const auth0RequestSuccessInterceptor = function (axiosConfig) {

  let validUrl = [process.env.knowledge.url, process.env.media.image.url].filter((url) => {
    return axiosConfig.url.startsWith(url)
  })

  if ( validUrl.length > 0 ) {
    let token = localStorage.getItem('access_token')
    if ( token === null )
      throw new Error("no token present!")
    axiosConfig = axiosConfig || {}
    axiosConfig.headers = axiosConfig.headers || {}
    axiosConfig.headers.Authorization = "Bearer: " + token
  }

  return axiosConfig
}

export const auth0RequestErrorInterceptor = function (error) {
  return Promise.reject(error);
}
