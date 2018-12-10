<!DOCTYPE html>
<html lang="zh-CN" data-use-rem=750>
<head>
	<meta charset="UTF-8">
	<meta name="renderer" content="webkit">    
	<meta http-equiv="X-UA-Compatible" content="IE=EDGE">
	<meta name="author" content="美信网络技术有限公司">
	<script type="text/javascript" src="/resource/scripts/common/jquery.min.js"></script>
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

<?php echo isset($content) ? $content : ''; ?>
</html>