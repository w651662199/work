<!DOCTYPE html>
<html lang="zh-CN" data-use-rem=750>
<head>
	<meta charset="UTF-8">
	<meta name="renderer" content="webkit">
	<meta name="format-detection" content="telephone=no, email=no" />
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no,minimum-scale=1,maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<meta name="author" content="国美互联网技术有限公司">
	<link rel="shortcut icon" href="/favicon.ico?v=20170918" type="image/x-icon">
	<script type="text/javascript">
		if (/MicroMessenger/ig.test(navigator.userAgent) && !/code=/ig.test(window.location.href)) {
			let url = window.location.href;
			url = url.replace('discovery.gomeplus.com', 'discovery.gome.com.cn');
			url = encodeURIComponent(url);
			var redUrl = 'https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx77edddc93a91176f&redirect_uri=' + url + '&response_type=code&scope=snsapi_base&state=1234#wechat_redirect';
			window.location.href = redUrl;
		}
	</script>
	<script>
	var $CONFIG = {
		domain: '<?php echo isset($globalConfigs["domain"]) ? $globalConfigs["domain"] : ""; ?>',
		mdomain: '<?php echo isset($globalConfigs["mdomain"]) ? $globalConfigs["mdomain"] : ""; ?>',
		mmBoardDomain: '<?php echo isset($globalConfigs["mmBoardDomain"]) ? $globalConfigs["mmBoardDomain"] : ""; ?>',
		mmbDomain: '<?php echo isset($globalConfigs["mmbDomain"]) ? $globalConfigs["mmbDomain"] : ""; ?>',
		shareServerDomain: '<?php echo isset($globalConfigs["shareServerDomain"]) ? $globalConfigs["shareServerDomain"] : ""; ?>',
		adrequestUrl: '<?php echo isset($globalConfigs["adrequestUrl"]) ? $globalConfigs["adrequestUrl"] : ""; ?>',
		rebateBudgetUrl: '<?php echo isset($globalConfigs["rebateBudgetUrl"]) ? $globalConfigs["rebateBudgetUrl"] : ""; ?>',
		pariseUrl: '<?php echo isset($globalConfigs["pariseUrl"]) ? $globalConfigs["pariseUrl"] : ""; ?>',
		pariseInfoUrl: '<?php echo isset($globalConfigs["pariseInfoUrl"]) ? $globalConfigs["pariseInfoUrl"] : ""; ?>',
		shareCountUrl: '<?php echo isset($globalConfigs["shareCountUrl"]) ? $globalConfigs["shareCountUrl"] : ""; ?>',
		batchPraiseShareUrl: '<?php echo isset($globalConfigs["batchPraiseShareUrl"]) ? $globalConfigs["batchPraiseShareUrl"] : ""; ?>',
		shareRebateUrl: '<?php echo isset($globalConfigs["shareRebateUrl"]) ? $globalConfigs["shareRebateUrl"] : ""; ?>',
		videoShareUrl: '<?php echo isset($globalConfigs["videoShareUrl"]) ? $globalConfigs["videoShareUrl"] : ""; ?>',
		questionRebateUrl: '<?php echo isset($globalConfigs["questionRebateUrl"]) ? $globalConfigs["questionRebateUrl"] : ""; ?>',
		questionViewUrl: '<?php echo isset($globalConfigs["questionViewUrl"]) ? $globalConfigs["questionViewUrl"] : ""; ?>',
		middlePageImpressionUrl: '<?php echo isset($globalConfigs["middlePageImpressionUrl"]) ? $globalConfigs["middlePageImpressionUrl"] : ""; ?>',
		questionInvestAppearUrl: '<?php echo isset($globalConfigs["questionInvestAppearUrl"]) ? $globalConfigs["questionInvestAppearUrl"] : ""; ?>',
		setVideoCountUrl: '<?php echo isset($globalConfigs["setVideoCountUrl"]) ? $globalConfigs["setVideoCountUrl"] : ""; ?>',
		getVideoCountUrl: '<?php echo isset($globalConfigs["getVideoCountUrl"]) ? $globalConfigs["getVideoCountUrl"] : ""; ?>',
		env: '<?php echo isset($globalConfigs["env"]) ? $globalConfigs["env"] : "dist"; ?>',
		surveyUrl: '<?php echo isset($globalConfigs["surveyUrl"]) ? $globalConfigs["surveyUrl"] : ""; ?>',

		slotId: <?php echo $slotIds['slotId'];?>,
		wapSlotId: <?php echo $slotIds['wapSlotId'];?>,
		adRequestApi: '<?php echo $globalConfigs["adrequestUrl"]?>',
		pariseShareBatch: '<?php echo $globalConfigs["batchPraiseShareUrl"]?>',
		parise: '<?php echo $globalConfigs["pariseUrl"]?>',
		discoveryShare: '<?php echo $globalConfigs["shareCountUrl"]?>',
		shareRebate: '<?php echo $globalConfigs["shareRebateUrl"]?>',
		videoSetCount: '<?php echo $globalConfigs["setVideoCountUrl"]?>',
		videoGetCount: '<?php echo $globalConfigs["getVideoCountUrl"]?>',
	};
	</script>
</head>
<body>
	<script type="text/javascript">
		(function(win){var doc=win.document,html=doc.documentElement,option=html.getAttribute("data-use-rem");if(option===null){return}var baseWidth=parseInt(option).toString()==="NaN"?640:parseInt(option);var grids=baseWidth/100;var clientWidth=html.clientWidth||320;var fontsize=html.style.fontSize=clientWidth/grids+"px";fontsize=parseFloat(fontsize);var maxFontsize=Math.ceil(fontsize);var minFontsize=Math.floor(fontsize);var testDom=document.createElement("div");var testDomWidth=0;var adjustRatio=0;testDom.style.cssText="height:0;width:1rem;";doc.body.appendChild(testDom);var calcTestDom=function(){testDomWidth=testDom.offsetWidth;if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)){if(testDomWidth<minFontsize||testDomWidth>maxFontsize){adjustRatio=clientWidth/grids/testDomWidth;var reCalcRem=clientWidth*adjustRatio/grids;html.style.fontSize=reCalcRem+"px"}else{doc.body.removeChild(testDom)}document.body.removeAttribute("style")}else{html.style.fontSize="50px";document.body.style.width="375px";document.body.style.margin="0 auto";doc.body.removeChild(testDom)}};setTimeout(calcTestDom,20);var reCalc=function(){var newCW=html.clientWidth;if(newCW===clientWidth){return}clientWidth=newCW;if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)){html.style.fontSize=newCW*(adjustRatio?adjustRatio:1)/grids+"px";document.body.removeAttribute("style")}else{html.style.fontSize="50px";document.body.style.width="375px";document.body.style.margin="0 auto"}};if(!doc.addEventListener){return}var resizeEvt="orientationchange" in win?"orientationchange":"resize";win.addEventListener(resizeEvt,reCalc,false);doc.addEventListener("DOMContentLoaded",reCalc,false)})(window);
	</script>
	<div class="active-bar" style="display: none;">
		<a href="<?php echo isset($globalConfigs["mdomain"]) ? $globalConfigs["mdomain"] : ""; ?>hrebate?chl=32"><img src="/resource/images/top_banner20181112.jpg"></a>
	</div>
	<div class="msg-bar" style="display: none;">
		<span></span>
	</div>
	<div class="open-bar"  style="display: none;">
		<span>在App内打开</span>
	</div>
	<div class="m-downapp" id='downapp' style="display: none;">
		<div class="app-box">
			<img src="/resource/images/mmb_logo.png" class="app-logo">
			<h2 class="app-tit">
				打开领取美钻
			</h2>
			<a class="down-load-link app-btn" href="javascript:">立即打开</a>
		</div>
	</div>
	<?php echo isset($content) ? $content : ''; ?>
	<div class="bottom_tools">
		<div class="toolsItem" data-type="question" style="display:none;">
			<span class="toolsItem_span"><em class="tool_icon question">问卷</em></span>
		</div>
		<div class="toolsItem" data-type="share">
			<span><em class="tool_icon share">分享</em></span>
		</div>
	</div>
	<div class="common-share-tips"></div>
	<div class="cover-share">
		<div class="share-wap-con">
			<p class="title">99.9%的人都选择先登录再分享</p>
			<div class="btn"><a class="login-link" href="javascript:">点我登录</a></div>
			<p class="msg">下次再说，直接分享</p>
		</div>
	</div>
	<div class="cover-common">
		<div class="share-wap-con">
			<p class="title first share" style="display: none;">在美媒榜APP内<span class="cover-text"></span>可获得返利哦~快去下载APP吧</p>
			<p class="title first question" style="display: none;"></p>
			<div class="btn">
				<a class="cancel" href="javascript:">取消</a>
				<a class="down-load-link down-link" href="http://meimeibang.gome.com.cn/mindex.html">去下载</a>
			</div>
		</div>
	</div>
	<div class="share-guide">
		<img class="guide-top" src="/resource/images/guide_top.png">
		<img class="guide-bottom" src="/resource/images/guide_bottom.png">
	</div>
	<div class="rebate-rule">
		<div class="share-rebate">
			<p class="rebate-title">分享赚</p>
			<p class="rebate-desc">分享带有“分享赚”标识的内容，被好友点开，你即可得到现金返利；分享多条内容，得多次返利。同1条内容，每人每天最多获得1次分享赚。</p>
			<p class="rebate-desc">注：</p>
			<p class="rebate-desc">Q：为什么好友打开我的分享内容后，我没有获得返利？</p>
			<p class="rebate-desc">A：好友打开内容时活动已截止；此条内容在今天已被其他好友打开过。</p>
		</div>
		<div class="share-rebate">
			<p class="rebate-title">人气返利</p>
			<p class="rebate-desc">分享带有“分享赚”标识的内容，被越多人点击，拿到的返利越多。人气返利次日结算到账。</p>
			<p class="rebate-desc">注：</p>
			<p class="rebate-desc">Q：为什么分享给微信好友后没有获得人气返利？</p>
			<p class="rebate-desc">A：此条内容没有被人点击，快让好友点击查看。</p>
		</div>
		<div class="survey-rebate">
			<p class="rebate-title">调研赚：</p>
			<p class="rebate-desc">完成调研问卷并提交，即可获得现金返利；1份调研问卷最多可填写1次。</p>
			<p class="rebate-desc">注：</p>
			<p class="rebate-desc">Q：为什么提交问卷后，没有获得调研赚？</p>
			<p class="rebate-desc">A：提交问卷时活动已截止。</p>
		</div>
		<div class="video-rebate">
			<p class="rebate-title">视频赚：</p>
			<p class="rebate-desc">完整观看带有“视频赚”标识的视频，即可获得现金返利；观看多条视频，得多次返利。同1条视频，每人每天最多可获得1次视频赚。</p>
			<p class="rebate-desc">注：</p>
			<p class="rebate-desc">Q：为什么完整观看视频后，没有获得视频赚？</p>
			<p class="rebate-desc">A：观看完视频前，活动已截止。</p>
		</div>
	</div>
	<script src="/resource/scripts/discovery/zepto.min.js"></script>
	<script src="/resource/scripts/discovery/touch.min.js"></script>
	<script src="/resource/scripts/common/md5.min.js"></script>
	<script src="/resource/scripts/modules/share/appInterface.js"></script>
	<script src="/resource/scripts/discovery/GomeJSBridge.min.js"></script>
	<script src="/resource/scripts/discovery/crypto-js.min.js"></script>
	<script src="/resource/scripts/discovery/dsbridge.js"></script>
	<script src="/resource/scripts/discovery/common.js?v=1.0.10"></script>
</body>
</html>
