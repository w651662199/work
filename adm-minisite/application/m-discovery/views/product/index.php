<head>
	<title>好物</title>
	<link href="/resource/css/discovery/product.css?v=1.0.2" rel="stylesheet">
	<script type="text/javascript">
		$CONFIG['cardTitle'] = "<?php echo $material->getTitle(); ?>";
		$CONFIG['cardImage'] = "<?php echo $material->getImage();?>";
		$CONFIG['cardDescription'] = "<?php echo str_replace(array("\r\n", "\n"), "", HTML::chars($material->getDescription())); ?>";
	</script>
</head>
<body>
	<section class="product-detail">
		<a href="<?php echo $item->getH5Url();?>">
			<div class="proudct-img">
				<img src="<?php echo $material->getImage();?>">
			</div>
			<div class="product-title clearfix">
				<h2><?php echo $material->getTitle(); ?></h2>
			</div>
		</a>
		<div class="rebate-con share_tips" style="display:none">
			<div id="J_shareRebat" class="rebate-item share"></div>
			<div id="J_researchRebate" class="rebate-item question"></div>
			<div class="rebate-item rebate-btn"><em></em> 返利说明</div>
		</div>
		<p class="product-price"><a href="<?php echo $item->getH5Url();?>"><span class="main-color">￥<?php echo $item->getRealSalePrice(); ?></span> 查看详情</a></p>
		<a href="<?php echo $item->getH5Url();?>">
			<p class="product-desc">
				<?php echo $material->getDescription(); ?>
			</p>
			<div class="product-count clearfix">
				<div class="collect clearfix">
					<img src="/resource/images/message.png">
					<span><?php echo $item->getCommentQuantity(); ?></span>
				</div>
			</div>
		</a>
	</section>
	<?php if (count($material->getRelatedItems()) > 0) { ?>
	<div class="product-others">
		<p class="title">你可能还喜欢</p>
		<ul class="product-others-list">
			<?php foreach ($material->getRelatedItems() as $relatedItem) { ?>
				<li class="list-item">
					<a href="<?php echo $relatedItem['h5Url'];?>">
						<img src="<?php echo preg_replace('/^http:\/\//', 'https://', $relatedItem['image']);?>">
						<p class="item-price price_<?php echo $relatedItem['itemId']; ?>" data-id="<?php echo $relatedItem['productId']; ?>-<?php echo $relatedItem['itemId']; ?>"><span></span></p>
					</a>
				</li>
			<?php } ?>
		</ul>
	</div>
	<?php }?>
	<div class="detail_footer">
		<p>价格以商品详情页为准</p>
	</div>
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
