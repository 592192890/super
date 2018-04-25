<div class="mod-item">
	<div class="ui-list">
		<div class="list-hd">
			<div class="hd-l">商品总计</div>
			<div class="hd-r">
				<span class="text color-f85d5b">￥{{  totalPrice }}</span>
			</div>
		</div>
	</div>
	<div class="ui-list">
		<div class="list-hd">
			<div class="hd-l">运费总计</div>
			<div class="hd-r">
				<span class="text color-f85d5b">￥{{ totalFreight }}</span>
			</div>
		</div>
	</div>
	{{ if !_isNormalPreSale }}
	<div class="ui-list">
		<div class="list-hd">
			<div class="hd-l">优惠总计</div>
			<div class="hd-r">
				<p class="text color-f85d5b">￥<span id="jShippingTotal">{{ totalPmt }}</span></p>
			</div>
		</div>
	</div>
	{{ /if }}
</div>
