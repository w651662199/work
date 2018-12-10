var weixin = {
	weixinConfig: [],
	weixinSDKUrl: 'https://res.wx.qq.com/open/js/jweixin-1.0.0.js',
	url: 'api/weixin',
	shareTitle: '',
	shareDesc: '',
	shareLink: window.location.href,
	shareImg: '',
	init: function(shareOptions) {
		weixin.shareTitle = shareOptions.title;
		weixin.shareDesc = shareOptions.desc;
		weixin.shareImg = shareOptions.img;
		var script = doc.createElement('script');
		var parentNode = doc.getElementsByTagName('head')[0] || doc.body;
		script.async = true;
		script.src = weixin.weixinSDKUrl;
		script.onload = weixin.getWeixinConfigInfor;
		parentNode.appendChild(script);
	},
	getWeixinConfigInfor: function() {
		var requestUrl = wapHost + weixin.url;
		utils.requestJsonp(requestUrl, weixin.initWeixin);
	},
	initWeixin: function(result) {
		wx.config({
			debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
			appId: result['wx_appid'], // 必填，公众号的唯一标识
			timestamp: result['wx_timestamp'], // 必填，生成签名的时间戳
			nonceStr: result['wx_noncestr'], // 必填，生成签名的随机串
			signature: result['wx_signature'],// 必填，签名，见附录1
			jsApiList: [
				'onMenuShareTimeline',
				'onMenuShareAppMessage',
				'onMenuShareQQ',
				'onMenuShareQZone'
			] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
		});
		wx.ready(function() {
			wx.onMenuShareTimeline({
				title: weixin.shareTitle, // 分享标题
				link: weixin.shareLink, // 分享链接
				imgUrl: weixin.shareImg, // 分享图标
			});
			wx.onMenuShareAppMessage({
				title: weixin.shareTitle, // 分享标题
				desc: weixin.shareDesc, // 分享描述
				link: weixin.shareLink, // 分享链接
				imgUrl: weixin.shareImg, // 分享图标
			});
			wx.onMenuShareQQ({
				title: weixin.shareTitle, // 分享标题
				desc: weixin.shareDesc, // 分享描述
				link: weixin.shareLink, // 分享链接
				imgUrl: weixin.shareImg, // 分享图标
			});
			wx.onMenuShareQZone({
				title: weixin.shareTitle, // 分享标题
				desc: weixin.shareDesc, // 分享描述
				link: weixin.shareLink, // 分享链接
				imgUrl: weixin.shareImg, // 分享图标
			});
		});
	}
};