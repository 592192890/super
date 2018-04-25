usage
============
## dependence
``` js
'listener'
```
## Installation
``` js
var Channel = require('common/channel/1.0.0/channel');
```
## Methods
### \#.define('channelName', ['event1','event2'...]);
define a channel;

``` js
@param {string}	channelName
@param {Array} ['event1','event2'...] customize event
@example var testChannel = Channel.define('test', [ 'init', 'enter', 'exit' ]); 
```
### \#.subscribe('channel', fn);
subscribe a channel;
``` js
@param channel {string} 'channelName/event1'
@param fn {function}
@example Channel.subscribe( 'test/init', function(e) {
	console.log(e); // => { foo: 123 }
});
```

### testchannel.listen('event', fn);
``` js
@param event {string}
@param fn {function}
@example var testChannel = Channel.get('test');
testChannel.listen( 'init', function(e) {
	console.log(e); // => { foo: 123 }
});
```

### testChannel.fire('event', data);
``` js
@param event {string}
@param data {object}
```
