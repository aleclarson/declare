
# declare v0.0.2 

```js
const declare = require('declare');

const type = declare(function(init, inherit) {

  // Create an argument validator.
  const validate = this.args(String);

  return function ReadableStream(filePath) {
    // Perform argument validation.
    validate(arguments);

    // Apply the parent constructor to this instance.
    inherit(this, arguments);

    // Set properties like normal.
    this.length = 0;

    // Perform initialization declared outside this constructor.
    init(this, arguments);
  };
})

// Set the parent constructor.
type.inherit(Stream);

// Always define a specific value on each instance.
type.define({
  sync: true,
  destroyed: false,
})

// Create values for each instance.
// NOTE: Keys beginning with '_' are non-enumerable.
type.define(function(filePath) {
  return {
    _readableState: {}
  }
})

// Define non-enumerable methods on the prototype.
type.extend({
  read(n) {
    return null;
  }
})

// Define properties on the constructor.
type.statics({
  ReadableState: {}
})

// Build the constructor.
const ReadableStream = type.build()

// Use the constructor.
const stream = new ReadableStream('./file.txt')
```

