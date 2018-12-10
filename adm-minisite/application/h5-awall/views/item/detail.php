<title><?php echo $material->getTitle(); ?></title>
<link href="/resource/css/detail.css" rel="stylesheet">
<script type="text/javascript" src="/resource/scripts/modules/goods.js"></script>
<script type="text/javascript">
	var slotId = <?php echo $itemSlotId; ?>;
	var itemId = <?php echo $item->getId(); ?>;
	var shopId = <?php echo $item->getShopId(); ?>;
	var rebateBid = <?php echo $flightAdvertisement !== NULL ? $flightAdvertisement->getRealRebateBid() : 0; ?>;
</script>

<div class="main-container">
	<div class="product-img">
		<div class="top-share-btn rebateBudget" id="rebateBudgetTop">
			<div class="text-no" style="display: none">分享</div>
			<div class="text-yes">
				<div class="share-price">￥<?php echo $flightAdvertisement !== NULL ? $flightAdvertisement->getRealRebateBid() : 0; ?></div>
				<div class="share-text">分享可得</div>
			</div>
		</div>
		<a href="<?php echo $item->getH5Url();?>"><img class="product-img-info" src="<?php echo $material->getImage();?>"></a>
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
			<a href="<?php echo $relatedItem['h5Url'];?>"><li><img src="<?php echo $relatedItem['image'];?>"></li></a>
		<?php } ?>
		</ul>
	</div>
	<div class="footer-cont">
		<div class="action-details action-share">
			<span class="count">分享<span class="rebateBudget">得￥<?php echo $flightAdvertisement !== NULL ? $flightAdvertisement->getRealRebateBid() : 0; ?></span></span>
		</div>
		<div class="action-details action-info">
			<span class="count" id="itemDetail"><a href="<?php echo $item->getH5Url();?>">商品详情</a></span>
		</div>
	</div>
</div>

<div class="share-container" style="">
    <div class="share-main">
        <span class="main-text">分享<span class="rebateBudget" id="rebateBudget">成功得￥<?php echo $flightAdvertisement !== NULL ? $flightAdvertisement->getRealRebateBid() : 0; ?></span></span>
    </div>
	<div class="share-text-info rebateBudget">
		<p>1.分享后，内容被打开才有机会获得返利</p>
		<p>2.一条内容每天最多可获得一次返利</p>
		<p class="rebate-rule">点击了解分享返利规则详情&nbsp;></p>
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
<script src="/resource/scripts/modules/details.js"></script>
<script src="/resource/scripts/common/md5.min.js"></script>
<script src="/resource/scripts/modules/share/appInterface.js"></script>
<script src="/resource/scripts/modules/share/gomeShare.js"></script>
