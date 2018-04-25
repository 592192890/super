<section class="mod-coupon">
    <div class="coupon">
        <dl class="coupon-lf">
            <dt><img src="https://ssl.bbgstatic.com/super/images/conf/coupon-share/1.0.0/logo.png"></dt>
            <dd>
                <span class="ticket">{{ticketName }}</span>
                <span class="usetime">使用时间：<i>{{ begintime && begintime.slice(5) }} - {{endtime &&  endtime.slice(5) }}</i></span></dd>
        </dl>
        <div class="coupon-rg">{{ticketPrice}}<span>元</span></div>
    </div>
</section>

<section class="mod-availableshop">
    <div class="availableshop">
        <i class="icon iconfontmod">&#xe79d;</i> <span>可用门店</span>
    </div>
    <div class="availableshop-ctn">
        <div class="content" id="jCtn">{{stores}}</div>
        </div>
    <div class="availableshop-btn" id="jCheckMore" status='fold'>
        <i class="icon iconfontmod">&#xe79e;</i> <span>查看更多</span>
    </div>
</section>

<section class="mod-validate">
    <i class="icon iconfontmod">&#xe7a0;</i> 有效时间：<span>{{ begintime }} - {{ endtime }}</span>
</section>

<section class="mod-rules">
    <div class="rules">
        <i class="icon iconfontmod">&#xe79f;</i> <span>使用规则</span>
    </div>
    <ul class="rules-ctn">
        <li><span class="ctn">{{instruction}}</span></li>
    </ul>
</section>

