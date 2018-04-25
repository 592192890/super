<div class="promotionDisplay">
    <div class="title">促销活动</div>
        <ul>
        {{ each list as value i }}
            <li>
                <div class="promotion">
                    <span class="name">{{value.tag}}</span>
                    <span class="ctn">{{value.ad}}</span>
                </div>
            </li>
        {{ /each }}
        </ul>
    <div class="btn" action-type="ok">关闭</div>
</div>