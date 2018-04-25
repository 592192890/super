<!-- 自提信息 begin -->
<div class="ui-list line mod-selfzt">
	<div class="list-hd">
		<div class="hd-l">自提门店</div>
		<div class="hd-r">
		    {{if selfZtdCounts == 1}}
		    <!-- 自提点个数等于1不添加跳转 -->
                <span class="text">{{selfName}}</span>
                <input type="hidden" class="order-selfzt" value="{{selfName}}" />
            {{ else }}
                <!-- 自提点个数大于1添加跳转 -->
                {{if src == 1}}
                    <!-- src来源自提点选择页面 -->
                    <span class="text arrow selectZtStore" data-buytype={{buyType}} data-shopid={{shopId}}>{{selfName}}</span>
                    <input type="hidden" class="order-selfzt" value="{{selfName}}" />
                {{ else }}
			        <span class="empty text arrow selectZtStore" data-buytype={{buyType}} data-shopid={{shopId}}>请选择自提门店</span>
			        <input type="hidden" class="order-selfzt" value="" />
			    {{ /if }}
			{{ /if }}
		</div>
	</div>
</div>
<div class="ui-list line mod-selfzt">
	<div class="list-hd">
		<div class="hd-l">自提时间</div>
		<div class="hd-r">
		    {{if preSaleTime}}
		        <span class="text">{{sendTime}} 至 {{sendEndTime}}</span>
			{{ else }}
			    <!--span class="text">请在指定时间内至门店自提</span-->
			    <span class="text arrow zttime"><label class="color-f85d5b">请在20:00前到门店自提</label><input type="hidden" data-zttime /></span>
			{{ /if }}
		</div>
	</div>
</div>
<!--
<div class="ui-list line mod-selfzt">
	<div class="list-hd">
		<div class="hd-l">自提人/自提手机号</div>
		<div class="hd-r">
			<span class="text arrow jSelfMention">{{shipName}}/{{shipMobile}}</span>
		</div>
	</div>
</div>
-->
<!-- 自提信息 end -->
