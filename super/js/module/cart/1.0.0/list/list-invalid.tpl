{{ if invalidProducts && invalidProducts.length!=0 }}
<div class="mod-item" id="jInvalidProducts">
	<div class="item-bd" >
	{{# _html }}
	</div>
	<div class="mod-oper">
		<button class="ui-button ui-button-red-border" id="jEmptyFailPro">清除失效商品</button>	
	</div>
</div>
{{ /if }}
