<div class="sec-kill-head">
    <div class="title">今日秒杀</div>
    <a href="#" class="countTime" id="jCountTime">本场倒计时
        <span id="jCount" class="jCount"></span>
        <span class="bder"><i class="icon iconfontmod">&#xe772;</i></span>
    </a>
</div>
<div class="sec-kill-ctn">
    <div class="items" id="jSecKill">
        {{ each lists as list i}}
        <a href="//wx.yunhou.com/super/item/{{list.productId}}.html">
            <dl>
                <dt>
                    <img src="{{ list.activityImg}}">
                </dt>
                <dd>
                    <div class="price">￥{{list.mktprice}}</div>
                    <div class="discount">￥<b>{{ list.secPrice }}</b></div>
                </dd>
            </dl>
        </a>
        {{ /each }}
        {{ if secKillBrief }}
        <a href="{{secKillBrief.secKillUrl}}">
            <dl>
                <dt>
                    <img src="https://ssl.bbgstatic.com/super/images/conf/meixi-index/more.png">
                </dt>
                <dd>
                </dd>
            </dl>
        </a>
        {{ /if }}
    </div>
</div>
