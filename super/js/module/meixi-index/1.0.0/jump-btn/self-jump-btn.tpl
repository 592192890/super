 <div class="block-fLine" >      
    {{ each lists as list i}}
    <a href="{{list.url}}">
        <dl>
            <dt><img src="{{ list.img }}"></dt>
            <dd>{{ list.name }}</dd>
        </dl>
    </a>
    {{ /each }}
</div>