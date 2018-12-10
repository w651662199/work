<head>
	<title>有腔调</title>
	<meta name="viewport" content="width=device-width,initial-scale=1.0,minimum-scale=1.0,maximum-scale=1.0,user-scalable=0">
	<link href="/resource/css/topic.css" rel="stylesheet">
	<link href="/resource/css/webpage.css" rel="stylesheet">
</head>
<body class="opg">
<script>
	var alertIsLogin = 0;
	var h5RebateBid = <?php echo $h5FlightAdvertisement !== NULL ? $h5FlightAdvertisement->getRealRebateBid() : 0; ?>;
	var wapRebateBid = <?php echo $wapFlightAdvertisement !== NULL ? $wapFlightAdvertisement->getRealRebateBid() : 0; ?>;
	var slotId = <?php echo $itemSlotId; ?>;
	var wapjspath = 'http://js.meixincdn.com/m/h5/dist';
	var wapcsspath = 'http://css.meixincdn.com/m/h5/dist';

</script>
<script>
	var topicId     =   '<?php echo $topic->getTopicId();?>';
	var shareTitle  =   '<?php echo $topic->getName();?>';
	var groupId     =   '<?php echo $topic->getGroupId();?>';
	//var topicType   =   0;
	var shareDesc = "<?php echo $topic->getComponentsOneText();?>";
	var shareImg = "<?php echo $topic->getComponentsOneUrl();?>";
</script>
<script src="https://js.meixincdn.com/gvs-player/dist/vod/js/meixinplayer-min.js"></script>
<script>
(function(win){var doc=win.document,html=doc.documentElement,option=html.getAttribute("data-use-rem");if(option===null){return}var baseWidth=parseInt(option).toString()==="NaN"?640:parseInt(option);var grids=baseWidth/100;var clientWidth=html.clientWidth||320;var fontsize=html.style.fontSize=clientWidth/grids+"px";fontsize=parseFloat(fontsize);var maxFontsize=Math.ceil(fontsize);var minFontsize=Math.floor(fontsize);var testDom=document.createElement("div");var testDomWidth=0;var adjustRatio=0;testDom.style.cssText="height:0;width:1rem;";doc.body.appendChild(testDom);var calcTestDom=function(){testDomWidth=testDom.offsetWidth;if(testDomWidth<minFontsize||testDomWidth>maxFontsize){adjustRatio=clientWidth/grids/testDomWidth;var reCalcRem=clientWidth*adjustRatio/grids;html.style.fontSize=reCalcRem+"px"}else{doc.body.removeChild(testDom)}};setTimeout(calcTestDom,20);var reCalc=function(){var newCW=html.clientWidth;if(newCW===clientWidth){return}clientWidth=newCW;html.style.fontSize=newCW*(adjustRatio?adjustRatio:1)/grids+"px"};if(!doc.addEventListener){return}var resizeEvt="orientationchange"in win?"orientationchange":"resize";win.addEventListener(resizeEvt,reCalc,false);doc.addEventListener("DOMContentLoaded",reCalc,false)})(window);
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
<section class="tpc-zone" style="padding-bottom: 1rem;">
	<h3 class="tpc-title"><?php echo $topic->getName();?></h3>
	<div class="tpc-information">
		<div class="tpc-personal">
			<a class="tpc-per-type" style="color:#555;">by <?php echo $topic->getUserNickname();?></a>
		</div>
	</div>

	<?php foreach($topic->getTopicComponents() as $topicComponent) {?>
		<?php if($topicComponent->getIsText()) {?>
		<p class="tpc-para"><?php echo $topicComponent->getText();?></p>
		<?php } elseif($topicComponent->getIsImage()) {?>
		<div class="tpc-img-box">
			<img src="<?php echo $topicComponent->getUrl();?>" alt="图片" onerror="javascript:this.src='http://css.meixincdn.com/m/h5/dist/images/default_product.png'">
		</div>
		<p class="tpc-para"><?php echo $topicComponent->getText();?></p>
		<?php } elseif($topicComponent->getIsVideo()) {?>
		<div class="video-box videoContainer" id="videoContainer_<?php echo $topicComponent->getVideoId();?>" style="width:100%;"></div>
		<script type="text/javascript">
			var v = new MeixinPlayer();
			var config = {
				autoplay: 0,
				autoSize: 1,
				env: 'dist',
				poster: '<?php echo $topicComponent->getVideoImage();?>',
			}
			v.init(<?php echo $topicComponent->getVideoId();?>, 'videoContainer_<?php echo $topicComponent->getVideoId();?>', config);
		</script>
		<?php } elseif($topicComponent->getIsItem()) {?>
		<a class="block-a" href="<?php echo $topicComponent->getItemUrl(); ?>">
			<figure class="tpc-good-zone">
				<img class="tpc-gd-img" src="<?php echo $topicComponent->getItemImage();?>" data-source="<?php echo $topicComponent->getItemImage(); ?>" alt="<?php echo $topicComponent->getItemName();?>">
				<figcaption class="tpc-fig">
					<h4 class="tpc-gd-title"><?php echo $topicComponent->getItemName();?></h4>
					<p class="tpc-price" style="color: #f66a6b"><span>¥ <?php echo $topicComponent->getItemSalePrice();?></span></p>
				</figcaption>
			</figure>
		</a>
		<?php } ?>
	<?php } ?>
	<div class="share-btn-fixed">
		<span class="share-img"></span>
		<span class="isRebateMsg">分享返利</span>
	</div>
</section>
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
<!--<script crossorigin="" src="https://js.meixincdn.com/m/h5/dist/js/lithe.js?version=2017051117" data-config-dynamic="true" data-config="config.js" data-debug="true" data-main="conf/Group/detail.js">-->
</script>
<script>
	(function(){
		var tpcZone = $('.tpc-zone img');
		if(tpcZone.size()){
			for(var i = 0; i < tpcZone.size(); i++){
				(function(i){
					var image = new Image();
					image.src = tpcZone.eq(i).data('src');
					image.onload = function(){
						tpcZone.eq(i).attr('src', tpcZone.eq(i).data('src'));
					}
				})(i);
			}

		}
	})();
</script>
</body>