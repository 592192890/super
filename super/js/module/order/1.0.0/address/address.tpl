<!-- 地址 begin -->
<div class="mod-item mod-address">
	<div class="item-hd">
		<i class="icon iconfontmod">&#xe620;</i>
		<!-- <span class="text">{{ localAddress }}</span> -->	
	</div>
	<div class="item-bd">
		<div class="ui-tab ui-tab-default jTab">
			<div class="tab-hd">
			    <!-- 自提 -->
				{{ if transportType == 'ONLY_SLEF' || transportType == 'NATIONWIDE_SLEF' || transportType == 'LOCAL_SLEF'}}
				<a class="hd-item {{ _selected[0] }}" href="javascript:;" role="tabItem" data-deliverytype="1"><span class="item-line">门店自提</span></a>
				{{ /if }}
                <!-- 全国配送 -->
				{{ if transportType == 'ONLY_NATIONWIDE' || transportType == 'NATIONWIDE_SLEF'}}
                    <a class="hd-item {{ _selected[1] }}" href="javascript:;" role="tabItem" data-deliverytype="0"><span class="item-line">全国配送</span></a>
                {{ /if }}
                <!-- 本地配送 -->
                {{ if transportType == 'ONLY_LOCAL' || transportType == 'LOCAL_SLEF' }}
                    <a class="hd-item {{ _selected[1] }}" href="javascript:;" role="tabItem" data-deliverytype="2"><span class="item-line">配送到家</span></a>
                {{ /if }}
			</div>
			<div class="tab-bd tap-lt">
				<!-- 门店自提 begin -->
				{{ if transportType == 'ONLY_SLEF' || transportType == 'NATIONWIDE_SLEF' || transportType == 'LOCAL_SLEF'}}
				<div class="bd-item {{ _selected[0] }}" role="tabPanel" data-cache="{{ _selfMetionData }}">
				{{# _selfMetionTpl }}
				</div>
				{{ /if }}
				<!-- 门店自提 end -->
				<!-- 门店配送 begin -->
				{{ if transportType == 'ONLY_NATIONWIDE' || transportType == 'NATIONWIDE_SLEF' || transportType == 'ONLY_LOCAL' || transportType == 'LOCAL_SLEF' }}
				<div class="bd-item {{ _selected[1] }}" role="tabPanel" data-cache='{{ _addrData }}'>
					<div class="ui-list " onclick="location.href='{{ _url }}'">
						<div class="list-hd">
							<div class="address-wrap">
								{{ if !_address || !_address.mobile }}
									<p class="jAddressEmpty">亲，你还没有收货地址信息，请添加</p>
								{{ else }}
									<p id="jAddrDiv" data-is-old="{{ _address.isOldAddr }}">
										<label>{{ _address.name }}&nbsp;&nbsp;&nbsp;</label><span>{{ _address.mobile }}</span></p>
									<p>{{ _address._areaInfo }}{{ _address.doorAddress }}</p>
								{{ /if }}
							</div>
							<div class="hd-r">
								<span class="arrow"></span>
							</div>
						</div>
					</div>
				</div>
				{{ /if }}
				<!-- 门店配送 end -->
			</div>
		</div>
	</div>
</div>
<!-- 地址 end -->

