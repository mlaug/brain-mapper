import axios from 'axios'

export const STORAGE_KEY = 'eventStoreQueue'

// for testing
if (navigator.userAgent.indexOf('PhantomJS') > -1) {
  window.localStorage.clear()
}

function b(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b)
}

const uuid = function (a) {
  return a           // if the placeholder was passed, return
    ? (              // a random number from 0 to 15
      a ^            // unless b is 8,
      Math.random()  // in which case
      * 16           // a random number from
      >> a / 4         // 8 to 11
    ).toString(16) // in hexadecimal
    : (              // or otherwise a concatenated string:
      [1e7] +        // 10000000 +
      -1e3 +         // -1000 +
      -4e3 +         // -4000 +
      -8e3 +         // -80000000 +
      -1e11          // -100000000000,
    ).replace(     // replacing
      /[018]/g,    // zeroes, ones, and eights with
      b            // random hex digits
    )
}

export const eventstoreProcessor = (event) => {
  // TODO: make configurable
  axios.post('http://127.0.0.1:2113/streams/knowledge', event.payload, {
    headers: {
      "ES-EventType": event.event,
      "ES-EventId": event.uid
    }
  }).then(response => {
    let queue = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    let queueWithoutProcessedElement = queue.filter((item) => {
      console.log( item.uid != event.uid)
      return item.uid != event.uid
    })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queueWithoutProcessedElement))
  }).catch(response => {
    console.log("Something went wrong while storing the event to the event store in the backend")
  })
}

export const eventstoreQueue = (mutation) => {

  const event = {
    uid: uuid(),
    event: mutation.type,
    payload: mutation.payload
  }

  let queue = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  queue.push(event)
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))

}

export const Eventstore = store => {
  store.subscribe((mutation, state) => {
    eventstoreQueue(mutation)
  })
}

setInterval(() => {
  let queue = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  if ( queue.length > 0 ) eventstoreProcessor(queue.shift())
}, 5000)
