<div class="mod-park-box">
    <div class="box-title">车位信息
        <i class="iconfontmod icon box-close jCloseBox">&#xe76a;</i>
    </div>
    <img src="//ssl.bbgstatic.com/super/images/conf/park-polymer/1.0.0/car.png" alt="">
    <div class="park-info-none">
        <p class="info-num">{{licenseNum}}</p>
        <dl>
            <dt>没有查询到该车牌信息，可能是：</dt>
            <dd>
                <span class="f-l">1、</span>
                <div>车辆停放在非视频识别区域一层，无法通过车牌查询；</div>
            </dd>
            <dd>
                <span class="f-l">2、</span>
                <div>该车牌所属车辆未进场；</div>
            </dd>
        </dl>
        {{if channel == '012838'||channel == '168001'}}
        <div class="tips">
            停车场<i class="red">B1</i>层、<i class="red">B1M</i>层、<i class="red">B2</i>层区域，查询车牌即可寻车；<br>
            <i class="red">G</i>层、<i class="red">UG</i>层区域，手动或打开蓝牙摇一摇，记录爱车停放位置。 
        </div>
        {{/if}}
        <button class="ui-btn-primary ui-btn-radius ui-btn-block jQueryOtherBtn">查询其他车牌</button>
    </div>
</div>