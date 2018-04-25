# Slider v3.0.4

## Usage

```html
<div class="mod-slide">
  <div class="bd items">
    <img class="item" src="//ww4.sinaimg.cn/large/6d5d6a55gw1etstr2h17aj20q409q0tz.jpg" alt="Photo by: Missy S Link: http://www.flickr.com/photos/listenmissy/5087404401/">
    <img class="item" data-src="//ww4.sinaimg.cn/large/6d5d6a55gw1etstroiobpj20q409qgnf.jpg" src="//s1.bbgstatic.com/s.gif" alt="Photo by: Daniel Parks Link: http://www.flickr.com/photos/parksdh/5227623068/">
    <img class="item" data-src="//ww2.sinaimg.cn/large/6d5d6a55gw1etstsaowg5j20q409qjth.jpg" src="//s1.bbgstatic.com/s.gif" alt="Photo by: Mike Ranweiler Link: http://www.flickr.com/photos/27874907@N04/4833059991/">
    <img class="item" data-src="//ww1.sinaimg.cn/large/6d5d6a55gw1etstthiegtj20q409qjtp.jpg" src="//s1.bbgstatic.com/s.gif" alt="Photo by: Stuart SeegerLink: http://www.flickr.com/photos/stuseeger/97577796/">
  </div>
</div>
```

```js
var Slider = require('lib/ui/slider/3.0.4/slider');

var el = $('.mod-slide .items');

new Slider(el, {
    height: el.height(),
    pagination: { effect: 'slide' },
    navigation: {
        arrows: true,
        toggleOnHover: true,
        effect: 'slide',
        prevArrow: '<a href="#" class="ui-slider-prev ui-slider-navigation"><em></em><i class="iconfont icon-prev">&#xe602;</i></a>',
        nextArrow: '<a href="#" class="ui-slider-next ui-slider-navigation"><em></em><i class="iconfont icon-next">&#xe603;</i></a>'
    },
    play: {
        auto: true,
        effect: 'slide',
        pauseOnHover: true
    },
    callback: {
        // callback been called before slide showing
        start: function(index, slide) {

        },
        // callback when slide shown
        complete: function(index, slide) {

        }
    }
});
```
