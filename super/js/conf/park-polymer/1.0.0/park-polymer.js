/**
 * @file park-polymer.js
 * @synopsis  停车聚合页
 * @author zgc, 839153198@qq.com
 * @version 1.0.0
 * @date 2018-01-12
 */
define(function (require, exports, module) {
    'use strict';

    var $ = require('jquery'),
        io = require('lib/core/1.0.0/io/request'),
        context = require('lib/gallery/context/1.0.0/context'),
        box = require('common/box/2.0.0/js/box'),
        template = require('common/template/1.0.1/template'), //模板
        findCarTpl = require('text!./inroom-find-car.tpl'),
        parkTpl = require('text!./pay-park.tpl'),
        ruleTpl = require('text!./park-rule.tpl'),
        addPlateTpl = require('text!./add-plate.tpl'),
        renderPlateTpl = require('text!./render-plate.tpl'),
        searchPlate = require('text!./search-plate.tpl'),
        wx = require('common/base/jweixin/1.0.0/jweixin-1.3.2'),
        TaskDaemon = require('lib/core/1.0.0/utils/daemon'),
        licenseAddr = require('module/parking-payment/1.0.0/license-address'),
        bindNum = parseInt($('#jBindNum').text()),
        $jLicencePlate = $('.jLicencePlate'),
        getCarsUrl = context.getConf('url.getCars'),
        positionConfig = context.getConf('url.getIndoorMap'),
        addCarUrl = context.getConf('url.addcar'),
        searchUrl = context.getConf('url.search'),
        isSmart = parseInt( context.getConf('isSmart') ),
        isCharge = parseInt( context.getConf('isCharge') ),
        mapUrl = 'https://lbs.gtimg.com/visual/3dIndoorMap_online/index.html?bid=430100223777&showfc=true&search=safdsa&cid=430100&minZoom=16&key=RJWBZ-GXELX-M7V4F-7AASW-OR2TV-JIBS6&referer=meixixtd&from=groupmessage&isappinstalled=0',
        parkPolymoer, parkPosition, $plateActive, plateActiveTop,dBox;
    if ($('#jAnimate').length) {
        var animateTop = $('#jAnimate').css('transform').split(',')[5].split(')')[0]
    }
    // var FastClick = require('module/baby/1.0.0/fastclick')
    // FastClick.attach(document.body);
    // console.log(animateTop)
    $jLicencePlate.each(function (index, item) {
        if ($(item).find('.jLicenceTxt').length == 1) {
            $plateActive = $(item);
            plateActiveTop = parseInt($plateActive.css('top'));
            // console.log(plateActiveTop)
        }
    })

    function renderTmpl(tpl, data) {
        return template.compile(tpl)(data || {});
    }

    function getUrlParam(url, name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = url.split('?')[1].substr(0).match(reg);
        if (r != null) return unescape(r[2]);
        return null;
    }

    parkPolymoer = {
        init: function () {
            this.bindEvent();
        },
        bindEvent: function () {
            var self = this;
            self.chooseLicencePlate();
            self.findCarInroom();
            self.payForPark();
            self.parkRule();
            self.bindPlate();
            licenseAddr.popBoxEvent();
            self.searchCar();
            wx.miniProgram.getEnv(function(res) {
                if(!res.miniprogram){return} 
                self.backToMini();
            })
        },
        chooseLicencePlate: function () {
            var self = this;
            if (bindNum <= 1) {
                return
            } //只有一个车牌
            $jLicencePlate.click(function () {
                var _this = this;
                var thisPlate = $(_this).attr('data-plate'),
                    thisPlateIndex = $(_this).index();

                if ($(_this).find('.jLicenceTxt').length == 1 || $(_this).hasClass('clicked')) { //已选中车牌,正在动的
                    // console.log('不做操作');
                    return;
                }

                $(_this).addClass('clicked');
                TaskDaemon.delay(function () {
                    $('#jMaskLayer').css('display', 'block');
                    $('#jAnimate .jLicenceTxt').text(thisPlate);
                    $('#jAnimate').css('display', 'block').removeClass('visib');
                    TaskDaemon.delay(function () {
                        $('#jAnimate').css('transform', 'translateY(' + plateActiveTop + 'px)')
                    }, 10)
                    TaskDaemon.delay(function () {
                        var licenceArr = new Array();
                        $jLicencePlate.each(function (index, item) {
                            licenceArr.push($(item).attr('data-plate'));
                        })
                        // console.log(bindNum);
                        if (bindNum == 2) { //只可能点第2个 [1]
                            var temp = licenceArr[0];
                            licenceArr[0] = licenceArr[1];
                            licenceArr[1] = temp;
                            // console.log(licenceArr)
                            self.changePlate(licenceArr);
                        } else if (bindNum == 3) {
                            if (thisPlateIndex < 1) {
                                var temp = licenceArr[0];
                                licenceArr[0] = licenceArr[1];
                                licenceArr[1] = temp;
                                self.changePlate(licenceArr);
                            } else {
                                var temp = licenceArr[1];
                                licenceArr[1] = licenceArr[2];
                                licenceArr[2] = temp;
                                self.changePlate(licenceArr);
                            }
                        }
                        $('#jMaskLayer').css('display', 'none');
                        $('#jAnimate').css('display', 'none');
                        $plateActive.addClass('jumped');
                        TaskDaemon.delay(function () {
                            $('#jAnimate').css({
                                'transform': 'translateY(' + animateTop + 'px)'
                            })
                        }, 10)
                    }, 1000) //滑动动画1s
                }, 300);
                TaskDaemon.delay(function () {
                    $(_this).removeClass('clicked');
                    $plateActive.removeClass('jumped');
                }, 1200);

            })
            // $('#jAnimate').on('transitionend webkitTransitionEnd oTransitionEnd', function () {
            //     $('#jAnimate').css('display','none');
            // });
        },
        changePlate: function (arr) {
            // console.log(arr);
            var arrLength = arr.length;
            $jLicencePlate.each(function (index, item) {
                $(item).attr('data-plate', arr[index]);
                if ($(item).find('.jLicenceTxt').length == 1) {
                    var $jLicenceTxt = $(item).find('.jLicenceTxt');
                    if (bindNum == 3) {
                        $jLicenceTxt.text(arr[1])
                    } else if (bindNum == 2) {
                        $jLicenceTxt.text(arr[0])
                    }
                } else {
                    $(item).text(arr[index]);
                }
            });
        },
        findCarInroom: function () {
            var self = this;
            $('.jLicencePlate').on('click', '.jFindCar', function () {
                var licenseNum = $(this).parents('.jLicencePlate').find('.jLicenceTxt').text();
                
                io.post(getCarsUrl, {
                    carNo: licenseNum,
                    shopId: context.getConf('shopId')
                }, function (res) {
                    parkPosition = res.data.parkPosition; //判断没有的情况
                    var a = box.create(renderTmpl(findCarTpl, res.data), {
                        modal: true,
                        fixed: true
                    });
                    self.popupEvent(a);
                    a.show();
                }, function (res) {
                    box.error(res.msg);
                    if (res.error == -100) { //未登录
                        // box.error(res.msg);
                        setTimeout(function () {
                            window.location.href = context.getConf('url.loginUrl') + location.href;
                        }, 1500);
                    }
                    if (res.error == 101) {
                        return;
                    } //无停车信息
                }, this)
            })
            $('body').on('click', '.jToNavigate', function () {
                // var tokenId = getUrlParam(location.href,'bbgtoken');
                if(!parkPosition){
                    box.error('未找到车位信息！');
                    return;
                }
                io.get(positionConfig, {
                    // bbgtoken: bbgtoken,
                    keyword: parkPosition, //'D109',
                    shopId: context.getConf('shopId')
                }, function (res) {
                    var navigationData = res.data.navigation[0];
                    var paramArr = [navigationData.title, navigationData.floor_name, navigationData.location.lng, navigationData.location.lat];
                    var navigationParam = '&navigation=;' + paramArr.join(','); //key字段是否需要变
                    window.location.href = mapUrl + navigationParam;
                }, function (res) {
                    box.error(res.msg)
                }, this);
            })
        },
        payForPark: function () {
            var self = this;
            $('.mod-my-licence').on('click', '.jPayForPark',function () {
                //先判断有无缴费信息
                var licenseNum = $(this).parents('.jLicencePlate').find('.jLicenceTxt').text();
                io.get(getCarsUrl, {
                    carNo: licenseNum,
                    shopId: context.getConf('shopId')
                }, function (res) {
                    if( getUrlParam(location.href, 'appSource') && getUrlParam(location.href, 'appSource') == 'bbgPlus'){
                        var miniprogram = 1;//步步高+
                    }else{
                        var miniprogram = 2;//easygo
                    }
                    window.location.href = res.data.payUrl + '&carNo=' + licenseNum +
                    '&miniprogram=' + miniprogram + '&openid=' + getUrlParam(location.href, 'openid');
                }, function (res) {
                    if (res.error == -100) { //未登录
                        box.error(res.msg);
                        setTimeout(function () {
                            window.location.href = context.getConf('url.loginUrl') + location.href;
                        }, 1500);
                    } else if (res.error == 101) { //无停车信息
                        var b = box.create(renderTmpl(parkTpl, {
                            channel: getUrlParam(location.href, 'channel')
                        }, {
                            licenseNum: licenseNum
                        }), {
                            modal: true,
                            fixed: true
                        });
                        self.popupEvent(b);
                        b.show();
                    } else {
                        box.error(res.msg);
                    }
                }, this)
            })
        },
        popupEvent: function (box) {
            $('body').on('click', '.jQueryOtherBtn', function () {
                box.hide();
                return;
            })
            $('body').on('click', '.jCloseBox', function () {
                box.hide();
                return;
            })
            $('body').on('click', '.ui-layer-mask', function () {
                box.hide();
                return;
            })
        },
        backToMini: function () {
            var state = {
                title: "title",
                url: ""
            };
            window.history.pushState(null, null, null);
            window.addEventListener("popstate", function (e) {
                wx.miniProgram.reLaunch({
                    url: '/pages/homepage/homepage?appSource=h5'
                })
            }, false);
        },
        parkRule: function () {
            var self = this;
            $('.jParkRules').click(function () {
                var c = box.create(renderTmpl(ruleTpl), {
                    modal: true,
                    fixed: true
                });
                self.popupEvent(c);
                c.show();
            })
        },
        bindPlate: function () {
            var self = this;
            $('#jBindPlate').click(function () {
                dBox = box.create(renderTmpl(addPlateTpl), {
                    modal: true,
                    fixed: true
                });
                self.popupEvent(dBox);
                dBox.show();
            })
            $('body').on('click','#jBindBtn',function(d){
                var carNumber = $('.jAreaTxt').text() + $('.jLicenseNum').val();
                // /^[\u4e00-\u9fa5][A-Z](?![A-HJ-NP-Z]{5})[A-HJ-NP-Z\d]{5}$/
                if (!(/^[\u4e00-\u9fa5][a-zA-Z](?![a-hj-np-zA-HJ-NP-Z]{5})[a-hj-np-zA-HJ-NP-Z\d]{5}$/.test(carNumber))) {
                    box.error('请输入正确的车牌！');
                    return;
                }
                io.post(addCarUrl, {
                    carNo: carNumber.toUpperCase() //转成大写
                }, function (res) {
                    box.ok(res.msg);
                    var tpl = renderTmpl(renderPlateTpl,{isSmart:isSmart,isCharge:isCharge,carNo:carNumber});//0 不收费 不支持导航
                    $('.licence-list.none').remove();
                    $('.mod-my-licence').append(tpl);
                    dBox.hide();
                }, function (res) {
                    box.error(res.msg);
                }, this)
            })
        },
        delay: (function () {
            var timer = 0;
            return function (callback, time) {
                clearTimeout(timer);
                timer = setTimeout(callback, time);
            };
        })(),
        searchCar: function () {
            var self = this;
            $('body').on('input','.jLicenseNum',function(event){
                event.preventDefault();
                var _this = this;
                var searchNum= $('.jLicenseNum').val();//暂时只支持后5位模糊查询
                if (searchNum.length < 0) {
                    // box.error('最少输入3位~');
                    return;
                }
                self.delay(function(){
                    io.post(searchUrl, {
                        carNo: searchNum
                    }, function (res) {
                        if(res.data && res.data.length){
                            $('.jNoSearch').addClass('hide');
                            $('.jRelevance').html(renderTmpl(searchPlate,res)).removeClass('hide');
                        }else{
                            $('.jNoSearch').removeClass('hide'); 
                            $('.jRelevance').addClass('hide');
                        } 
                    }, function (res) {
                        $('.jNoSearch').removeClass('hide'); //显示提示信息
                        $('.jRelevance').addClass('hide');//隐藏搜索
                    })
                }, 500);
                
            })
            $('body').on('click', '.jRelevance li', function () {
                var numBack = $(this).text().substr(-5);
                var numFront = $(this).text().split(numBack)[0];
                $('.jLicenseNum').val(numBack.substr(-5))
                $('.jAreaTxt').text(numFront);
            })
        }
    }
    parkPolymoer.init(); //初始化
});