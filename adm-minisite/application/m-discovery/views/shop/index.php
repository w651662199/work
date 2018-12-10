<head>
	<title>好店</title>
	<link href="/resource/css/discovery/shop.css?v=1.0.2" rel="stylesheet">
	<script type="text/javascript">
		$CONFIG['shopId']= <?php echo $webpage->getShopId();?>;
		$CONFIG['cardTitle'] = "<?php echo $webpage->getCardTitle(); ?>";
		$CONFIG['cardImage'] = "<?php echo $webpage->getCardImage(); ?>";
		$CONFIG['cardDescription'] = "<?php echo $webpage->getCardDescription(); ?>";
	</script>
</head>
<body>
	<section class="shopDetail">
		<div class="shop_header">
			<div class="shop_inner">
				<div class="shop_logo">
					<img class="shop_icon" src="<?php echo $webpage->getImage();?>" alt="">
				</div>
				<h2><?php echo $webpage->getTitle();?></h2>
				<div class="rebate-con share_tips" style="display:none">
					<div id="J_shareRebat" class="rebate-item share"></div>
					<div id="J_researchRebate" class="rebate-item question"></div>
					<div class="rebate-btn rebate-item"><em></em> 返利说明</div>
				</div>
				<p>关注数：<span id="J_shopCollection_<?php echo $webpage->getShopId();?>"></span></p>
				<a href="<?php echo $webpage->getShopUrl();?>">进入店铺</a>
			</div>
		</div>
		<div class="shop_content">
			<div class="shop_info">
				<p><?php echo $webpage->getDescription();?></p>
			</div>
			<?php foreach($items as $item) {?>
				<img src="<?php echo $item->getImage();?>" alt="">
				<h2 class="item-price" data-id="<?php echo $item->getProductId(); ?>-<?php echo $item->getSkuId(); ?>"><?php echo $item->getName();?></h2>
				<a href="<?php echo $item->getItemUrl();?>" class="info_btn"><span class="price_<?php echo $item->getSkuId();?>"></span> | 查看详情</a>
				<p><?php echo $item->getDescription();?></p>
			<?php } ?>
		</div>
		<div class="detail_footer">
			<p>价格以商品详情页为准</p>
		</div>
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
