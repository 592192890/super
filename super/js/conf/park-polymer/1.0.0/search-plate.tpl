<ul>   
    {{ if data.length }}
        {{ each data as item }}
        <li>{{ item.carNo }}</li>
        {{ /each }}
    {{ else}}
        <li>无相关车牌信息</li>  
    {{ /if }}
</ul>