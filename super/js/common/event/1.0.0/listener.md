usage
============

## dependence
``` js
'utils/1.0.0/util', 'emitter'
```
## Installation
``` js
var Listener = require('common/event/1.0.0/listener');
```

## Methods
### \#.define('channelName', ['event1','event2'...]);
define a channel;

``` js
@param {string}	channelName
@param {Array} ['event1','event2'...] customize event
@example var channel = Listener.define('channelName', ['event1']);
```

### channel.listen('event', function(){});
subscribe

``` js
@param event {string} //customize event;	
@param function(){};
@example
channel.listen('init', function(data) {
    console.log(data)  // => {foo: foo data}
});
``` 

### channel.fire('event', data);
publish

``` js
@param event {string} //customize event;	
@param data {object}  //customlize data;
@example channel.fire('init', {foo: 'foo data'});
```
