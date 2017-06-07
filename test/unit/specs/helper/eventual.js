let objToObserve, keyToObserve

let timeout = 2000

export default {

  waitFor(obj, key) {
    objToObserve = obj
    keyToObserve = key
    return this
  },

  toBe(finalState) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject("timeout waiting for param to become " + finalState)
      }, timeout)
      setInterval(() => {
        if ( objToObserve[keyToObserve] === finalState )
          resolve()
      }, 100)
    })
  }

}
