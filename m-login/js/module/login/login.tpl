<div class="login-telephone">
	<input type="tel" class="u-form-input-text" value="" placeholder="请输入手机号码" id="mobile" autocomplete="on">
</div>
<div class="login-sms" id="jLoginSms" >
	<input type="text" class="u-form-input-text" value="";
placeholder="请输入短信验证码" id="captcha" autocomplete="on">
	<div class="limit-time">
		<span class="sendSms" id="jSendSms">获取验证码</span><span class="sec" id="jReGet"></span>
	</div>
</div>
<div class="login-btn" id="jLoginBtn">
	<button class="mod-login" type="button">确认</button>
</div>
<div class="join-yili jYiliBox">
	<label for="">
		<input type="checkbox" name="pushYili" class="jYili" />同意注册成为伊利会员
	</label>
</div>
{{ if !reg }}
<div class="agreement">未注册用户在首次登录时便自动完成注册，使用该登录方式代表您已接受<a href="javascript:void(0)" id="jShowProto">用户协议</a></div>
{{ /if }} 
{{ if reg }}
<a class="mod-link" id="jGoto">去注册>></a>
{{ /if }} 
    
