{{ if items && items.length!=0 }}
{{ each items as item }}
	<!-- onclick="location.href='{{ _imgPath+item.productId }}.html'" -->
	<div class="mod-list-pro tap-lt {{ _listClass }}"  data-id="{{ item.productId }}" >
		<div class="list-bd">
			<div class="bd-img">
				<div class="img-box">
				    {{ if item._flag }}
					<span class="flag">{{ item._flag }}</span>
					{{ /if }}
					<img src="https://ssl.bbgstatic.com/super/images/common/blank.gif" data-src="{{# getImgByType(item.productImage,'l1') }}" class="jImg"/>
				</div>
			</div>
			<div class="bd-ctn">
				<div class="ctn-box">
					<h3 class="box-title">{{ item.productName }}</h3>
					<div class="box-tips">{{ item._spec  }}</div>
					{{ if item.catchWeightInd == 'Y' }}
					<div class="box-weight">
					    <span class="spec">规格：约 {{item.weight}} kg</span>
					    <span class="unitprice">单价：￥{{item.unitPmt}}/kg</span>
					    <!-- <span class="cprice">￥44.00</span> -->
					</div>
					{{ /if }}
					<div class="box-txt">
						<span class="jPriceSpan" >￥{{ item.bargainPrice }}</span>
					</div>
					<span class="box-num jQutySpan">{{ item._quantity }}</span>
				</div>
			</div>
		</div>
	</div>
{{ /each }}
{{ /if }}
