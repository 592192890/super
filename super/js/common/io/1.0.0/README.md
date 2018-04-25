usage
============

## dependence
``` js
'jquery', 'utils/1.0.0/util', 'event/1.0.0/emitter' 
```
## Installation
``` js
var io = require('common/io/1.0.0/request');
```

## Methods
### \#.get(url, data, callback, error, sender);

``` js
@param url {string}	
@param data {object}
@param callback {function}
@param error {function}
@param sender {object} [button | other element]
@return {object} // return instance, support chain invoke;
```

### \#.post(url, data, callback, error, sender);
### \#.jsonp(url, data, callback, error, sender);

## Events
### \#.on('error',function(err, res){});

``` js
@param err {object} 	
@param res {object}
@return {object} // instance
```
