
{{ if list.length }}
<div class="mod-promote" id="jCheckMore">
    <div class="promotion">
        <span class="type">促销：</span>
        <span class="name">{{ list[0].tag }}</span>
        <span class="ctn">{{ list[0].ad }}</span>
    </div>
    {{ if list.length > 1 }}
    <i class="iconfontmod more">&#xe772;</i>
    {{ /if}}  
</div>
{{ /if}}