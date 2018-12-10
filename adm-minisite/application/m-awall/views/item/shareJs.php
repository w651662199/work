<script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">
	wx.config({
		debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
		appId: "<?php echo $wx_appid;?>", // 必填，公众号的唯一标识
		timestamp: "<?php echo $wx_timestamp;?>", // 必填，生成签名的时间戳
		nonceStr: "<?php echo $wx_noncestr;?>", // 必填，生成签名的随机串
		signature: "<?php echo $wx_signature;?>",// 必填，签名，见附录1
		jsApiList: [
			'onMenuShareTimeline',
			'onMenuShareAppMessage',
			'onMenuShareQQ',
			'onMenuShareWeibo',
			'onMenuShareQZone'
		]
	});

	//公共的
	wx.ready(function () {
		wx.onMenuShareAppMessage({
			title: "<?php echo $share_title; ?>",
			desc: "<?php echo $share_desc; ?>",
			link: "<?php echo $share_link; ?>",
			imgUrl: "<?php echo $share_imgurl; ?>"
		});

		wx.onMenuShareTimeline({
			title: "<?php echo $share_title; ?>",
			link: "<?php echo $share_link; ?>",
			imgUrl: "<?php echo $share_imgurl; ?>"
		});
	})
</script>