<div class="join-team-hd">加入拼团队伍</div>
<ul>
    {{ each lists as value i }}
        <li data-id="{{ i }}" class="{{ if i>=2 }} hide {{/if}}">
            <div class="team-lf">
                <img src="//ssl.bbgstatic.com/super/images/conf/my-center/1.0.0/default.png"><span class="txt-overflow">韩打发打发</span><i>￥68.00</i>
            </div>
            <div class="team-rg">
                <a href="">去参团</a><span>还差<b>3</b>人</span>
            </div>
        </li>
    {{ /each }}
</ul>
<div class="check-more" id="jMore">查看更多队伍</div>

