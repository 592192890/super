/**
 * @author yanghaitao, 178224406@qq.com
 * @version 1.0.0
 * @date 2017-03-30
 */
define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        Dialog = require('common/ui/dialog/dialog'),
        Emitter = require('lib/core/1.0.0/event/emitter'), //事件监听
        itemNumber = $('#jNumber'),
        selectQty;

    selectQty = {

        number : 1,  // 选择的产品数量;

        max: 1, // 最大产品数量;

        tip : '', // 数量限制提示;

        init: function(){},

        exec: function(rs){
            var data = $.extend({}, rs),
                promotion = data.data.promotion,
                store = data.data.product.store || 0,  //库存
                max = data.data.product.max, //最大购买数
                pronum, //预售商品限购数量
                limit_tip;  // 限购提示

            if (data.data.hideNum === true || data.data.hideNum === 'true') {
                //$('#jItemCountSelecter').hide();   // 选择数量隐藏
            }
            
            if (data.data.product && data.data.product.store <= 0) {
                //$('#jItemCountSelecter').hide();
            }

            if(!promotion){
                this.tip = '该商品已下架'
                return
            }
            pronum = promotion.limit ? promotion.limit.num : 1;

            if(pronum > store || !data.data.promotion.limit){
                this.max = max;
                this.tip = '库存有限,此商品最多只能购买' + max + '件';
            } else {
                if (promotion.limit && promotion.limit.tips) {
                    limit_tip = promotion.limit.tips;
                } else {
                    limit_tip = '库存有限,此商品最多只能购买' + pronum + '件';
                }
                this.max = pronum;
                this.tip = limit_tip;
            }
        },

        event: function(){
            var self = this;
            $('.jAddend').on('click', function() {
                self.addend(self.max, self.tip)
            });
            $('.jMeiosis').on('click', function(){
                self.Meiosis();
            });
            itemNumber.on('input', function(){
                self.keyup(self.max, self.tip);
            })
        },

        //  加一
        addend: function(max, tip) {
            var self = this;
            this.max = max || 1;
            this.tip = tip || '';
            this.number = itemNumber.val() || '';
            if(this.number >= this.max) {
                itemNumber.val(self.max);
                Dialog.tips(self.tip);
            } else if (this.number === '') {
                this.number = 1;
                itemNumber.val(self.number);
            } else {
                this.number++;
                itemNumber.val(self.number);
            }
        },

        //  减一
        Meiosis: function() {
            var self = this;
            this.number = itemNumber.val() || '';
            if (this.number <= 1) {
                this.number = 1;
                itemNumber.val(self.number);
            } else if(this.number === ''){
                this.number = 1;
                itemNumber.val(self.number);
            } else {
                this.number--;
                itemNumber.val(self.number);
            }
        },

        keyup: function(max, tip) {
            var self = this;
            this.max = max || 1;
            this.tip = tip || '';
            this.number = itemNumber.val() || '';
  
            if (this.number == 0 || this.number == '' || !(/^\d+$/.test(this.number))) {
                this.number = 1;
                itemNumber.val(self.number);
            } else if(this.number > this.max) {
                this.number = this.max
                itemNumber.val(self.number);
                Dialog.tips(self.tip);
            }

        }
    }

    module.exports = selectQty;
});

