/**
 * @author	taotao
 * @desc    basic component
 * @daet    2016-03-09
 * @alter	liuwei 2017-03-14
 */

define(function(require) {
    'use strict';

    var $ = require('jquery'),
	
	Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
	
	context = require('lib/gallery/context/1.0.0/context'),

    eGoodsDetailCntData = $('#jGoodsDetailCntData'), // 商品详情内容数据
    eGoodsDetailCnt = $('#jGoodsDetailCnt'), // 商品详情内容
    defaultUrl = context.getConf('url.defaultImgUrl');	//默认图片地址


    //  获取图片大小
    function getSizeByUri(picUri) {
        var size = {};
        var ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)\!([0-9]+)$/;
        var items = ptn.exec(picUri);
        if (items) {
            size.w = parseInt(items[1]);
            size.h = parseInt(items[2]);
            size.size = parseInt(items[4]);
        } else {
            ptn = /_([0-9]+)x([0-9]+).([^.\/_]+)$/;
            items = ptn.exec(picUri);
            if (items) {
                size.w = parseInt(items[1]);
                size.h = parseInt(items[2]);
                size.size = size.w;
            } else {
                size = null;
            }
        }
        return size;
    }

    /**
     * 商品详情页图片懒加载
     */
    var eGoodsIntro = $('<div>'+eGoodsDetailCntData.html()+'</div>');
    var eImg = eGoodsIntro.find('img');

    eImg.each(function() {
        var $this = $(this), src = $this.attr('src'), size = getSizeByUri(src);
        $this.attr('data-url', src);
        // $this.attr('data-url', src.replace(/(\.jpg|\.png|\.gif|\.jpeg)/i,'$1' + sizeFix));
        $this.removeClass('jImg');
        $this.attr('src', defaultUrl);
        // 防止编辑没有定义宽度，导致数据一次性加载
        if (size) {
            var w = $('body').width();
            $this.css({
                width : w,
                height : size.h * w / size.w
            });
        }
        $this.addClass('jImg img-error');
    });
    eGoodsDetailCnt.html(eGoodsIntro);

    var imageLazyLoader = new Lazyload($(eGoodsIntro).find('img.jImg'), {
        effect: 'fadeIn',
        dataAttribute: 'url',
        load : function(self){
            if($(self).hasClass('img-error')){
                $(self).removeClass('img-error');
            }
        }
    });
});
