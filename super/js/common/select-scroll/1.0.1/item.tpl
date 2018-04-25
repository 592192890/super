<div class="bd-item _jUlBox" id="_jUlBox{{ parentId }}" data-parent-id="{{ parentId }}">
	<ul>
		{{ each items as item i}}
		<li class="_jLi {{ item.selected }} txt-overflow" data-id="{{ item.textId }}">{{ item.text }}</li>
		{{ /each }}
	</ul>
	<div class="item-mask _jUl"></div>
</div>
