<div class="list-item" id="{{ listId?listId:'jResearchBox' }}">
	<div>
	{{ each lists as list index }}
		<label class="jItem" data-cache="{{ stringify(list) }}">
			{{ if list.isRange}}
				<p>{{ list.title }}</p>
				<p class="tips">{{ list.address }}</p>
				<input type="radio" name="jAddress"/>
			{{ else }}
				<p class="disabled">{{ list.title }}</p>
				<p class="tips disabled">{{ list.address }}</p>
				<input type="radio" class="disabled" disabled name="jAddress"/>
			{{/if}}
		</label>
	{{ /each }}

	{{ if lists && lists.length==0 }}
	<div class="mod-page-tips">
		<i class="tips-img"><img src="http://img0.bbgstatic.com/15b22cb0627_bc_0c4621613e861a87ee312be78b007d29_308x266.png"></i>
		<p class="tips-txt">当前输入的地址不支持配送<br/>换个地址试试?</p>
	</div>	
	{{ /if }}

	{{ if error }}
	<div class="mod-page-tips">
		<i class="tips-img"><img src="http://img3.bbgstatic.com/15b22d0bc75_bc_34647dadd8101fb16442f6432959e76f_308x266.png"></i>
		<p class="tips-txt">数据加载失败</p>
	</div>	
	{{ /if }}
	</div>
</div>
