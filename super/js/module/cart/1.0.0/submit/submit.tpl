{{ if _products && _products.length!=0 }}
<!-- 底部浮层 begin -->
<div class="mod-float-layer" id="jFloatLayer">
	<div class="layer-bd">
		<input type="checkbox" id="jChkAll" {{ _checked }}/>全选
		<div class="mod-toggle {{ _selectedClass }}" id="jOperBtn">
			<div class="layer-r toggle-item">
				<div class="r-text">
				<p>合计：￥<span id="jTotalPrice">{{ totalProductPrice }}</span></p>
				<span class="sub-text color-999">原价:￥{{ totalPrice }}</span>
				{{if totalPmt == 0}}
				    <span class="sub-text color-999" style="margin-left:10px">优惠:￥0</span>
				{{else}}
				    <span class="sub-text color-999" style="margin-left:10px">优惠:￥-{{ totalPmt }}</span>
				{{/if}}
				</div>
				<button class="ui-button" id="jSubmit" {{ _btnStatus }}>去结算({{ totalQuantity }})</button>	
			</div>
			<div class="layer-r toggle-item">
				<!-- button class="ui-button ui-button-red-border" id="jFavorites" >加入收藏</button> -->	
				<button class="ui-button ui-button-red-border" id="jDeleteAll" >清空购物车</button>	
				<button class="ui-button ui-button-red-border" id="jDelete" >删除</button>	
			</div>
		</div>
	</div>
</div>
<!-- 底部浮层 end -->
{{ /if }}
