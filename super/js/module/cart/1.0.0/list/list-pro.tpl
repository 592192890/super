{{ if items && items.length!=0 }}
{{ each items as item }}
	<div class="mod-list-pro mod-list-pro-chk tap-lt {{ item._listClass }} jProInfo" data-product-id="{{ item.productId }}" data-quantity="{{ item.quantity }}">
		<div class="list-bd">
			{{# item._chk }}
			<div class="bd-img" data-url="{{ _imgPath+item.productId }}.html" data-id="{{ item.productId }}">
				<div class="img-box">
				   {{ if item._flag }}
						<span class="flag">{{ item._flag }}</span>
					{{ /if }}
					<!-- 懒加载 or 直接加载 -->
					{{ if !item._isLoaded }}
						<img src="https://ssl.bbgstatic.com/super/images/common/blank.gif" data-src="{{# getImgByType(item.productImage,'l1') }}" class="jImg"/>
					{{ else }}
						<img src="{{# getImgByType(item.productImage,'l1') }}"  />
					{{ /if }}
					{{# item._maskTips  }}
				</div>
			</div>
			<div class="bd-ctn">
				<div class="ctn-box">
					<a class="box-title" data-url="{{ _imgPath+item.productId }}.html">{{ item.productName }}</a>
					<div class="box-tips">{{ item._spec  }}</div>
					{{ if item.catchWeightInd == 'Y' }}
                    <div class="box-weight">
                        <span class="spec">规格：约 {{item.weight}} kg</span>
                        <span class="unitprice">单价：￥{{item.unitPmt}}/kg</span>
                        <!-- <span class="cprice">￥44.00</span> -->
                    </div>
                    {{ /if }}
					<div class="box-txt">
						{{ if item.bargainPrice }}
							<span class="jPriceSpan">￥{{ item.bargainPrice }}</span>
						{{ /if }}
						<!-- {{ if item.mktprice }}
							<span class="txt-del">￥{{ item.mktprice }}</span> 
						{{ /if }} -->
					</div>
					{{# item._quantity }}
				</div>
			</div>
		</div>
	</div>
	{{# item._timeBuy }}
{{ /each }}
{{ /if }}
