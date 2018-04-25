{{ if false }}
<!-- 此段代码仅作为备份，根据原型修改订单优惠的展现方式，防止后面需求修改回来 -->
<div class="ui-list line mod-discount jTab2">
	<div class="list-hd tap-lt" role="tabItem">
		<div class="hd-l">已享受：<span class="color-f85d5b">{{ promotions.length }}</span>项优惠</div>
		<div class="hd-r">
			<span class="text arrow arrow-down">
			{{ if totalDiscount!=undefined }}
			共优惠￥ <span class="color-f85d5b">{{ totalDiscount }}</span>
			{{ /if }}
			</span>
		</div>
	</div>
	<div class="list-bd" role="tabPanel">
		<ul>
			{{ each promotions as prom }}
				<li class="txt-overflow"><span class="color-f85d5b">[{{ prom.toolName }}]</span>{{ prom.ad }}</li>
			{{ /each }}
		</ul>	
	</div>
</div>
{{ /if }}

{{ if promotions && promotions.length!=0 }}
<div class="ui-list mod-multiple">
    <div class="list-hd">
        <div class="hd-l">
            订单优惠
        </div>
        <div class="hd-r">
            {{ each promotions as prom }}
                {{ if prom.toolCode != 'ump-goods-groupbuy' && prom.toolName != 'GROUP_BUY' }}
                    <p>{{ prom.toolName }}</p>
                {{ /if }}
            {{ /each }}
        </div>
    </div>
</div>
{{ /if }}
