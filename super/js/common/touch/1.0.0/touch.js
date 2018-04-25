/**
 * @file touch.js
 * @synopsis  touch事件
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-04-20
 */

define(function(require, exports, module) {
    'use strict';

    var Emitter = require('lib/core/1.0.0/event/emitter');

    function Touch(selector) {
        var selectors = document.querySelectorAll(selector);
        var touch = {};
        $.each(selectors, function(i, selector) {
            var startX, startY;
            selector.addEventListener('touchstart', function(event) {
                var event = event || window.event;
                var changedTouche = event.changedTouches[0];
                startX = changedTouche.pageX;
                startY = changedTouche.pageY;
            });
            selector.addEventListener('touchmove', function(event) {
                var elem = this;
                var event = event || window.event;
                var changedTouche = event.changedTouches[0];
                var endX = changedTouche.pageX;
                var endY = changedTouche.pageY;
                var distanceX = endX - startX;
                var distanceY = endY - startY;
                touch.emit('swipeMove', {
                    elem: elem,
                    event: event,
                    distanceX: distanceX,
                    distanceY: distanceY
                });
            });
            selector.addEventListener('touchend', function(event) {
                var elem = this;
                var event = event || window.event;
                var changedTouche = event.changedTouches[0];
                var endX = changedTouche.pageX;
                var endY = changedTouche.pageY;
                //distance for move;
                var distanceX = endX - startX;
                var distanceY = endY - startY;
                //postion for move
                if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX > 50) {
                    touch.emit('swipeRight', {
                        elem: elem,
                        event: event
                    });
                } else if (Math.abs(distanceX) > Math.abs(distanceY) && distanceX < -50) {
                    touch.emit('swipeLeft', {
                        elem: elem,
                        event: event
                    });
                } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY < -50) {
                    touch.emit('swipeUp', {
                        elem: elem,
                        event: event
                    });
                } else if (Math.abs(distanceX) < Math.abs(distanceY) && distanceY > 50) {
                    touch.emit('swipeDown', {
                        elem: elem,
                        event: event
                    });
                }
            });
        });
        Emitter.applyTo(touch);
        return touch;
    }
    module.exports = Touch;
});
