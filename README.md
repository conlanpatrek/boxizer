# Boxizer
Subscribe to changes in an element's bounding box.

## Installation
```
npm install boxizer --save
```

## Example Usage
By default, Boxizer will assume you are only interested in listening to the size of an element:
```javascript
import { subscribe } from 'boxizer'

subscribe(
  document.getElementById('myFancyElement'),
  (e) => {
    console.log(`Size has changed from ${e.from.width} x ${e.from.height} to ${e.to.width} x ${e.to.height}`)
  }
)
```

You can also enable position watching by passing along the position option:
```javascript
subscribe(
  document.getElementById('myFancyElement'),
  (e) => {
    console.log('I will also respond to changes in position')
  },
  { position: true }
)
```

Note that a bounding box is relative to the viewport, so scroling will be considered a positional change.

## API
### subscribe(element, handler, [options])
Subcribe to changes in an element's width, height, or position using the provided Boxizer singleton. See Boxizer.prototype.subscribe() for more information.

---

### unsubscribe(element, handler)
Unsubscribe the provided handler from updates on a given element using the provided Boxizer singleton. See Boxizer.prototype.unsubscribe() for more information.

___

### class Boxizer([options])
The Boxizer class manages a list of subscriptions by element.

Constructor Parameters
* `optional <Object> options`: a general configuration object with the following properties:
  * `<int> frameLimit`: The maximum number of elements to check per frame. When the number of element subscriptions surpasses this amount, element checks will be split evenly between multiple frames. Defaults to `1024`

### Boxizer.prototype.subscribe(element, handler, [options])
Subscribe to a change in the provided element's bounding box.

Parameters
* `@param <Element> element`: The element to watch for changes
* `@param <Function> handler(<object> eventData)`: The handler to be called on change. Receives an eventData object with three properties:
  * `<Element> element`: The element that changed,
  * `<DOMRect> from`: The old bounding box
  * `<DOMRect> to`: The current bounding box
* `@param optional <Object> options`: Configuration for this handler. Takes the following properties:
  * `<bool> size`: Respond to changes in element size. Defaults to `true`.
  * `<bool> positin`: Respond to changes in element position. Defaults to `false`.

Return
* `@return <Function> unsubscribe`: A function that destroys this subscription. Takes no arguments and returns nothing.

### Boxizer.prototype.unsubscribe(element, handler)
Remove the provided handler from the provided element.

Parameters
* `@param <Element> element`: The element that's being watched
* `@param <Function> handler`: The handler to remove.

## Issues
Submit issues to the [Boxizer GitHub issue tracker](https://github.com/conlanpatrek/boxizer/issues)
