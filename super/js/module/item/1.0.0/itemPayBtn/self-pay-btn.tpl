<div class="pay-deposit" id="jPurchase">
    {{ if payfor }}
        <div class="addCart" id="jCartAdd">
            {{if count}}
            <span class="countTime" id="jCount">00:00:00</span>
            {{/if}}
            <span class="text-block">{{ btntext }}</span>
        </div>
        <div class="accounts" id="jAccounts"><span>去结算</span><i class="iconfontmod icon">&#xe7c6;</i><span class="ui-num" id="nums"></span></div>
        <!-- <div class="soldout">{{ btntext }}</div> -->
    {{ else }}
        <div class="countdown" id="jCount">00:00:00</div>
        <div class="gotopay" >{{ btntext }}</div>
    {{ /if }}
</div>