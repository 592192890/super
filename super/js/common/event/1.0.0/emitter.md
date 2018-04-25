usage
============

## Installation
``` js
var EventEmitter = require('com/event/1.0.0/emitter');
var object = new EventEmitter();
```

## Options
``` js
@example 
object.on('expand', function(){ alert('expanded'); });
object.emit('expand');
```

## Methods
### Eventemitter.applyTo(object);

## Events
### \#.on('events',function(obj){});
### \#.emit('events',function(obj){});
