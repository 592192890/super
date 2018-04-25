{{ if _changeNumClass == 'disabled'}}
	<span class="box-num icon iconfont jDelPro">&#xe603;</span>
{{ else }}
<div class="box-change-num">
	<div class="ui-add-num jChangeNum {{ _changeNumClass }}">
		<div class="zone-l" node-type="left">
			<div class="num-l">
				<i class="icon" node-type="left-icon"></i>	
			</div>
		</div>
		<div class="zone-m">
			<div class="num-m">
				<input type="tel" class="jQtyTxt " data-max="{{ limit }}" value="{{ quantity }}" node-type="input" {{ _inputStr }} />
			</div>
		</div>
		<div class="zone-r" node-type="right">
			<div class="num-r">
				<i class="icon"></i>	
			</div>
		</div>
	</div>
</div>
{{ /if }}
