import axios from 'axios'
import {eventstoreInterval, eventstoreProcessor, eventstoreQueue, STORAGE_KEY} from '@/store/plugins/eventstore.js'

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

  it('should be able to process an event and send it to the event store backend and remove from queue', (done) => {

    const event = {
      event: "addBulb",
      payload: {
        title: "mybulb"
      },
      uid: "C322E299-CB73-4B47-97C5-5054F920746E"
    }

    const event2 = {
      event: "addBulb",
      payload: {
        title: "mybulb"
      },
      uid: "C322E299-CB73-4B47-97C5-5054F920746F"
    }

    const storageSetItemSpy = sandbox.spy(window.localStorage, "setItem")
    const storageGetItemStub = sandbox.stub(window.localStorage, "getItem")
    storageGetItemStub.returns(JSON.stringify([event, event2]))

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

    setImmediate(() => {
      sinon.assert.calledOnce(storageGetItemStub)
      sinon.assert.calledOnce(storageSetItemSpy)
      sinon.assert.calledWith(storageSetItemSpy, STORAGE_KEY, JSON.stringify([event2]))
      done()
    })

  })

  it('should leave elements in the queue if they cannot be processed', (done) => {
    const event = {
      event: "addBulb",
      payload: {
        title: "mybulb"
      },
      uuid: "C322E299-CB73-4B47-97C5-5054F920746E"
    }
    const storageSetItemSpy = sandbox.spy(window.localStorage, "setItem")
    const storageGetItemStub = sandbox.spy(window.localStorage, "getItem")

    const axiosPostStub = sandbox.stub(axios, "post", () => {
      return Promise.reject()
    })

    eventstoreProcessor(event)

    setImmediate(() => {
      sinon.assert.calledOnce(axiosPostStub)
      sinon.assert.notCalled(storageGetItemStub)
      sinon.assert.notCalled(storageSetItemSpy)
      done()
    })

  })

  it('should through the elements into the processor by FIFO', () => {
    let events = []
    events.push(1)
    events.push(2)
    const storageGetItemStub = sandbox.stub(window.localStorage, "getItem", () => {
      return JSON.stringify(events)
    })
    eventstoreInterval(function (event) {
      expect(event).to.be.equal(1)
    })
  })

})
