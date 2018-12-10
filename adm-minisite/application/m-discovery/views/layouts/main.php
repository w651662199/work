<!DOCTYPE html>
<html lang="zh-CN" data-use-rem=750>
<head>
	<meta charset="UTF-8">
	<meta name="format-detection" content="telephone=no, email=no" />
	<meta name="renderer" content="webkit">    
	<meta name="viewport" content="width=device-width,initial-scale=1,user-scalable=no,minimum-scale=1,maximum-scale=1">
	<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
	<link rel="shortcut icon" href="/favicon.ico?v=20170918" type="image/x-icon">
	<meta name="author" content="国美互联网技术有限公司">

	<script>
	var $CONFIG = {
		domain: '<?php echo isset($globalConfigs["domain"]) ? $globalConfigs["domain"] : ""; ?>',
		mdomain: '<?php echo isset($globalConfigs["mdomain"]) ? $globalConfigs["mdomain"] : ""; ?>',
		mmBoardDomain: '<?php echo isset($globalConfigs["mmBoardDomain"]) ? $globalConfigs["mmBoardDomain"] : ""; ?>',
		mmbDomain: '<?php echo isset($globalConfigs["mmbDomain"]) ? $globalConfigs["mmbDomain"] : ""; ?>',
		adrequestUrl: '<?php echo isset($globalConfigs["adrequestUrl"]) ? $globalConfigs["adrequestUrl"] : ""; ?>',
		rebateBudgetUrl: '<?php echo isset($globalConfigs["rebateBudgetUrl"]) ? $globalConfigs["rebateBudgetUrl"] : ""; ?>',
		pariseUrl: '<?php echo isset($globalConfigs["pariseUrl"]) ? $globalConfigs["pariseUrl"] : ""; ?>',
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

		slotId: <?php echo $slotIds['slotId'];?>,
		wapSlotId: <?php echo $slotIds['wapSlotId'];?>,
		adRequestApi: '<?php echo $globalConfigs["adrequestUrl"]?>',
		pariseShareBatch: '<?php echo $globalConfigs["batchPraiseShareUrl"]?>',
		parise: '<?php echo $globalConfigs["pariseUrl"]?>',
		discoveryShare: '<?php echo $globalConfigs["shareCountUrl"]?>',
		shareRebate: '<?php echo $globalConfigs["shareRebateUrl"]?>',
		videoGetCount: '<?php echo $globalConfigs["setVideoCountUrl"]?>',
		videoGetCount: '<?php echo $globalConfigs["getVideoCountUrl"]?>',
		missionDoMain: '<?php echo $globalConfigs["missionDoMain"]?>',
		missionUrl: '<?php echo $globalConfigs["missionUrl"]?>'
	};
	</script>
</head>
<?php echo isset($content) ? $content : ''; ?>
</html>