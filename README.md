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
### subscribe( \<Element> element, \<Function> handler, [\<Object> options] )
Subcribe to changes in an element's width, height, or position using a singleton instance of the Boxizer class. See Boxizer.subscribe() for more information.

---

### unsubscribe( \<Element> element, \<Function> handler )
Unsubscribe the provided handler from updates on a given element. See Boxizer.unsubscribe() for more information.

___

### class Boxizer( [\<Object> options] )
The Boxizer class manages a list of subscriptions by element.

#### @param optional \<Object> options
General Boxizer configuration. Takes the following properties:
* `<int> frameLimit`: The maximum number of elements to check per frame. When the number of element subscriptions surpasses this amount, element checks will be split evenly between multiple frames. Defaults to `1028`

#### @method subscribe( \<Element> element, \<function> handler, [\<Object> options] )
Subscribe to a change in the provided element's bounding box.

##### @param \<Element> element
The element to watch for changes

##### @param \<Function> handler(\<object> eventData)
The handler to be called on change. Receives an eventData object with three parameters:
* `<Element> element`: The element that changed,
* `<DOMRect> from`: The old bounding box
* `<DOMRect> to`: The current bounding box

##### @param optional \<Object> options
Configuration for this handler:
* `<bool> size`: Respond to changes in element size. Defaults to `true`.
* `<bool> positin`: Respond to changes in element position. Defaults to `false`.

##### @return \<Function> unsubscribe()
A function that destroys this subscription. Takes no arguments. Returns nothing.
```
var unsubscribe = subscribe(element, handler) // Listening
unsubscribe() // No longer listening
```

#### unsubscribe( \<Element> element, \<function> handler )
Remove the provided handler from the provided element.

##### @param \<Element> element
The element that's being watched

##### @param \<Function> handler
The handler to remove.

## Issues
Submit issues to the [Boxizer GitHub issue tracker](https://github.com/conlanpatrek/boxizer/issues)
