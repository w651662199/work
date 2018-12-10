<head>
	<title>发现</title>
	<link href="/resource/css/discovery/topic.css?v=1.0.2" rel="stylesheet">
	<script type="text/javascript">
		$CONFIG['cardTitle'] = "<?php echo $webpage->getCardTitle(); ?>";
		$CONFIG['cardImage'] = "<?php echo $webpage->getCardImage(); ?>";
		$CONFIG['cardDescription'] = "<?php echo $webpage->getCardDescription(); ?>";
	</script>
	<script src="https://js.meixincdn.com/gvs-player/dist/vod/js/meixinplayer-min.js"></script>
</head>
<body class="opg">
	<section class="selectedDetail">
		<div class="selectedContent webpage-template">
			<div class="webpage-detail-title">
				<h2><?php echo $webpage->getTitle();?></h2>
				<div class="rebate-con share_tips" style="display:none">
					<div id="J_shareRebat" class="rebate-item share"></div>
					<div id="J_researchRebate" class="rebate-item question"></div>
					<div class="rebate-btn rebate-item"><em></em> 返利说明</div>
				</div>
			</div>
			<?php foreach($items as $item) {?>
				<?php if($item->getIsWords()) {?>
				<p class="tpc-para"><?php echo $item->getWords();?></p>
				<?php } elseif($item->getIsImage()) {?>
				<div class="tpc-img-box">
					<img src="<?php echo $item->getImage();?>" onerror="javascript:this.src='http://css.meixincdn.com/m/h5/dist/images/default_product.png'">
				</div>
				<?php } elseif($item->getIsVideo()) {?>
				<div class="video-box videoContainer" id="videoContainer_<?php echo $item->getVideoId();?>" style="width:100%;"></div>
				<script type="text/javascript">
					var v = new MeixinPlayer();
					var config = {
						autoplay: 0,
						autoSize: 1,
						env: $CONFIG['env'],
						poster: '<?php echo $item->getImage();?>',
					}
					v.init(<?php echo $item->getVideoId();?>, 'videoContainer_<?php echo $item->getVideoId();?>', config);
				</script>
				<?php } elseif($item->getIsProduct()) {?>
				<a class="block-a item-price" href="<?php echo $item->getItemUrl(); ?>" data-id="<?php echo $item->getProductId(); ?>-<?php echo $item->getSkuId(); ?>">
					<figure class="tpc-good-zone">
						<img class="tpc-gd-img" src="<?php echo $item->getImage();?>" data-source="<?php echo $item->getImage(); ?>" alt="<?php echo $item->getName();?>">
						<figcaption class="tpc-fig">
							<h4 class="tpc-gd-title"><?php echo $item->getName();?></h4>
							<p class="tpc-price price_<?php echo $item->getSkuId();?>" style="color: #f66a6b"><span>¥ <?php echo $item->getPrice();?></span></p>
						</figcaption>
					</figure>
				</a>
				<?php } ?>
			<?php } ?>
			<div class="author_box">
				<img class="header_img" src="<?php echo $webpage->getPlatformAvatar();?>" alt="" onerror="this.onerror=null;this.src='https://js.gomein.net.cn/plus/plus-public/images/public/fail-face.png'">
				<p><?php echo $webpage->getPlatformNickname();?></p>
			</div>
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