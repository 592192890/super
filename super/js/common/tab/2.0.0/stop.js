// Zepto.stopTranAnim plugin
// for Zepto v1.0
// https://github.com/ksk1015/Zepto.stopTranAnim
// License: MIT

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var prefix = $.fx.cssPrefix,
        transitionEnd = $.fx.transitionEnd,
        transitionProperty,
        transitionDuration,
        transitionTiming,
        cssReset = {}

    cssReset[transitionProperty = prefix + 'transition-property'] =
        cssReset[transitionDuration = prefix + 'transition-duration'] =
        cssReset[transitionTiming = prefix + 'transition-timing-function'] = ''

    $.fn.stop = function(jumpToEnd, cancelCallback) {

        var props, style, cssValues = {},
            i

        props = this.css(prefix + 'transition-property').split(', ')

        if (!props.length) {
            return this
        }

        if (!jumpToEnd) {
            style = document.defaultView.getComputedStyle(this.get(0), '')
            for (i = 0; i < props.length; i++) {
                this.css(props[i], style.getPropertyValue(props[i]))
            }
        }

        if (cancelCallback) {
            this.unbind(transitionEnd).css(cssReset)
        } else {
            this.trigger(transitionEnd)
        }

        return this;

    }

});
