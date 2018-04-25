usage
============

## dependence
``` js
common/button/2.0.0/sass/module/_button.scss
common/box/2.0.0/sass/module/_box.scss
```
## Installation
``` js
var box = require('box/2.0.0/js/box');
```

## Options
``` js
opt {
	ctn: ctn, // {string} 
	className: "ui-pop ui-pop-tips", // {string}
	fixed: true, {boolen}
	hideClose: true, //close btn {boolen}
	title: '', {string}
	duration: 2000, //time of disappear {number}
	hideWithAni: 'fadeOut', //hide animation {string} [fadeOut:fast]
	showWithAni: 'fadeInUp'	 //show animation {string} [fadeInUp:fast]
} 
```

## Methods
### \#.create(ctn, opt);
create a new box;

``` js
@param ctn {string}	
@return box {object}
```
### \#.alert(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```

### \#.confirm(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.fullScreen(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.loading(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.bottom(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.left(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.select(ctn, opt);

``` js
@param ctn {Array} [{text:'a1',value:'1'},{text:'a2',value:'2'}]
@return box {object}
```
### \#.tips(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.ok(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.error(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
### \#.warn(ctn, opt);

``` js
@param ctn {string}	
@return box {object}
```
## Events
### \#.on('shown',function(){});

``` js
@return box {object}
```
### \#.on('hiden',function(){});

``` js
@return box {object}
```

## Reference

* [artDialog](http://aui.github.io/artDialog/)
