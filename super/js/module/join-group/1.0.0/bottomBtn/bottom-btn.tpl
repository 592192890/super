<div class="pay-deposit" id="jPurchase">
    <div class="pay-counts"><span>活动结束倒计时</span><b>16:19:04</b></div>
    <div class="accounts" id="jAccounts"><span>购物车</span><i class="iconfontmod icon">&#xe7c6;</i><span class="ui-num">{{ nums }}</span></div>
    {{ if payfor }}
    <div class="addCart" id="jCartAdd">{{ btntext }}</div>
    {{ else }}
    <div class="addCart {{ if goToAppointment }} appointment {{ else }} disabled {{/if}}" id="jCartAdd">{{ btntext }}</div>
    {{ /if }}
</div>