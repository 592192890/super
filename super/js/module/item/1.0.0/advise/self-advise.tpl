{{ each list as value i }}
    <div class="item-tag" data-type="{{ value.type }}">
        <div class="item-tag-badge">
            <i class="iconfontmod icon">&#xe7b4;</i>
            <span>{{ value.tag }}</span>
        </div>         
        <div class="item-tag-desc">
            {{ if value.url }}
            <a href="{{value.url}}" >{{ value.ad }}</a>
            {{ else }}
            {{ value.ad }}
            {{ /if}}
        </div>
    </div>
{{ /each }}