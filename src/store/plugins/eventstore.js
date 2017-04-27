import axios from 'axios'
import uuid from '../../common/uuid'

export const STORAGE_KEY = 'eventStoreQueue'

export const eventstoreProcessor = (event) => {
  axios.post(process.env.eventstore.url + '/streams/knowledge', event.payload, {
    headers: {
      "ES-EventType": event.event,
      "ES-EventId": event.uid
    }
  }).then(response => {
    let queue = JSON.parse(window.localStorage.getItem(STORAGE_KEY))
    let queueWithoutProcessedElement = queue.filter((item) => {
      return item.uid != event.uid
    })
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queueWithoutProcessedElement))
  }).catch(response => {

  })
}

export const eventstoreQueue = (mutation) => {
  if ( ["addBulb"].includes(mutation.type) ) {
    const event = {
      uid: uuid(),
      event: mutation.type,
      payload: mutation.payload
    }

    let queue = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
    queue.push(event)
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(queue))
  }
}

export const Eventstore = store => {
  store.subscribe((mutation, state) => {
    eventstoreQueue(mutation)
  })
}

export const eventstoreIntervalTick = (callback) => {
  let queue = JSON.parse(window.localStorage.getItem(STORAGE_KEY)) || []
  if (queue.length > 0) callback(queue.shift())
}

setInterval(() => {
  eventstoreIntervalTick(eventstoreProcessor)
}, 1000)
