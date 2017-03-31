import axios from 'axios'
import {eventstoreProcessor, eventstoreQueue, STORAGE_KEY} from '@/store/plugins/eventstore.js'

describe('event store', () => {

  let sandbox

  beforeEach(function () {
    window.localStorage.clear()
    sandbox = sinon.sandbox.create()
  });

  afterEach(function () {
    sandbox.restore()
  })

  it('should be able to add an event to the queue and store it in the local storage to recover reload', () => {
    const storageSetItemSpy = sandbox.spy(window.localStorage, "setItem")
    const storageGetItemSpy = sandbox.spy(window.localStorage, "getItem")
    eventstoreQueue({type: "addSomething", payload: "samson"})
    sinon.assert.calledOnce(storageGetItemSpy)
    sinon.assert.calledOnce(storageSetItemSpy)

  })

  it('should be able to process an event and send it to the event store backend and remove from queue', () => {
    const event = {
      event: "addBulb",
      payload: {
        title: "mybulb"
      },
      uid: "C322E299-CB73-4B47-97C5-5054F920746E"
    }
    const event2 = Object.assign({
      uid: "C322E299-CB73-4B47-97C5-5054F920746F"
    }, event)
    const storageSetItemSpy = sandbox.spy(window.localStorage, "setItem")
    const storageGetItemStub = sandbox.stub(window.localStorage, "getItem", () => {
      return [event, event2]
    })

    const axiosPostStub = sandbox.stub(axios, "post", () => {
      return Promise.resolve()
    })

    eventstoreProcessor(event)
    sinon.assert.calledOnce(axiosPostStub)

    sinon.assert.calledWith(axiosPostStub, sinon.match.any, event.payload, {
      headers: {
        "ES-EventType": event.event,
        "ES-EventId": event.uid
      }
    })

    sinon.assert.calledOnce(storageGetItemStub)
    sinon.assert.calledOnce(storageSetItemSpy)
    sinon.assert.calledWith(storageSetItemSpy, JSON.stringify([event2]))

  })

  it('should leave elements in the queue if they cannot be processed', () => {
    const event = {
      event: "addBulb",
      payload: {
        title: "mybulb"
      },
      uuid: "C322E299-CB73-4B47-97C5-5054F920746E"
    }
    const storageSetItemSpy = sandbox.spy(window.localStorage, "setItem")
    const storageGetItemStub = sandbox.stub(window.localStorage, "getItem")

    let promise = Promise.reject()
    const axiosPostStub = sandbox.stub(axios, "post", () => {
      return promise
    })

    eventstoreProcessor(event)
    sinon.assert.calledOnce(axiosPostStub)
    sinon.assert.notCalled(storageGetItemStub)
    sinon.assert.notCalled(storageSetItemSpy)

  })

})
