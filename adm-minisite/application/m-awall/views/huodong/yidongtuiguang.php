<head>
<title>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</title>
<link href="/static/css/page.750be2bfaf2e970a6cf43d9060fc9eca.css" rel="stylesheet">
<script type="text/javascript" src="https://js.gomein.net.cn/sitemonitor/wap.js"></script>
<script type="text/javascript" src="/resource/scripts/discovery/GomeJSBridge.min.js"></script>

<script type="text/javascript">
		var $CONFIG = {
			slidSlotId: [<?php echo '"'.implode('","', $slotIds['slidSlotId']).'"' ?>],
			topicSlotId: [<?php echo '"'.implode('","', $slotIds['topicSlotId']).'"' ?>],
			likeSlotId: '<?php echo $slotIds['likeSlotId'];?>',
			webpageSlotId: '<?php echo $slotIds['webpageSlotId'];?>',
			goodSlotId: '<?php echo $slotIds['goodSlotId'];?>',
			webpageCount: '<?php echo $slotIds['webpageCount'];?>',
			goodCount: '<?php echo $slotIds['goodCount'];?>',
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
    <div id="app"></div>
    <script type="text/javascript" src="/static/js/vendors.700a4fbe52ab0e945c2b.js"></script>
    <script type="text/javascript" src="/static/js/page.1bba0a1310670d4870b0.js"></script>
</body>
  <script>
    (function(win){var doc=win.document,html=doc.documentElement,option=html.getAttribute("data-use-rem");if(option===null){return}var          baseWidth=parseInt(option).toString()==="NaN"?640:parseInt(option);var grids=baseWidth/100;var clientWidth=html.clientWidth||320;var fontsize=html.style.fontSize=clientWidth/grids+"px";fontsize=parseFloat(fontsize);var maxFontsize=Math.ceil(fontsize);var minFontsize=Math.     floor(fontsize);var testDom=document.createElement("div");var testDomWidth=0;var adjustRatio=0;testDom.style.cssText="height:0;width:1rem;";doc.body.appendChild(testDom);var calcTestDom=function(){testDomWidth=testDom.offsetWidth;                                                          if(testDomWidth<minFontsize||testDomWidth>maxFontsize){adjustRatio=clientWidth/grids/testDomWidth;var reCalcRem=clientWidth*adjustRatio/grids;  html.style.fontSize=reCalcRem+"px"}else{doc.body.removeChild(testDom)}};setTimeout(calcTestDom,20);var reCalc=function(){var newCW=html.        clientWidth;if(newCW===clientWidth){return}clientWidth=newCW;html.style.fontSize=newCW*(adjustRatio?adjustRatio:1)/grids+"px"};if(!doc.         addEventListener){return}var resizeEvt="orientationchange"in win?"orientationchange":"resize";win.addEventListener(resizeEvt,reCalc,false);doc. addEventListener("DOMContentLoaded",reCalc,false)})(window);
  </script>
</body>