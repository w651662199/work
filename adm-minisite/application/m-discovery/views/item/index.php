<head>
	<title>清单</title>
	<link href="/resource/css/discovery/item.css?v=1.0.2" rel="stylesheet">
	<script type="text/javascript">
		$CONFIG['cardTitle'] = "<?php echo $webpage->getCardTitle(); ?>";
		$CONFIG['cardImage'] = "<?php echo $webpage->getCardImage(); ?>";
		$CONFIG['cardDescription'] = "<?php echo $webpage->getCardDescription(); ?>";
	</script>
</head>
<body>
	<section class="itemDetail">
		<div class="header_box">
			<img class="header_img" src="<?php echo $webpage->getImage();?>" alt="">
		</div>
		<div class="detail_content">
			<div class="content_header">
				<h2 class="detail-title"><?php echo $webpage->getTitle();?></h2>
				<div class="rebate-con share_tips" style="display:none">
					<div id="J_shareRebat" class="rebate-item share"></div>
					<div id="J_researchRebate" class="rebate-item question"></div>
					<div class="rebate-item rebate-btn"><em></em> 返利说明</div>
				</div>
				<p class="p_box"><?php echo $webpage->getDescription();?></p>
			</div>
			<div class="content_main">
				<ul>
				<?php foreach($items as $item) {?>
					<li class="item-content item-price" data-id="<?php echo $item->getProductId(); ?>-<?php echo $item->getSkuId(); ?>">
					<a href="<?php echo $item->getItemUrl();?>">
						<img src="<?php echo $item->getImage();?>" alt="">
						<h2><?php echo $item->getDescription();?></h2>
						<p class="price_<?php echo $item->getSkuId();?>"></p>
					</a>
					</li>
				<?php } ?>
				</ul>
			</div>
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
