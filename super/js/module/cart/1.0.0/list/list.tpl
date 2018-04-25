{{ if groups && groups.length!=0 }}
<!-- 店铺信息 begin -->
{{ each groups as list }}
<div class="mod-item jShop">
	<div class="item-hd">
		<input type="checkbox" class="jChkShop" {{ list._checked }}/>
		<a class="text txt-overflow" style="max-width:70%;">{{ list._shopName }}</a>
		{{ if list.shopTag }}
			<i class="icon iconfontmod">&#xe7c1;</i>
		{{ /if }}
	</div>
	<div class="item-bd" >
		{{ each list.warehouse_groups as pkg }}
			 {{# pkg._listProTpl }}  
			<!-- 商品合计 begin -->
			<!-- <div class="ui-list-hor">
				<span class="hor-r"><em class="color-999">商品合计：</em>￥{{ pkg.subtotal }}</span>
			</div> -->
			<!-- 商品合计 end -->
		{{ /each }}
	</div>
	{{# list._discountTpl}}
	<!-- <div class="mod-shop-total">
		<div class="ui-list-hor">
			<span class="hor-r"><em class="color-999">运费：</em>￥{{ list.totalFreight }}</span>
		</div>
		<div class="ui-list-hor">
			<span class="hor-r"><em class="color-999">订单优惠：</em>￥{{ list.totalPmt }}</span>
		</div>
		<div class="ui-list-hor">
			<span class="hor-r"><em class="color-999">本店合计</em>
			{{ if list.totalTaxPrice && list.totalTaxPrice.length!=0 }}
				(含税)
			{{ /if }}
			：<em class="color-f85d5b">￥{{ list.totalPrice_1 }}</em></span>
		</div>
	</div> -->
</div>
{{ /each }}
<!-- 店铺信息 end -->
{{ /if }}
