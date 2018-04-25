{{ if groups && groups.length!=0 }}
<!-- 店铺信息 begin -->
<div class="mod-item">
	<!-- list begin -->
    {{ each groups as list }}
        <div class="shop-wrap" data-shopid= {{list.shopId}}>
            <div class="item-hd">
                <!-- {{ list.twoDomain }} -->
                <i class="icon iconfontmod">&#xe7c1;</i><a class="text" href="javascript:void(0);">{{ list.shopName }}</a>
            </div>
            <div class="item-bd" >
                {{ each list.pkgs as pkg }}
                     {{# pkg._listProTpl }}
                {{ /each }}
            </div>

            <div class="ui-list line">
                <div class="list-hd">
                    <div class="hd-l">
                        支付方式
                    </div>
                    <div class="hd-r">
                        <span class="text">在线支付</span>
                    </div>
                </div>
            </div>
            {{# list._couponTpl }}
            {{# list._discountTpl}}
            {{if list._selfztTpl}}
                {{# list._selfztTpl}}
            {{ /if }}
            {{if list._distributeTimeTpl}}
                {{# list._distributeTimeTpl}}
            {{ /if }}
            {{# list._totalTpl }}
		</div>
    {{ /each }}
    <!-- list end -->
    {{# _preSaleTpl}}
</div>
<!-- 店铺信息 end -->
{{ /if }}
