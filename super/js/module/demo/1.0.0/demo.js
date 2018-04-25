/**
 * @file demo.js
 * @synopsis  模块名称
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-02-23
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'), //io.jsonp
        template = require('template'), //模板
		demoTpl = require('text!./demo.tpl'), //模板引用
        moduleName; //模块名称

    //小方法,与当前业务无关
    /* --------------------------------------------------------------------------*/
    /**
     * @synopsis  renderTmpl 模板渲染
     *
     * @param tpl 模板
     * @param data 数据
     *
     * @returns html字符串
     */
    /* ----------------------------------------------------------------------------*/
    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    moduleName = {
        init: function() {
            //渲染模板,返回模板字符串
            var b = renderTmpl(demoTpl, {});
        },
        //私有，与业务有关
        _method: function() {

        },
        //共有，与业务有关
        method: function() {

        }
    };
    //初始化
    moduleName.init();
    //给其他模块调用,没有就不用写
    module.exports = {
        arg: 1
    };
});
