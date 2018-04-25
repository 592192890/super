/**
 * @file presale.js
 * @synopsis  物流信息
 * @author scott, 592192890@qq.com
 * @version 1.0.0
 * @date 2017-03-15
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        context=require('lib/gallery/context/1.0.0/context'),
        Box = require('common/box/1.0.0/box'),
        cookie = require('lib/core/1.0.0/io/cookie');
    //submit form object
    var formEntity={
        reverseId:context.getConf('reverseId'),
        expressNo:null,
        type:1,
        expressCompanyId:null,// 物流公司ID
        expressCompanyName:null
    };
    // main method:start point of program
    init();
    //validate form
    function isValid(){
        var result={
            result:true,
            tip:''
        }
        if(!formEntity.expressCompanyId){
            result.result=false;
            result.tip="物流公司必填";
            return result;
        }
        if(!formEntity.expressNo){
            result.result=false;
            result.tip="物流单号必填";
            return result;
        }
        return result;
    }
    function init(){
        var submitFlowUrl=context.getConf('url.submitFlow');

        // toggle betwwen two select type
        $(".jFirstSelect").on('click',function(){
            $(this).addClass('active');
            $('.jSecondSelect').removeClass('active');

            $(".jFlowNumber").hide();

            //set type
            formEntity.type=1;
        });
        $(".jSecondSelect").on('click',function(){
            $(this).addClass('active');
            $('.jFirstSelect').removeClass('active');

            $(".jFlowNumber").show();

            //set type
            formEntity.type=2;
        });

        $(".jFlowNumber select").on('change',function(){
            //set expressCompanyId and expressCompanyName
            formEntity.expressCompanyId=$(this).find("option:selected").val();
            formEntity.expressCompanyName=$(this).find("option:selected").text();
            
        });
        $(".jFlowNumber input").on('input',function(){
            //set flow number
            formEntity.expressNo=$(this).val();
        });
        $('#jSubmitFlow').on('click',function(){
            if(formEntity.type==2){
                var validResult=isValid();
                if(!validResult.result){
                    Box.error(validResult.tip);
                    return;
                }
            }else{
                $(".jFlowNumber input").val('');
                $(".jFlowNumber select").find("option").eq(0).prop("selected",true)
                formEntity.expressCompanyId=null,// 物流公司ID
                formEntity.expressCompanyName=null
            }
            io.post({
                url:submitFlowUrl,
                data:formEntity,
                success:function(result){
                    // location.href="//wx.yunhou.com/super/html/conf/after-sale/1.0.0/flow-info.html"
                    if(result.error==0){
                        location.href=result.data.url;
                    }else{
                        Box.error(result.msg);
                    }
                },
                error:function(err){
                    Box.error(err.msg);
                }
            })
        });
    }
    
   
});
