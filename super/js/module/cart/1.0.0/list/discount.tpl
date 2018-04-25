<!-- 满减信息 begin -->
{{ if promotions.length}}
<div class="ui-list mod-discount">
	<div class="list-bd">
		<ul class="ul-line">
			{{ each promotions as prom }}				
				{{if prom.toolCode == "ump-goods-laddernum"}}
					<li class="txt-overflow"><span class="icon color-f85d5b">促销</span>{{ prom.ad }}</li>
				<!-- 订单级 begin -->				
				{{else if prom.toolCode == "ump-order-mlj"}}
					<li class="txt-overflow"><span class="icon color-f85d5b">满减</span>{{ prom.ad }}</li>
				<!-- 订单级 end -->
				<!-- 商品级 begin -->
				{{else if prom.toolCode == "ump-goods-mlj"}}
					<li class="txt-overflow"><span class="icon color-f85d5b">满减</span>{{ prom.ad }}</li>
				<!-- 商品级 end -->
				{{else if prom.toolCode == "ump-order-cheap"}}
					<li class="txt-overflow"><span class="icon color-f85d5b">减免</span>{{ prom.ad }}</li>
				
				{{else if prom.toolCode == "ump-order-comb"}}
					<li class="txt-overflow"><span class="icon color-f85d5b">组合</span>{{ prom.ad }}</li>
				
				{{else if prom.toolCode == "ump-goods-discount"}}
					<li class="txt-overflow"><span class="icon color-f85d5b">折扣</span>{{ prom.ad }}</li>
				{{/if}}
			{{ /each }}
			<!-- 包邮描述,暂时取消 begin -->
			{{ if totalFreight == "0.00" && false}}
				<li class="txt-overflow">
					<span class="icon color-f85d5b">包邮</span>
					<span class="deliverie">
					{{each deliveries as deliverie}}
						{{ if deliverie.type !== 2}}
						<div><span>{{deliverie.title}}</span><span class="description">{{deliverie.description}}</span></div>
						{{ /if }}
					{{/each}}
					</span>
				</li>
			{{ /if }}
			<!-- 包邮描述 end -->
		</ul>	
	</div>
</div>
{{ /if }}
<!-- 满减信息 end -->
