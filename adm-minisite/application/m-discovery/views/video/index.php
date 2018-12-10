<head>
	<title>视频</title>
	<link href="/resource/css/discovery/video.css?v=1.0.2" rel="stylesheet">
	<script type="text/javascript">
		$CONFIG['videoId']= <?php echo $webpage->getVideoId();?>;
		$CONFIG['videoImage']= "<?php echo $webpage->getImage();?>";
		$CONFIG['cardTitle'] = "<?php echo $webpage->getCardTitle(); ?>";
		$CONFIG['cardImage'] = "<?php echo $webpage->getCardImage(); ?>";
		$CONFIG['cardDescription'] = "<?php echo $webpage->getCardDescription(); ?>";
	</script>
	<script type="text/javascript" src="https://js.meixincdn.com/gvs-player/dist/vod/js/meixinplayer-min.js"></script>
</head>
<body>
	<section class="videoDetail">
		<div class="video_header">
			<div class="video-box videoContainer" id="videoContainer" style="width:100%;">
				<img class="video-poster" src="<?php echo $webpage->getImage();?>">
				<div class="mxvInit icons video-icon"></div>
			</div>
			<div class="video_content">
			<h2 class="detail-title"><?php echo $webpage->getTitle();?></h2>
				<div class="rebate-con share_tips" style="display:none">
					<div id="J_shareRebat" class="rebate-item share"></div>
					<div id="J_researchRebate" class="rebate-item question"></div>
					<div id="J_watchRebate" class="rebate-item video"></div>
					<div class="rebate-btn rebate-item"><em></em> 返利说明</div>
				</div>
				<p><?php echo $webpage->getDescription();?></p>
			</div>
		</div>
		<?php if($webpage->getPromotionType() == 1) {?>
		<div class="video_templet_list">
			<div class="video_list">
				<ul>
				<?php foreach($items as $item) {?>
					<li class="item-price" data-id="<?php echo $item->getProductId(); ?>-<?php echo $item->getSkuId(); ?>">
						<a href="<?php echo $item->getItemUrl();?>">
							<img src="<?php echo $item->getImage();?>" alt="">
							<div class="shop_item_right">
								<h2><?php echo $item->getName();?></h2>
								<p><?php echo $item->getDescription();?></p>
								<span class="price_<?php echo $item->getSkuId();?>"></span>
							</div>
						</a>
					</li>
				<?php }?>
				</ul>
			</div>
			<div class="detail_footer">
				<p>价格以商品详情页为准</p>
			</div>
		</div>
		<?php } elseif($webpage->getPromotionType() == 2) {?>
		<div class="video_templet_shop">
			<?php foreach ($items as $item) {?>
			<div class="video_inner">
				<div class="shop_logo">
					<img src="<?php echo $item->getImage();?>" alt="">
				</div>
				<h2><?php echo $item->getName();?></h2>
				<p><span><?php echo $item->getDescription();?></span></p>
				<a href="<?php echo $item->getShopUrl();?>" class="goShop">进入店铺</a>
			</div>
			<?php }?>
		</div>
		<?php }?>
	</section>
	<div id="answered" class="none">
		<div class="content">
			<div class="top">
				<div class="top-finish">
					<p>您已参与过此次调研</p>
					<p>感谢您的参与</p>
				</div>
			</div>
			<a class="bottom">完成</a>
		</div>
	</div>
</body>
