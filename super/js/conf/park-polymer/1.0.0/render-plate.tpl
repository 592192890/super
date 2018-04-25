<div class="licence-list list-one">
    <div class="licence-item active jLicencePlate" data-plate="{{ carNo }}">
        <div class="licence-content">
            <div class="licence-txt jLicenceTxt">{{carNo}}</div>
            {{ if isSmart }}
            <a href="javascript:void(0)" class="manage-btn jFindCar">
                <i class="iconfontmod icon">&#xe792;</i>
                <span>室内找车</span>
            </a>
            {{ /if }}
            {{ if isCharge }}
            <a href="javascript:void(0)" class="manage-btn jPayForPark">
                <i class="iconfontmod icon">&#xe798;</i>
                <span>停车缴费</span>
            </a>
            {{ /if }}
        </div>
    </div>
</div>
<a href="//wx.yunhou.com/super/park/mycars?shopId={{ channel }}" class="manage-licence">
    <i class="iconfontmod icon"></i>
    <span>管理车牌</span>
</a>