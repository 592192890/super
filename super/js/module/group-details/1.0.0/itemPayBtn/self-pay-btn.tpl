<div class="pay-deposit" id="jPurchase">
    {{ if payfor }}
        <div class="soldout">{{ btntext }}</div>
        <div id="jCount" style="display: none"></div>
    {{ else }}
        <div class="countdown" id="jCount">00:00:00</div>
        <div class="gotopay" >{{ btntext }}</div>
    {{ /if }}
</div>