@MomsFriendlyDevCo/Chainable
============================
Make any JavaScript object a chainable, functional interface.

This library is _intentionally_ tiny and dependency free. The entire library, minified is less than 1kb!


**Make the tiny Mitt event library chainable**

```javascript
import chainable from '../lib/chainable.js';
import mitt from 'mitt';

let emitter = chainable(mitt)
    .on('blarp', ()=> { /* Handle blarp emit */ })
    .on('flonk', ()=> { /* Handle flonk emit */ })
    .emit('blarp')
    .value() // Get original unwrapped emitter
```


**Make a browser DOM element chainable**
```javascript
import chainable from '@momsfriendlydevco/chainable';

// Make a chainable DOM object
chainable(document.createElement('div'));
    .addEventListener('click', ()=> { /* Handle clicks */ })
    .set('style.position', 'absolute') // Set a deeply nested property
    .value() // Output the original object (if needed)
```


Why?
----
This library exists this because handling chainability in some non-chainable interfaces gets repetitive.

```javascript
// Horrible <div> setup using the native DOM
let widget = document.createElement('div');
widget.addEventListener('click', ()=> { /* Handle click */ });
widget.style.position = 'absolute';
widget.style.top = '0px';
widget.style.left = '0px';
widget.classList.add('red');

document.body.append(widget);
```

```javascript
// Equivalent using chainable
document.append(
    chainable(document.createElement('div'));
        .addEventListener('click', ()=> { /* Handle clicks */ })
        .set('style.position', 'absolute') // Set a deeply nested property
        .set('style.top', '0px')
        .set('style.left', '0px')
        .call('classList.add', 'red')
        .value() // Output the original raw DOMElement
);
```



API
===

chainable(object)
-----------------
Create a new chainable instance.
This also sets `$source` to the original object.


chainable.$source
-----------------
Also available as `chainable.source` if there isn't any conflict with the name.
The chainable source object.
Generally you don't want to access this directly.


chainable.$call(name, ...args)
------------------------------
Also available as `chainable.call(name, ...args)` if there isn't any conflict with the name.
As with `.$get` the name can be in dotted notation or array notation for deeply nested methods.
Call a method on source but ignore the response and return the chainable instance.


chainable.$set(key, val)
------------------------
Also available as `chainable.set(key, val)` if there isn't any conflict with the name.
Set one or more properties within a source object.
Can be called as a simple key/val setter - `chainable.$set(keyName, value)` - or as an object - `chainable.$set({key1: val1, key2: val2})`
The key can also use dotted notation (e.g. `this.is.a.nested.key`) or an array notation (e.g. `['this', 'is', 'a', 'nested', 'key']`) to set deeply nested properties.
Returns the chainable instance.


chainable.$get(path)
--------------------
Also available as `chainable.get(path)` if there isn't any conflict with the name.
Fetch a value from the source object, returning it.
The path can also use dotted notation (e.g. `this.is.a.nested.key`) or an array notation (e.g. `['this', 'is', 'a', 'nested', 'key']`) to get deeply nested properties.
Returns the value found at the path or undefined if none.


chainable.$value()
------------------
Also available as `chainable.value()` if there isn't any conflict with the name.
Return the original source object - i.e. unwrap the original.


chainable.$tap(callback)
------------------------
Also available as `chainable.tap(callback)` if there isn't any conflict with the name.
Run a callback inline as `(chainable) => { /* handler */ }`, ignore the result and return the chainable instance.


chainable.$thru(callback)
-------------------------
Also available as `chainable.tap(callback)` if there isn't any conflict with the name.
Run a callback inline as `(chainable) => { /* handler */ }`, take the returned value as the new `$source` and and return the chainable instance.
