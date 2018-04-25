<div class="pay-deposit" id="jGoToPay">
    {{ if payfor }}
        <div class="countdown" id="jCountDown">00:00:00</div>
        <div class="gotopay" >{{ btntext }}</div>
    {{ else }}
        <div class="soldout">{{ btntext }}</div>
    {{ /if }}
</div>