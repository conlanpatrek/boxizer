let Boxizer = require("../dist/boxizer").Boxizer
let cloop = require('cloop')

jest.mock('cloop')

const mockRect = (w, h, l, t) => ({
  width: w,
  height: h,
  left: l,
  top: t,
  right: l + w,
  bottom: t + h
})
const mockElement = (w, h, l, t) => ({
  rect: mockRect(w, h, l, t),
  getBoundingClientRect() { return this.rect; }
})

describe('Boxizer', () => {
  let boxizer
  let element
  let handler
  beforeEach(() => {
    element = mockElement(100, 100, 0, 0)
    boxizer = new Boxizer()
    handler = jest.fn()
    jest.resetAllMocks()
  })

  it('starts with an empty subscription list', () => {
    expect(boxizer._subscriptions.length).toBe(0)
  })

  describe('subscribe', () => {
    it('adds a subscription to the list', () => {
      boxizer.subscribe(element, handler)
      expect(boxizer._subscriptions.length).toBe(1)
    })

    it('returns a function that destroys that subscription', () => {
      let unsubscribe = boxizer.subscribe(element, handler)
      unsubscribe()
      expect(boxizer._subscriptions.length).toBe(0)
    })

    it('starts the loop if it hasn\'t been started', () => {
      expect(cloop.loop).not.toHaveBeenCalled()
      boxizer.subscribe(element, handler)
      expect(cloop.loop).toHaveBeenCalledWith(boxizer.tick)
    })
  })

  describe('removeHandler', () => {
    let stopLoop
    beforeEach(() => {
      stopLoop = jest.fn()
      cloop.loop.mockReturnValue(stopLoop)
      boxizer.subscribe(element, handler)
    })

    it('removes a subscription from the list by its handler', () => {
      boxizer.removeHandler(handler)
      expect(boxizer._subscriptions.length).toBe(0)
    })

    it('stops the loop if there are no other subscriptions', () => {
      expect(stopLoop).not.toHaveBeenCalled()
      boxizer.removeHandler(handler)
      expect(stopLoop).toHaveBeenCalled()
    })
  })

  describe('looping', () => {
    beforeEach(() => {
      boxizer.subscribe(element, handler)
    })

    it('runs the handler if size has changed', () => {
      element.rect = mockRect(
        element.rect.width + 20,
        element.rect.height,
        element.rect.left,
        element.rect.top
      )
       boxizer.tick()
      expect(handler).toHaveBeenCalled()
    })

    it('does not run the handler if size has not changed', () => {
      element.rect = mockRect(
        element.rect.width,
        element.rect.height,
        element.rect.left + 20,
        element.rect.top
      )
      boxizer.tick()
      expect(handler).not.toHaveBeenCalled()
    })
  })


  describe('exact mode', () => {
    beforeEach(() => {
      boxizer.subscribe(element, handler, true)
      boxizer.tick()
    })

    it('runs the handler if size has changed', () => {
      element.rect = mockRect(
        element.rect.width + 20,
        element.rect.height,
        element.rect.left,
        element.rect.top
      )
      boxizer.tick()
      expect(handler).toHaveBeenCalled()
    })

    it('runs the handler if position has changed', () => {
      element.rect = mockRect(
        element.rect.width,
        element.rect.height,
        element.rect.left + 10,
        element.rect.top
      )
      boxizer.tick()
      expect(handler).toHaveBeenCalled()
    })

    it('does not run the handler if size and position have not changed', () => {
      element.rect = mockRect(
        element.rect.width,
        element.rect.height,
        element.rect.left,
        element.rect.top
      )
      boxizer.tick()
      expect(handler).not.toHaveBeenCalled()
    })
  });

  describe('frameLimit', () => {
    let elements = []
    beforeEach(() => {
      boxizer = new Boxizer({frameLimit: 2})
      elements = [ element, element, element, element, element, element, element ]
      elements.forEach((element, i) => {
        // Passing the index along so we can see which one in the list gets called.
        boxizer.subscribe(element, handler.bind(null, i))
      })

      // Change size of each element
      elements.forEach((element) => {
        element.rect = mockRect(
          element.rect.width + 20,
          element.rect.height,
          element.rect.left,
          element.rect.top
        )
      })
    })

    it('ensures that only the defined number elements will be checked per frame', () => {
      boxizer.tick()
      expect(handler.mock.calls.length).toBe(2)
      boxizer.tick()
      expect(handler.mock.calls.length).toBe(4)
      boxizer.tick()
      expect(handler.mock.calls.length).toBe(6)
      boxizer.tick()
      expect(handler.mock.calls.length).toBe(7)
    })

    it('staggers the elements to be checked', () => {
      boxizer.tick()
      expect(handler.mock.calls[0][0]).toBe(0)
      expect(handler.mock.calls[1][0]).toBe(4)
      boxizer.tick()
      expect(handler.mock.calls[2][0]).toBe(1)
      expect(handler.mock.calls[3][0]).toBe(5)
      boxizer.tick()
      expect(handler.mock.calls[4][0]).toBe(2)
      expect(handler.mock.calls[5][0]).toBe(6)
      boxizer.tick()
      expect(handler.mock.calls[6][0]).toBe(3)
    })

    it('then starts back at the beginning of the list', () => {
      boxizer.tick()
      boxizer.tick()
      boxizer.tick()
      boxizer.tick()

      elements.forEach((element) => {
        element.rect = mockRect(
          element.rect.width + 20,
          element.rect.height,
          element.rect.left,
          element.rect.top
        )
      })

      boxizer.tick()
      expect(handler.mock.calls[7][0]).toBe(0)
      expect(handler.mock.calls[8][0]).toBe(4)
    })
  });
})
