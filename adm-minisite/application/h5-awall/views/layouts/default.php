<!DOCTYPE html>
<html lang="zh-CN">
<head>
	<meta charset="UTF-8">
	<meta name="renderer" content="webkit">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
	<meta name="format-detection" content="telephone=no, email=no" />
	<meta name="google" value="notranslate">
	<meta name="author" content="美信网络技术有限公司" />
	<meta name="description" content="" />
	<meta name="HandheldFriendly" content="true">
	<meta name="MobileOptimized" content="320">
	<meta name="screen-orientation" content="portrait">
	<meta name="browsermode" content="application">
	<meta name="full-screen" content="yes">
	<meta name="x5-orientation" content="portrait">
	<meta name="x5-fullscreen" content="true">
	<meta name="x5-page-mode" content="app">
	<meta name="apple-itunes-app" content="app-id=123131232132" />
	<meta name="apple-mobile-web-app-title" content="美信">
	<meta name="apple-mobile-web-app-capable" content="yes">
	<meta name="apple-touch-fullscreen" content="yes">
	<script type="text/javascript" src="/resource/scripts/common/jquery.min.js"></script>
	<script type="text/javascript" src="/resource/scripts/common/flexible_css.js"></script>
	<script type="text/javascript" src="/resource/scripts/common/flexible.js"></script>
	<script type="text/javascript" src="/resource/scripts/common/common.js"></script>
	<script type="text/javascript" src="https://js.gomein.net.cn/sitemonitor/wap.js"></script>
	<script type="text/javascript">
		var adrequestUrl = '<?php echo isset($globalConfigs["adrequestUrl"]) ? $globalConfigs["adrequestUrl"] : ""; ?>';
		var adrequestIdUrl = '<?php echo isset($globalConfigs["adrequestIdUrl"]) ? $globalConfigs["adrequestIdUrl"] : ""; ?>';
		var shareUrl = '<?php echo isset($globalConfigs["shareUrl"]) ? $globalConfigs["shareUrl"] : ""; ?>';
		var shareImpressionUrl = '<?php echo isset($globalConfigs["shareImpressionUrl"]) ? $globalConfigs["shareImpressionUrl"] : ""; ?>';
		var rebateBudgetUrl = '<?php echo isset($globalConfigs["rebateBudgetUrl"]) ? $globalConfigs["rebateBudgetUrl"] : ""; ?>';
		var middlePageImpression = '<?php echo isset($globalConfigs["middlePageImpression"]) ? $globalConfigs["middlePageImpression"] : ""; ?>';
		var pcHost = '<?php echo isset($globalConfigs["pcHost"]) ? $globalConfigs["pcHost"] : ""; ?>';
		var wapHost = '<?php echo isset($globalConfigs["wapHost"]) ? $globalConfigs["wapHost"] : ""; ?>';
		var h5Host = '<?php echo isset($globalConfigs["h5Host"]) ? $globalConfigs["h5Host"] : ""; ?>';
		var rebateUrl = '<?php echo isset($globalConfigs["rebateUrl"]) ? $globalConfigs["rebateUrl"] : ""; ?>';
		var protocolUrl = '<?php echo isset($globalConfigs["protocolUrl"]) ? $globalConfigs["protocolUrl"] : ""; ?>';
	</script>
</head>
<body>
	<?php echo isset($content) ? $content : ''; ?>
</body>
</html>
