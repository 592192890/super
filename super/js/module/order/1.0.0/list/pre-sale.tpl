{{ if _activity }}
<div class="ui-list">
	<div class="list-hd">
		<div class="hd-l">阶段一</div>
		<div class="hd-r">
			<span class="text color-f85d5b">定金 ￥{{ _activity.deposit }}</span>
		</div>
	</div>
</div>
<div class="ui-list line">
	<div class="list-hd">
		<div class="hd-l">阶段二</div>
		<div class="hd-r">
			<span class="text color-f85d5b">尾款 ￥{{ _activity.retainage }}</span>
		</div>
	</div>
</div>
{{ if Number(_activity.retainage) != 0 }}
<div class="ui-list mod-info">
	<div class="list-hd">
		<div class="hd-l">尾款通知号</div>
		<div class="hd-r">
			<input type="text" placeholder="请填写手机号" id="jMobile" value="{{ _mobile }}"/>
		</div>
	</div>
</div>
{{ /if }}
{{ /if }}
