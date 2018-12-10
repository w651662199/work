<head>
	<title><?php echo $material->getTitle();?></title>
	<meta name="description" content="<?php echo $material->getDescription();?>">
	<script type="text/javascript" src="/resource/scripts/common/flexible_css.js"></script>
	<script type="text/javascript" src="/resource/scripts/common/flexible.js"></script>
</head>
<body>
<?php echo $wx_content;?>
<link href="/resource/css/detail.css" rel="stylesheet">
<script type="text/javascript" src="/resource/scripts/modules/goods.js"></script>
<script type="text/javascript">
	var slotId = <?php echo $itemSlotId; ?>;
	var itemId = <?php echo $item->getId(); ?>;
	var shopId = <?php echo $item->getShopId(); ?>;
</script>
<div class="m-downapp">
  <div class="app-box" bp-data="{"event_id":"CB425W04"}" style="position: absolute;">
    <a class="app-close">
      <em class="iconn-25"></em>
    </a>
    <img src="https://css.meixincdn.com/m/h5/dist/images/gome_icon.png" class="app-logo">
    <h2 class="app-tit">
      更多优惠尽在国美
    </h2>
    <a href="http://a.app.qq.com/o/simple.jsp?pkgname=com.gome.eshopnew" class="app-btn">戳我打开</a>
  </div>
</div>
<div class="main-container">
	<div class="product-img">
		<div class="back-btn"><img src="/resource/images/Back_64px.png"></div>
		<a href="<?php echo $item->getWapUrl();?>"><img class="product-img-info" src="<?php echo $material->getImage();?>"></a>
		<div class="bottom-gradient-line"></div>
	</div>
	<div class="product-info-con">
		<p class="product-name"><?php echo $material->getTitle(); ?></p>
		<p class="product-price">￥ <?php echo $item->getRealSalePrice(); ?></p>
		<p class="product-introduce"><?php echo $material->getDescription(); ?></p>
		<p class="product-buyers">
			<span class="count-comment"><?php echo $item->getCommentQuantity(); ?>人评论</span>
		</p>
	</div>
	<div class="other-products">
		<p class="text">你可能还喜欢</p>
		<ul class="other-product-list">
			<?php foreach ($material->getRelatedItems() as $relatedItem) { ?>
				<a href="<?php echo $relatedItem['url'];?>"><li><img src="<?php echo $relatedItem['image'];?>"></li></a>
			<?php } ?>
		</ul>
	</div>
	<div class="footer-cont">
		<div class="action-details action-share">
			<span class="count">分享</span>
		</div>
		<div class="action-details action-info">
			<a href="<?php echo $item->getWapUrl();?>" class="count" id="itemDetail">商品详情</a>
		</div>
	</div>
</div>

<div class="share-container" style="">
    <div class="share-main">
        <span class="main-text">分享</span>
    </div>
	<div class="share-common">
		<div class="share-item" data-type="weibo" style="display: none;">
			<img class="share-icon" src="/resource/images/xin-share-weibo.png">
			<p class="share-item-name">微博</p>
		</div>
		<div class="share-item" data-type="weixin">
			<img class="share-icon" src="/resource/images/tencent_wechat.png">
			<p class="share-item-name">微信</p>
		</div>
		<div class="share-item" data-type="friends">
			<img class="share-icon" src="/resource/images/tencent_wechat_friend.png">
			<p class="share-item-name">朋友圈</p>
		</div>
		<div class="share-item" data-type="qq">
			<img class="share-icon" src="/resource/images/tencent_QQ.png">
			<p class="share-item-name">QQ</p>
		</div>
		<div class="share-item" data-type="qzone">
			<img class="share-icon" src="/resource/images/tencent_qzone.png">
			<p class="share-item-name">QQ空间</p>
		</div>
	</div>
	<div class="share-cancel">
		<p>取消</p>
	</div>
</div>
<div class="tip"
     style="position: fixed;top: 0;left: 0;bottom: 0;right: 0;background: rgba(0,0,0,0.6);display: none;z-index: 10;"></div>
<div class="xin-guide-mask" id="usl_share">
	<dl class="guide">
		<dt><img src="https://js.meixincdn.com/m/h5/dist/images/jiantou.png" alt=""></dt>
		<dd><img src="https://js.meixincdn.com/m/h5/dist/images/shou.png" alt=""></dd>
		<dd>请点击右上角 <img src="https://js.meixincdn.com/m/h5/dist/images/dian.png" alt="">后分享</dd>
	</dl>
</div>
<script src="/resource/scripts/modules/details.js"></script>
<script src="/resource/scripts/modules/share/share.js"></script>
</body>