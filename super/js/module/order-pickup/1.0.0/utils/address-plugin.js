/*
 * @name: linkageTab;
 * @author: licuiting;
 * @email: 250602615@qq.com;
 * @date: 2014-4-13;
 * @version: 1.2;
 * 联动选项卡;
 *
 * @update  taotao  2015-09-01
 *
 */
define(function(require, exports, module) {
    'use strict';
    var $ = require('jquery');
    var cookie = require('common/kit/io/cookie');
    var io = require('common/kit/io/request');
    var getParameterByName = require('./getparameter');

    var addUrl = {
        //获取默认选中的地址
        // selectedUrl: '//wx.yunhou.com/super/region/getuserregion/',
        //选中最后一层，请求后台存储cookie
        changeCallBackUrl: '//wx.yunhou.com/super/region/setuserregion/',
        // 请求多级地址的url
        url: '//wx.yunhou.com/super/region/'
    };

    function LinkageTab(opt ,param) {
        if((typeof opt).toLowerCase() == 'object'){
            //缓存对象
            $('#'+opt.selector).data('linkageTab',$.extend(this, this.defaultSetting, opt || {}));
            this.init();
        }else{
            //执行方法
            eval('this.'+ opt +'(param)');
        }
    }
    LinkageTab.prototype = {
        defaultSetting: {
            //调用多级地址的对象
            // linkageBox : $('#jAddrPop'),
            // 外围盒子id
            selector: '_jAddrPop',
            //tab面板id
            tabSelector : '_jAddrPopTab',
            // 数据url
            url: addUrl.url,
            // 点击最后一个选项内容请求的
            changeCallBackUrl : addUrl.changeCallBackUrl,
            ajaxData : {},//外部ajax参数
            selectedData:'',
            selectValName : '',
            // area 存文本和id的隐藏域的id
            areaId : 'areaInfo',
            // 存最后一个值的隐藏域的id
            lastValueId : 'f4',
            // 层级
            degree : 4,
            //地址是否为空
            isAddressNull:false,
            //默认文字
            defaultText : '请选择',
            loadTxt : '加载中...',
            //第一次加载,是否显示地址
            isShowAddr : false,
            //加载完毕执行
            loaded : function(){},
            //是否显示服务器上的默认四级地址--content
            isShowDefault : true,
            isShowLink : true,//是否展示四级地址--linkageTab
            //选项卡文字
            labelTxt : ['选择省','选择市','选择区','选择街道'],
            //默认展示第几个tab;参数为数值[0,..];false表示不启用;
            defaultTab : '0',
            //多级选择完毕后的回调
            lastChangeCallBack:function(){

            },
            changeCallBack : function(){

            },
            onShow : function(){

            },
            onHide : function(){

            },
            //关闭的回调
            onClose : function(){

            }
        },
        init: function() {
            var _self = this;
            // html
            if($('#'+_self.selector).length == 0){
                //防止id重复
                _self.creaHiddenId();
                $('body').append(_self.createDiv());
            }
             // wrap
            _self.o = $('#'+_self.selector);
            // tab
            _self._t = $( '#'+_self.selector+' .tab li');
            // content
            _self._c = $( '#'+_self.selector + ' .mc');
            _self.isShowLink && _self.show();
            // 设置默认高度
            _self.setHeight();
            // 给隐藏域填值
            _self.setValForHidden( true );
            // 绑定事件
            _self.eventBind();
            //内容加载完毕
            _self.loaded();
            _self.isShowAddr && _self.o.find('.text').click();
        },
        setHeight : function(){
            // var self = this;
            // var h = $(window).height();
            // self.o.find('.content').height(h-$('#jLinkageTopBox').height());
            this.o.find('.content').height("auto");
        },
        //防止id重复
        creaHiddenId : function(){
            var idArr = ['areaId','lastValueId'];
            var _self = this;
            $.each(idArr,function(){
                if($('#'+_self[this]).length!=0){
                    _self[this] = _self[this]+'_'+_self.selector;
                }
            })
        },
        //
        createDiv : function(){
            var self = this;
            var ar = [];
            var dis = self.isShowLink?'':' style="display:none;"';
            ar.push('<div class="linkage-tab" id="'+ self.selector + '"'+ dis +'>',
                            self.createTop(),
                            '<div class="linkage-tab-body">',
                                '<input type="hidden" id="'+ self.lastValueId +'" />',
                                self.createTab(),
                                self.createContent(),
                            '</div>',
                        '</div>');
            return ar.join('');
        },
        createTop : function(){
            var ar = ['<header class="ui-header" id="jLinkageTopBox">',
                        '<a  class="icon iconfont ui-back jLinkAgeClose">&#xe612;</a>',
                        '<span class="ui-title">地址选择</span>',
                        '<a class="icon iconfont ui-handle jLinkageTab">&#xe60a;</a>',
                    '</header>'];
            return ar.join('');
        },
        createTxt : function(){
            return '<div class="text" style="display:none;"></div>'
        },
        //tab
        createTab : function(){
            var self = this;
            var d = self.degree;
            var ar = [];
                ar.push('<div class="tab" id="'+ self.tabSelector +'">','<ul>');
                    for(var m=0;m<d;m++){
                        ar.push( '<li data-index="'+ m +'" data-widget="tab-item" class="'+ (m==0?'hover':'') +'" style="display:'+ (m==0?'block':'none') +';">',
                                    self.labelTxt[m],
                                '</li>');
                    }
                ar.push('</ul>','</div>');
            return ar.join('');
        },
        //content
        createContent : function(){
            var self = this;
            var d = self.degree;
            var ar = [];
                ar.push('<div class="content">','<div class="inner">');
                    for(var n=0;n<d;n++){
                        ar.push( '<div class="mc" data-index="'+ n +'" data-widget="tab-content" style="display:'+ (n==0?'block':'none') +'">',
                                    '<div class="load-txt-box jLoadBox">'+ self.loadTxt +'</div>',
                                    '<ul class="area-list">',
                                    '</ul>',
                                '</div>');
                    }
                ar.push('</div>','</div>');
            return ar.join('');
        },
        // 添加内容
        addStr: function(data ,index) {
            var _self = this;
            var str = '';
            //获取当前选中的id
            var selectedId = _self._t.eq(index).attr('data-value');
            //索引
            var _i = 0;
            var _n = Math.random();
            $.each(data, function(k, v) {
                if(v){
                    var arr = [
                        '<li data-value="' + v.id + '" data-a-index="'+ _i +'" class="limit '+ (v.id==selectedId?'hover':'') +'" title="'+ (v.selfName || v.name) +'">',
                            '<a href="javascript:;" class="address-text g-lf">'+ (v.selfName || v.name) +'</a> ',
                            '<span class="icon-wrap">',
                                '<input name="address'+ _n +'" type="radio" value="'+ v.id +'">',
                            '</span>',
                        '</li>'
                    ];
                    str += arr.join('');
                }
                _i++;
            });
            return str;
        },
        //
        ajax: function(url, data, successFun, errorFun) {
            var opt = $.extend({ platform   :'js'},data);
            io.jsonp(url,opt,function (data) {
                successFun && successFun(data);
            },function(data){
                errorFun && errorFun(data);
            })
        },
        // tab效果;
        tab : function( index ){
            var _self = this;
            // 显示对应tab
            _self._t.eq(index).siblings().removeClass('hover');
            _self._t.eq(index).show().addClass('hover');
            // 显示相应content
            _self._c.hide();
            _self._c.eq(index).show();
        },
        //根据配置重置tab顺序
        resetTab : function(){
            var _self = this;
            if(_self.defaultTab){
                _self.tab(_self.defaultTab);
            }
        },
        // 显示tab
        showTab : function( obj ){
            var _self = this;
            var _tab = _self._t.eq(obj.index);
            var text = _tab;
            _tab.show();
            _tab.attr({ 'title' :  obj.text });
            text.attr({ 'data-value' : obj.id }).html(obj.text);
        },
        // 默认or编辑状态
        defaultOrEdit:function(){
            // 默认加载第一项;
            this.addContent( 0,0);
        },
        //是否第一次选择
        isFirstClick : function(){
            var self = this;
            return ($.trim(this._c.eq(0).find('.area-list').html())=='');
        },
        //显示
        show : function(){
            var self = this;
                self.o.addClass('linkage-tab-hover');
                // $('html').addClass('linkage-tab-hidden');
                // 默认或编辑状态显示,禁止重复请求;
                self.isFirstClick() && self.defaultOrEdit();
                self.onShow();
        },
        //
        hide : function(){
            // $('html').removeClass('linkage-tab-hidden');
            this.o.removeClass('linkage-tab-hover');
            this.onHide();
        },
        eventBind: function() {
            var _self = this;
            var backData = [];
            // 事件绑定
            _self.o.off('click')
            // 关闭
            .on('click','.jLinkAgeClose',function(){
                _self.hide();
                _self.resetTab();
                _self.onClose();
            })
            //点击选项卡
            .on('click','.tab li',function(){
                var index = $(this).attr('data-index');
                    _self.tab( index );
            })
            //点击选中文字
            .on('click','.mc li',function(e){
                var $this = $(this);
                var index = Number($(this).closest('.mc').attr('data-index'));
                var text = $(this).find("a").text();
                var parentId = $(this).attr('data-value');

                // 填text;
                _self._t.eq( index ).attr('title' ,text).html(text);
                _self._t.eq(index)
                // 填value;
                _self._t.eq( index ).attr('data-value',parentId);
                //记录当前选中的值
                _self._c.eq( index ).removeClass('hover');
                $this.siblings().removeClass('hover');
                $this.addClass('hover');
                $this.parents(".mc").find("input").removeAttr('checked');
                $this.find('input').attr('checked',true);

                _self.addContent( index+1 ,parentId ,function( data ){
                    if( data['data']&& index<_self.degree-1 ){
                        backData = data.data;
                        // 显示
                        _self._t.show();
                        $.each(_self._t, function(i, v){
                            if (i > index+1) {
                                $(this).hide();
                            }
                        });
                        _self.tab( index+1 );
                    }else{
                        var _backData;
                        for(var i=0;i<backData.length;i++){
                            if(backData[i].id == $this.attr("data-value")) {
                                _backData = backData[i];
                            }
                        }
                        $.each(_self._t, function(i, v){
                            if (i > index) {
                                $(this).hide();
                            }
                        });
                        // 给后台存值
                        _self.setValForHidden();
                        // 关闭界面
                        // 点击最后一个内容后的回调函数;
                        _self.setChangeBack(_backData);
                    }
                });
            });

        },
        // 设置返回后调用的公用函数
        setChangeBack : function(v){
            var _self = this;
            if(_self.changeCallBackUrl!=''){
                _self.ajax(_self.changeCallBackUrl, {
                    deliveryType: 1,
                    deliveryId: v.deliveryId,
                    shopId: getParameterByName('shopId',window.location),
                    buyType: getParameterByName('buyType',window.location),
                    transportConfigId: v.transportConfigId,
                    selfId: v.selfId
                },
                function(data) {
                    _self.changeCallBack( data );
                    _self.lastChangeCallBack( data );
                });
            }else{
                _self.changeCallBack(  );
                _self.lastChangeCallBack(  );
            }


        },
        // 添加内容
        addContent : function( index ,parentId ,callback ){
            var _self = this;
            var params = {
                pid: parentId
            };
            if(!params.pid) {
                params.loop = 0
            }
            _self.ajax(_self.url, params,
            function(data) {
                if(data && data.data){
                    // 载入数据
                    _self._c.eq(index).find('.area-list').html(_self.addStr( data.data ,index));
                    _self.o.find('.jLoadBox').eq(index).hide();
                }
                // 回调
                callback && callback( data );
            })
        },
        // 给隐藏域填值
        setValForHidden : function( flag ){
            var _self = this;
            var textArr = [];
            var valArr = [];
            // 界面初始化
            if(flag){
                if(_self.selectedData!='' && _self.selectedData!=null && _self.selectedData.indexOf(':')>-1){
                    var dataArr = _self.selectedData.split(':');
                    var _txt = dataArr[0].split('_');
                    var _val = dataArr[1].split('_');
                    for(var j=0;j<_self.degree;j++){
                        textArr.push(_txt[j]);
                        valArr.push(_val[j]);
                    }
                }else{
                    return false;
                }
            }else{
                _self._t.each(function(i,v){
                    if($(this).closest('li').attr('display')!='none'){
                        textArr.push( $(this).text() );
                        valArr.push( $(this).attr('data-value') );
                    }
                })
            }
            // 最终value,取数组的最后一个值
            var lastValue = valArr[ valArr.length-1 ];
            $('#'+_self.lastValueId).val(lastValue);
        }
    };
    return function(opt ,param){
        return new LinkageTab(opt ,param);
    }
});
