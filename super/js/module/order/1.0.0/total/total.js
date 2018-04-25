/**
 * @file total.js
 * @synopsis  金额总数
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-16
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        template = require('common/template/1.0.1/template'), //模板
        totalTpl = require('text!./total.tpl'),
        preSaleTpl = require('text!./pre-sale.tpl'),
        total;

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }
    module.exports = {
        getHtml: function(data) {
            return renderTmpl(data.data._isPreSale ? preSaleTpl : totalTpl, data.data)
        }
    };
});
