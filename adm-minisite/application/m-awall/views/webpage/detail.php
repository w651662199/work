<head>
	<title>有腔调</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0">
	<meta name="description" content="<?php echo $webpage->getDescription();?>">
	<link href="/resource/css/webpage.css" rel="stylesheet">
</head>
<body>
<script>
(function(win){var doc=win.document,html=doc.documentElement,option=html.getAttribute("data-use-rem");if(option===null){return}var baseWidth=parseInt(option).toString()==="NaN"?640:parseInt(option);var grids=baseWidth/100;var clientWidth=html.clientWidth||320;var fontsize=html.style.fontSize=clientWidth/grids+"px";fontsize=parseFloat(fontsize);var maxFontsize=Math.ceil(fontsize);var minFontsize=Math.floor(fontsize);var testDom=document.createElement("div");var testDomWidth=0;var adjustRatio=0;testDom.style.cssText="height:0;width:1rem;";doc.body.appendChild(testDom);var calcTestDom=function(){testDomWidth=testDom.offsetWidth;if(testDomWidth<minFontsize||testDomWidth>maxFontsize){adjustRatio=clientWidth/grids/testDomWidth;var reCalcRem=clientWidth*adjustRatio/grids;html.style.fontSize=reCalcRem+"px"}else{doc.body.removeChild(testDom)}};setTimeout(calcTestDom,20);var reCalc=function(){var newCW=html.clientWidth;if(newCW===clientWidth){return}clientWidth=newCW;html.style.fontSize=newCW*(adjustRatio?adjustRatio:1)/grids+"px"};if(!doc.addEventListener){return}var resizeEvt="orientationchange"in win?"orientationchange":"resize";win.addEventListener(resizeEvt,reCalc,false);doc.addEventListener("DOMContentLoaded",reCalc,false)})(window);

	var h5RebateBid = <?php echo $h5FlightAdvertisement !== NULL ? $h5FlightAdvertisement->getRealRebateBid() : 0; ?>;
	var wapRebateBid = <?php echo $wapFlightAdvertisement !== NULL ? $wapFlightAdvertisement->getRealRebateBid() : 0; ?>;
	var slotId = <?php echo $itemSlotId; ?>;
</script>
<script type="text/javascript">
	var shareTitle = "<?php echo $webpage->getCardTitle(); ?>";
	var shareDesc = "<?php echo $webpage->getCardDescription(); ?>";
	var shareImg = "<?php echo $webpage->getCardImage(); ?>";
</script>
<div class="m-downapp" id='downapp'>
  <div class="app-box" style="position: absolute;">
    <a class="app-close" onclick="document.getElementById('downapp').style.display = 'none';">
      <em class="iconn-25"></em>
    </a>
    <img src="https://css.meixincdn.com/m/h5/dist/images/gome_icon.png" class="app-logo">
    <h2 class="app-tit">
      更多优惠尽在国美
    </h2>
    <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.gome.eshopnew" class="app-btn">戳我打开</a>
  </div>
</div>
<div class="html_content" id="status">
	<div class="item-section" style="background:<?php echo $webpage->getBackgroundColor(); ?>">
		<!--<div class="share-btn">
			<span class="share-img"></span>
			<span class="isRebateMsg">分享返利</span>
		</div>-->
		<div class="share-btn-fixed">
			<span class="share-img"></span>
			<span class="isRebateMsg">分享返利</span>
		</div>
		<div class="item-section_header">
			<img src="<?php echo $webpage->getImage() ?>">
		</div>
		<?php if(strlen($webpage->getDescription()) > 0) { ?>
			<div class="webpage-text">
				<p class="special-product-title"><?php echo $webpage->getTitle();?></p>
				<p><?php echo $webpage->getDescription(); ?></p>
			</div>
		<?php }else{ ?>
			<div class="webpage-text">
				<p class="special-product-title"><?php echo $webpage->getTitle();?></p>
			</div>
		<?php } ?>
		<ul class="item-section-list">
			<?php foreach ($items as $item) { ?>
			<li>
				<div class="item-content" data-id="<?php echo $item->getProductId(); ?>-<?php echo $item->getSkuId(); ?>">
					<a href="<?php echo $item->getItemUrl(); ?>">
						<div class="item-img-box">
							<img src="<?php echo $item->getImage() ?>">
						</div>
						<p class="item-title">
							<?php echo $item->getDescription(); ?>
						</p>
						<div class="info_box">
							<em class="price"></em>
						</div>
						<span class="btn">立即购买</span>
					</a>
				</div>
			</li>
			<?php } ?>
		</ul>
	</div>
</div>
<div class="tip"
	 style="position: fixed;top: 0;left: 0;bottom: 0;right: 0;background: rgba(0,0,0,0.6);display: none;z-index: 10;"></div>
<div class="share-container" style="">
	<div class="share-main">
        <span class="main-text">分享<span class="rebateBudget" id="rebateBudget">成功得￥0.01</span></span>
    </div>
	<div class="share-text-info rebateBudget">
		<p>1.分享后，内容被打开才有机会获得返利</p>
		<p>2.一条内容每天最多可获得一次返利</p>
		<p class="rebate-rule">点击了解分享返利规则详情&nbsp;></p>
	</div>
    <div class="share-common" id="shareCon">
        <div class="share-item" data-type="weixin">
            <img class="share-icon" src="/resource/images//tencent_wechat.png">
            <p class="share-item-name">微信</p>
        </div>
        <div class="share-item" data-type="pengyouquan">
            <img class="share-icon" src="/resource/images/tencent_wechat_friend.png">
            <p class="share-item-name">朋友圈</p>
        </div>
        <div class="share-item" data-type="qq">
            <img class="share-icon" src="/resource/images//tencent_QQ.png">
            <p class="share-item-name">QQ</p>
        </div>
        <div class="share-item" data-type="qqzone">
            <img class="share-icon" src="/resource/images//tencent_qzone.png">
            <p class="share-item-name">QQ空间</p>
        </div>
    </div>
    <div class="share-cancel">
        <p>取消</p>
    </div>
</div>
<script src="/resource/scripts/common/md5.min.js"></script>
<script src="/resource/scripts/modules/share/appInterface.js"></script>
<script src="/resource/scripts/webpage/webpage.js"></script>
</body>