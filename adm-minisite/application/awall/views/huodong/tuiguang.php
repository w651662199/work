<head>
<title>活动页面</title>
<!--#include virtual="/n/common/global/global.html"-->
<link rel="stylesheet" href="<!--#include virtual='/n/common/a55/style.html'-->">
<link href="/static/css/pcPage.029c18fd7d486c74b14e1a5b865e10c1.css" rel="stylesheet">
<script type="text/javascript">
var $CONFIG = {
			pcSlidSlotId: [<?php echo '"'.implode('","', $slotIds['pcSlidSlotId']).'"' ?>],
			pcTopSlotId: [<?php echo '"'.implode('","', $slotIds['pcTopSlotId']).'"' ?>],
			pcListSlotId: '<?php echo $slotIds['pcListSlotId'];?>',
			domain: '<?php echo $globalConfigs['adrequestUrl'];?>',
			adRequestApi: "https://flight.gomeplus.com/flight",
			pariseShareBatch: "https://shareserver.gomeplus.com/pariseShareBatch",
			parise: "https://shareserver.gomeplus.com/parise",
			discoveryShare: "https://shareserver.gomeplus.com/discoveryShare",
			shareRebate: "https://shareserver.gomeplus.com/shareRebate",
			videoGetCount: "https://count-v.gomeplus.com/get/video/",
			videoSetCount: "https://count-v.gomeplus.com/set/video/"
		};
</script>
</head>
<body>
	<!--#include virtual="/n/common/a55/head.html"-->
	<div id="app"></div>
	<!--#include virtual="/n/common/a55/foot.html"-->
	<script type="text/javascript" src="<!--#include virtual='/n/common/a55/script.html'-->"></script>
	<script type="text/javascript" src="/static/js/vendors.72cb3bb92ff9f1dbb85e.js"></script>
	<script type="text/javascript" src="/static/js/pcPage.b10fac7a78790fc9cbb3.js"></script>
</body>
