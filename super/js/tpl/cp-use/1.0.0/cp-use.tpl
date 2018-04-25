{{ if couponList && couponList.length!=0 }}
{{ each couponList as coupon }}
    <div class="mod-coupon-item jItemBox coupon-{{ coupon.code }} {{ coupon.class }}" data-value="{{ coupon.code }}">
        <!-- 优惠券头部边框 -->
        <div class="item-hd"></div>
        <!-- 已使用图戳 -->
        <img src="//ssl.bbgstatic.com/super/images/conf/my-cplist/1.0.0/cpUsed.png" alt="已使用" class="used-img">
        <!-- 选中状态 -->
        <div class="selected">
            <b class="triangle"><i class="iconfontmod">&#xe614;</i></b>
        </div>
        <!-- 优惠券主体 -->
        <div class="item-bd jCouponItem">
            <!-- 优惠券价格 -->
            <div class="cp-money">
                {{ if coupon.title }}
                    {{# coupon.title }}
                {{ /if }}
            </div>
            <!-- 优惠券名字 -->
            <div class="cp-name txt-overflow">
                {{ if coupon.name }}
                    {{ if couponType }}
                    <span>{{ couponType }}</span>
                    {{ /if }}
                {{ coupon.name }}
                {{ /if }}
            </div>
            <!-- 优惠券时间 -->
            <div class="cp-time">
                {{ if coupon.effectStartTime }}
                使用时间：{{ coupon.effectStartTime }}~
                {{ coupon.effectEndTime }}
                {{ /if }}
            </div>
        </div>
        <!-- 优惠券齿轮边 -->
        <div class="cp-spilt">
            <span class="left-circle"></span>
            <span class="right-circle"></span>
        </div>
        <!-- 使用规则 -->
        {{ if false }}
        <!-- 隐藏优惠券规则 -->
            <div class="jShowCouponInfo cp-rule">
                <div class="rule-title clearfix">
                    <i class="ico-circle "></i>使用规则
                    <i class="iconfontmod animate f-r jCouponArrow">&#xe774;</i>
                </div>
                <div class="rule-bd jItemCtn">
                    {{ each infoList as info }}
                    <p class="text-left">{{ info.info }}</p>
                    {{ /each }}
                    <!-- 占位让图标显示 -->
                    <p class="icon"><i class="iconfontmod">&#xe7bb;</i></p>
                </div>
            </div>
        {{ /if }}
    </div>
{{ /each }}
{{ else }}
<div class="none-cp">
    <img src="//ssl.bbgstatic.com/super/images/conf/use-coupon/1.0.0/no-coupon.png" alt="">
    <p>暂无可用优惠券</p>
</div>
{{ /if }}