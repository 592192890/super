/**
 * Lazy stream based on Lazyload, for load stream data list.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 *
 * @extend Lazyload
 * @events
 *
 *   `data`   - Fired when page data load, function(pageIndex, data)
 *   `error`  - Fired when load page data error
 *
 * @example
 *
 * ```js
 *  var LazyStream = require('common/lazystream/1.0.0/js/lazystream')
 *
 *  var stream = new LazyStream('.lazy-stream', {
 *    page: 1, // The base index for backend, defaults to 1
 *    plUrl: './api/pl.php', // stream page endpoint
 *    paramFormater: function(n) { return {page: n} }, // filter function for customize api params
 *    errorText: '<p>Error, Click to try again</p>',
 *    noAnyMore: 'No any more content',
 *    loadingClass: 'loading',
 *    loadingText: '<div>Data loading...</div>'
 *  })
 * ```
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var util = require('lib/core/1.0.0/utils/util');
    var io = require('lib/core/1.0.0/io/request');
    var Lazyload = require('common/lazyload/1.0.0/js/lazyload');
    var nextTick = util.setImmediate;

    // Implements a stream loader
    Lazyload.define('stream', function(el, src, settings, next) {
        var self = this
          , $box = $(el)
          , pageletURL = settings.plUrl
          , pageIndex = +el.getAttribute('data-page') || 0
          , param = settings.paramFormater(pageIndex)
          , dataFilter = settings.dataFilter || function(o) { return o.data; }

        io.jsonp(pageletURL, param, function(res) {
            if (!+res.error) {
                var html = '';
				if(res && typeof res.data == 'object'){
					res.data = res.data.html;
				}
					html = dataFilter(res);

                if (html) {
                    try {
                        html = unescape(html);
                    } catch (e) {}
                } else {
                    html = settings.endText || ''
                }

                $box.html(html);

                self.emit('data', { page: pageIndex, data: res.data })
            }
        })
        .always(function(res) {
            var data = res.data;
            if ( !data || +(data.error || 0) !== 0 ) { // error

                next(data);

                var error = '<div class="stream-error">' + (settings.errorText || res.msg) + '</div>'
                $box.html(error).off('click').on('click', function(e) {
                    e.preventDefault();
                    self.update();
                });

                self.emit('error', res);
            }
            else {
                next(null, data);
            }
        });
    });

    /** @constructor */
    var LazyStream = function(container, options) {
        var self = this;

        options = options || {};
        container = $(container);

        if (!options.plUrl) {
            throw 'Init lazystream failed, The pagelet api `plUrl` not defined';
        }

        // merge defaults
        options = $.extend(true, {
            plUrl: '',  // The endpoint api for stream seeking
            page: 1,    // The base index for backend, defaults to 1
            paramFormater: function(n) { return {page: n} }, // A filter function for customize api params
            errorText: '',
			isSkipAboveTop: false, //是否跳过上限
            noAnyMore: ''
        }, options);

        options.type = 'stream';
        options.page = +options.page || 1;

        Lazyload.apply(self, [null, options]);

        var loadingClass = options.loadingClass;
        if (loadingClass) {
            container.find('.' + loadingClass).remove();
        }

        self._view = container;

        // {HTMLElement} last page wrapper
        self._cursor = null;

        self.on('lazyItemReady', function(el, origin, response) {
            nextTick(function() { self.loadNext() });
        });

        self.loadNext();
    };

    util.inherits(LazyStream, Lazyload, {
        _addHolder: function(page) {
            var prev = this._cursor, options = this._;
            var el = $('<div class="' + options.loadingClass + '" data-page="' + page + '">' + options.loadingText + '</div>')[0];
            if (!prev) {
                // prepare for the fist trunk
                this._view.append(el);
            } else {
                $(prev).after(el);
            }
            this.add(el);
            return (this._cursor = el);
        },
        hasNext: function() {
            var el = this._cursor;
            return el && el.firstChild;
        },
        loadNext: function() {
            var cursor = this._cursor, options = this._;
            // has next
            if (!cursor || this.hasNext()) {
                // Add next loader
                this._addHolder(options.page++);
            } else {
                // EOF
                var noAnyMore = options.noAnyMore;
                if (noAnyMore) $(cursor).html(noAnyMore);
            }
            this.update();
            return this;
        }
    });

    module.exports = LazyStream;
});
