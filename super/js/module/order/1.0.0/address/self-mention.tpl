<!--
<div class="ui-list pickup-store">
	<div class="list-hd">
		<div>
			{{ if !shipName || shipName == '' || !shipMobile || shipMobile == ''}}
				<p id="jSelfMention" class="jAddressEmpty">亲，你还没有提货信息，请添加~</p>
			{{ else }}
                <div class="pickup-address ui-list line">
                    {{if selfName && address}}
                        <label>自提地址：</label>
                        {{if selfZtCount == 1}}
                            {{selfName}}
                            <span class="selected-address">{{address}}</span>
                        {{ else }}
                            <a href="/super/delivery?buyType={{buyType}}&shopId={{shopId}}" class="button">选择自提门店</a>
                            <p class="selected-address">
                                <span class="store">{{selfName}}</span>
                                <span class="address">{{address}}</span>
                            </p>
                        {{ /if }}
                    {{ else }}
                        <label>自提地址：</label><a href="/super/delivery?buyType={{buyType}}&shopId={{shopId}}" class="button">选择自提门店</a>
                    {{ /if }}
                </div>
                <div id="jSelfMention">
				    <p><label>自提人：</label>{{ shipName }}</p>
				    <p><label>手机号：</label>{{ shipMobile }}</p>
				</div>
			{{ /if }}
		</div>
		<div class="hd-r">
			<span class="arrow"></span>
		</div>
	</div>
</div>
-->
<div class="ui-list pickup-store">
	<div class="list-hd">
		<div>
			{{ if !name || !mobile }}
				<p id="jSelfMention" class="jAddressEmpty">亲，你还没有提货信息，请添加~</p>
			{{ else }}
                <div id="jSelfMention">
				    <p><label>自提人：</label>{{ name }}</p>
				    <p><label>手机号：</label>{{ mobile }}</p>
				</div>
			{{ /if }}
		</div>
		<div class="hd-r">
			<span class="arrow"></span>
		</div>
	</div>
</div>