require.config({
    baseUrl: '//ssl.bbgstatic.com/super/js',
    paths: {
		'pub-lib': 'common',
        'lib':'//ssl.bbgstatic.com/lib',
        'jquery': 'common/zeptojs/1.1.5/zepto-factory',
        'template': "lib/template/3.0/template",
        'mobileapi': '//ssl.bbgstatic.com/mobile/common-api/js/api-0.16',
        'jqueryweui': 'common/jquery-weui/1.0.0/jquery-weui',
        'radialIndicator':'module/park/1.0.0/radialIndicator'
    },
    shim: {
        "radialIndicator":{
            deps : ['jquery'],
            exports : 'radialIndicator'
        },
        'jqueryweui': {
            deps: ['jquery']
        }
    },
    config: {
        text: {
            useXhr: true
        }
    },
    crossOrigin: '*'
});

// 判断是否在小程序还是h5,
require(['common/small/1.0.0/small']);

if (!Function.prototype.bind) {
    require(['lib/es5-shim/4.0.3/es5-shim']);
}

// 共用的分享方法
require(['common/wx/1.0.0/share'], function(share){
    share()
}); 

// 获取渠道信息传递给后台
require(['common/tk/1.0.0/tk'], function(Tk){
    Tk.init();
});
//获取小程序过来的tokenId;然后将tokenId保存到cookie中
require(['common/base/jweixin-1.3.0','lib/core/1.0.0/io/cookie'],function(wx,cookie){
    if(window.__wxjs_environment === 'miniprogram'){
        var searchArr=window.location.search.replace('?','').split('&');
    
        for(var i=0;i<searchArr.length;i++){
            var keyValue=searchArr[i].split('=');
            var key=keyValue[0];
            var value=keyValue[1];
    
            if(key=='tokenId'){
                cookie.set('tokenId',value);
                break;
            }
        }
    }
})







