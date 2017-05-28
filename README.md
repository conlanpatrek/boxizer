# Boxizer
Subscribe to changes in an element's bounding box.

## Installation
```
npm install boxizer --save
```

## Usage
By default, Boxizer will assume you are only interested in listening to the size of an element:
```
import { subscribe } from 'boxizer'

subscribe(
  document.getElementById('myFancyElement'),
  (e) => {
    console.log(`Size has changed from ${e.from.width} x ${e.from.height} to ${e.to.width} x ${e.to.height}`)
  }
)
```

You can also enable position watching by using exact mode:
```
subscribe(
  document.getElementById('myFancyElement'),
  (e) => {
    console.log('I will also respond to changes in position')
  },
  true // Exact mode enabled
)
```

Note that a bounding box is relative to the viewport, so scroling will be considered a positional change.
