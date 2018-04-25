define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery');
    var wxShare = require('./wx-share');
    
    var Base = function(newOption) {
        var resultOption = $.extend({
            'initCommodityClickOption' : undefined,
            'expireOption' : undefined,
            'initAppShareOption' : undefined,
            'publicHeaderOption' : undefined,
            'floatCouponOption' : undefined,
            'downloadBanner': {
                'show': true,
                'busin_type': '1'
            },
            'initProductsDisabled' : false
        }, newOption);
        
        var initAppShareOption = resultOption.initAppShareOption;
        if (initAppShareOption) {
            wxShare.init(initAppShareOption);
        }
    };

    return Base;
});
