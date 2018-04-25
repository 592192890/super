{{ if isPreSale }}
    <div class="price-hd">
        <span class="item-price" id="jPrice">预售价￥ {{ totalPrice }}</span>
        <!-- span class="original-price" id="originalPrice">市场价<del>￥ {{originalPrice}}</del></span -->
        <span class="items-sold" id="jSoldNums">已售{{ soldNums }}件</span>
    </div>
    <div class="deposit" id="jDeposit">
        <span>定金{{ prePrice }}</span>
    </div>
    <div class="price-bd">
        <div class="tail-money" id="jTailMoney">尾款￥<span>{{ retainage }}</span></div>
        <div class="payment-date" id="jDeadline">{{ retainageTips }}</div>
    </div>
{{ else }}
    <div class="price-hd">
        <span class="item-price" id="jPrice">预售价￥ {{ totalPrice }}</span>
        <span class="original-price" id="originalPrice">市场价<del>￥ {{originalPrice}}</del></span>
        <span class="items-sold" id="jSoldNums">已售{{ soldNums }}件</span>
    </div>
{{ /if }}