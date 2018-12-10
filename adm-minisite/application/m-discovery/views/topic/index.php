<head>
	<title>发现</title>
	<link href="/resource/css/discovery/topic.css?v=1.0.2" rel="stylesheet">
	<script type="text/javascript">
		$CONFIG['cardTitle'] = "<?php echo $topic->getName(); ?>";
		$CONFIG['cardImage'] = "<?php echo $material->getImage(); ?>";
		$CONFIG['cardDescription'] = "<?php echo str_replace(array("\r\n", "\n"), "", HTML::chars($material->getDescription())); ?>";
	</script>
	<script src="https://js.meixincdn.com/gvs-player/dist/vod/js/meixinplayer-min.js"></script>
</head>
<body class="opg">
	<section class="selectedDetail">
		<img class="header_img" src="<?php echo $material->getImage();?>" alt="">
		<div class="selectedContent">
			<h2 class="detail-title"><?php echo $topic->getName();?></h2>
			<div class="rebate-con share_tips" style="display:none">
				<div id="J_shareRebat" class="rebate-item share"></div>
				<div id="J_researchRebate" class="rebate-item question"></div>
				<div class="rebate-btn rebate-item"><em></em> 返利说明</div>
			</div>
			<?php foreach($topic->getTopicComponents() as $topicComponent) {?>
				<?php if($topicComponent->getIsText()) {?>
				<p class="tpc-para"><?php echo $topicComponent->getText();?></p>
				<?php } elseif($topicComponent->getIsImage()) {?>
				<div class="tpc-img-box">
					<?php if($topicComponent->getScheme()) {?>
						<a href="<?php echo $topicComponent->getScheme();?>">
					<?php } ?>
					<img src="<?php echo $topicComponent->getUrl();?>" onerror="javascript:this.src='http://css.meixincdn.com/m/h5/dist/images/default_product.png'">
					<?php if($topicComponent->getScheme()) {?>
						</a>
					<?php } ?>
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
			<div class="author_box">
				<img class="header_img" src="<?php echo $topic->getTopicUser()->getFacePicUrl();?>" alt="">
				<p><?php echo $topic->getTopicUser()->getNickname();?></p>
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
