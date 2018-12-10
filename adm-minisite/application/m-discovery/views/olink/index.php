<head>
	<title></title>
	<link rel="stylesheet" type="text/css" href="/resource/css/discovery/common.css?v=1.0.1">
	<script type="text/javascript">
		$CONFIG['cardTitle'] = "<?php echo $material->getTitle(); ?>";
		$CONFIG['cardImage'] = "<?php echo $material->getImage();?>";
		$CONFIG['cardDescription'] = "<?php echo str_replace(array("\r\n", "\n"), "", HTML::chars($material->getDescription())); ?>";
	</script>
	<style type="text/css">
		html, body {
			height: 100%;
		}
		body {margin-left: 0px;margin-top: 0px;margin-right: 0px;margin-bottom: 0px;overflow: hidden;}
		.js-iframe {
			box-sizing: border-box;
		}
		.in-app {
			padding-bottom: 1rem;
		}
		.out-app {
			padding-bottom: 2rem;
		}
  </style>
</head>
<body>
	<iframe class="js-iframe" src="<?php echo $material->getLandingPage(); ?>" width='100%' height='100%' frameborder='0' name="_blank" id="_blank"></iframe>
	<script type="text/javascript">
		(function() {
			var iframe = document.querySelector('.js-iframe');
			if (/GomeMMBoard/ig.test(navigator.userAgent)) {
				iframe.setAttribute('class', iframe.className + ' in-app');
				// $('.js-iframe').addClass('in-app');
			} else {
				iframe.setAttribute('class', iframe.className + ' in-app');
				// $('.js-iframe').addClass('out-app');
			}
			if (/MicroMessenger/ig.test(navigator.userAgent)) {
				iframe.setAttribute('class', iframe.className + ' mid-padding');
			}
		})();
	</script>
</body>