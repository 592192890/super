<div id="jSlides" class="ui-slider header-bg">
    {{ each lists as list i}}
    <a href="{{list.adUrl}}">
        <img src="https://ssl.bbgstatic.com/super/images/common/default.png" data-url="{{list.adImg}}"
        alt="" class="jSliderImg" style="width: 100%; height: 100%" >
    </a>
    {{ /each }}
</div>