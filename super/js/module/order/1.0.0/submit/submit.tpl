<!-- 底部浮层 begin -->
<div class="mod-float-layer">
	{{# _submitTpl}}
	<div class="layer-bd">
		实付款:￥<span id="jTotalPrice">{{ totalRealPrice }}</span>
		<div class="layer-r">
			<a class="ui-button" id="jSubmit" data-hidinvoice="{{hidinvoice}}" data-s-tag="{{ submitTag }}" data-tips="{{ submitTips }}">提交订单</a>	
		</div>
	</div>
</div>
<!-- 底部浮层 end -->
