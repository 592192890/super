/**
 * @file invoice.js
 * @synopsis  发票信息
 * @author licuiting, 250602615@qq.com
 * @version 1.0.0
 * @date 2017-03-09
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        template = require('common/template/1.0.1/template'), //模板
        context = require('lib/gallery/context/1.0.0/context'),
        Emitter = require('lib/core/1.0.0/event/emitter'),
        box = require('lib/ui/box/1.0.1/box'),
        Tab = require('common/tab/1.0.0/tab'),
        com = require('module/order/1.0.0/common/common'),
        invoiceTpl = require('text!./invoice.tpl'),
        invoice;

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    //验证是否为空
    function isEmpty(value) {
        if (typeof value === 'undefined' || $.trim(value).length == 0) {
            return true;
        }
    }

    // 验证特殊字符
    function hasSpChar(val) {
        var reg = /[~#^$@%&!*'<>]/gi;
        return reg.test(val);
    }
    invoice = {
        init: function() {},
        data: function(data) {
            return data;
        },
        //保存发票信息
        saveInvoice: function() {
            var self = this;
            if (!$('#jInvoiceChk').prop('checked')) {
                self.emit('saveInvoice');
                return false;
            }
            var data = {
                taxType: '',
                taxContent: $.trim($('#jInvoiceCtn').val()),
                taxTitle: $.trim($('#jTaxTitle').val())
            };
            com.ajax(context.getConf('url.saveInvoiceInfo'), data, function() {
                self.emit('saveInvoice');
            });
        },
        //获取发票列表
        _getTaxList: function() {
            var $ctn = $('#jInvoiceCtn'),
                ar = [];
            if ($ctn.find('option').length > 0) {
                return false;
            }
            com.ajax(context.getConf('url.getInvoiceList'), {}, function(data) {
                ar.push('<option value>请选择发票内容</option>');
                $.each(data.data, function(i, v) {
                    ar.push('<option value="' + v + '">' + v + '</option>');
                });
                $ctn.html(ar.join(''));
            });
        },
        events: function() {
            var self = invoice,
                tb = new Tab('#jInvoice', {
                    trigger: true
                }).on('tabClick', function(obj) {
                    var $chk = $('#jInvoiceChk'),
                        flag = obj.$this.hasClass('active');
                    $chk.prop('checked', flag);
                    self._getTaxList();
                });
        },
        validate: function() {
            var taxTitleVal = $('#jTaxTitle').val();
            if (!$('#jInvoiceChk').prop('checked')) {
                return true;
            }
            if (isEmpty($('#jInvoiceCtn').val())) {
                box.error('发票内容不能为空');
                return false;
            } else if (isEmpty(taxTitleVal)) {
                box.error('发票抬头不能为空');
                return false;
            } else if (hasSpChar(taxTitleVal)) {
                box.error('发票抬头不能包含特殊字符');
                return false;
            }
            return true;
        },
        getHtml: function(data) {
            return renderTmpl(invoiceTpl, invoice.data(data));
        }
    };
    Emitter.applyTo(invoice);
    module.exports = invoice;
});
