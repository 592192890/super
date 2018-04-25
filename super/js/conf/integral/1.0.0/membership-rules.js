/* 
* @Author: zgc
* @synopsis  会员规则
* @Date:   2017-06-16 17:51:27
* @Last Modified by:   zgc
* @Last Modified time: 2017-06-19 09:19:06
*/

define(function(require, exports, module) {
    'use strict'; 
    var $ = require('jquery'),
        toTop = require('common/ui/nav/back2top'),
        opt;
    
    opt={
        init:function(){
            this.event();
        },
        event:function(){

            $('h1').click(function() {
                /* Act on the event */
                $('h1').removeClass('active');
                $(this).addClass('active');
                if($(this).hasClass('jPoint')){
                    $('.jPointWrap').show();
                    $('.jEquityWrap').hide();
                }else{
                    $('.jEquityWrap').show();
                    $('.jPointWrap').hide();
                }
            });
            
        }
    };


    opt.init();//初始化
})