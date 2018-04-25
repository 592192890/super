/**
 * @file presale.js
 * @synopsis  申请售后详情
 * @author scott, 592192890@qq.com
 * @version 1.0.0
 * @date 2017-03-15
 *
 */

define(function(require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        cookie = require('lib/core/1.0.0/io/cookie'),
        Lazyload = require('lib/plugins/lazyload/1.9.3/lazyload'),
        context=require('lib/gallery/context/1.0.0/context');
        

        // main method:start point of program
        init();
        //图片懒加载	 
        function lazyload(){
            return new Lazyload('.jLazy', {
                effect: 'fadeIn', // 加载效果
                dataAttribute: 'src', //data属性默认src 
                skipInvisible: false,  // 是否跳过隐藏图片
                loadingClass: 'img-loading', //设置懒加载图片classname
                placeholder: '//ssl.bbgstatic.com/super/images/common/error-img.png' // 设置加载前占位图片
            });
        };
        function changeProcessHeaderColor(className,color){
            // $('.'+className).css('color',color);
            $('.'+className+".ball").css('background-color',color);
            $('.'+className+".process-line").css('background-color',color);
        }
        //judge process: apply processing, apply failure or apply cancel to show related div in header
        //apply processing div's id name is ：jNormal
        //apply failure div's id name is:jFailure
        //apply cancel div's id name is jCancel
        function judgeProcess(processName){
            if(processName=='审核中'){//normal：待审核
                $('.jProcess-first').css('color','#f95d5b');
                changeProcessHeaderColor('jProcess-first','#f95d5b');
                
            }else if(processName=='退货审核通过'){//normal:退货审核通过
                $('.jProcess-second').css('color','#f95d5b');
                changeProcessHeaderColor('jProcess-first','#f95d5b');
                changeProcessHeaderColor('jProcess-second','#f95d5b');

                
            }else if(processName=='退款中'){//normal:退款中
                $('.jProcess-third').css('color','#f95d5b');
                changeProcessHeaderColor('jProcess-first','#f95d5b');
                changeProcessHeaderColor('jProcess-second','#f95d5b');
                changeProcessHeaderColor('jProcess-third','#f95d5b');
                


            }else if(processName=='退款成功'){//normal:退款成功
                $('.jProcess-fourth').css('color','#f95d5b');
                changeProcessHeaderColor('jProcess-first','#f95d5b');
                changeProcessHeaderColor('jProcess-second','#f95d5b');
                changeProcessHeaderColor('jProcess-third','#f95d5b');
                changeProcessHeaderColor('jProcess-fourth','#f95d5b');
            }
            
        }

        function getStatusNameById(statusId){
            var statusName="";
            // 1:取消 2：审核中 3：同意 4：完成 5：审核失败 6：等待退款 7：退款中 8：退款成功 9：退款失败
            var arr=[
                {id:2,name:'审核中'},
                {id:3,name:'退货审核通过'},

                {id:4,name:'退款成功'},

                {id:6,name:'退款中'},
                {id:7,name:'退款中'},

                {id:8,name:'退款成功'}
                ];
            for(var i=0;i<arr.length;i++){
                var item=arr[i];
                if(statusId==item.id){
                    statusName=item.name;
                    break;
                }
            }

            return statusName;
        }
        function init(){
            //judge porcess to show or hide related div in header
            var statusId=context.getConf('statusType');
            
            var processName=getStatusNameById(statusId);
            // 只需关注非申请失败和取消申请的header样式，其他header有后端PHP负责
            if(processName!=""){
                judgeProcess(processName);
            }
            

            lazyload();
            
        }

    
   
});
