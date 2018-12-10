<head>
	<style type="text/css">
		html, body, div, p {
			padding: 0;
			margin: 0;
		}
		body {
			position: relative;
		}
		.err-con {
			position: absolute;
			width: 100%;
			top: 0;
			left: 0;
			right: 0;
			bottom: 0;
			background: #f2f2f2;
		}
		.err-icon {
			width: 2.04rem;
			height: 2.04rem;
			margin: 3rem auto .6rem;
			background: url('/resource/images/loading_fail.png') no-repeat;
			background-size: cover;
		}
		.err-msg {
			font-size: .36rem;
			color: #666;
			text-align: center;
			line-height: .5rem;
		}
		.err-load {
			width: 3.26rem;
			height: .8rem;
			margin: .3rem auto;
			line-height: .8rem;
			font-size: .36rem;
			text-align: center;
			background: #FB5656;
			color: #fff;
			border-radius: .8rem;
		}
	</style>
</head>
<body>
	<script>
    	(function(win){var doc=win.document,html=doc.documentElement,option=html.getAttribute("data-use-rem");if(option===null){return}var baseWidth=parseInt(option).toString()==="NaN"?640:parseInt(option);var grids=baseWidth/100;var clientWidth=html.clientWidth||320;var fontsize=html.style.fontSize=clientWidth/grids+"px";fontsize=parseFloat(fontsize);var maxFontsize=Math.ceil(fontsize);var minFontsize=Math.floor(fontsize);var testDom=document.createElement("div");var testDomWidth=0;var adjustRatio=0;testDom.style.cssText="height:0;width:1rem;";doc.body.appendChild(testDom);var calcTestDom=function(){testDomWidth=testDom.offsetWidth;if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)){if(testDomWidth<minFontsize||testDomWidth>maxFontsize){adjustRatio=clientWidth/grids/testDomWidth;var reCalcRem=clientWidth*adjustRatio/grids;html.style.fontSize=reCalcRem+"px"}else{doc.body.removeChild(testDom)}document.body.removeAttribute("style")}else{html.style.fontSize="50px";document.body.style.width="375px";document.body.style.margin="0 auto";doc.body.removeChild(testDom)}};setTimeout(calcTestDom,20);var reCalc=function(){var newCW=html.clientWidth;if(newCW===clientWidth){return}clientWidth=newCW;if(/iPhone|Android|MicroMessenger|gomeplus|QQ/g.test(navigator.userAgent)){html.style.fontSize=newCW*(adjustRatio?adjustRatio:1)/grids+"px";document.body.removeAttribute("style")}else{html.style.fontSize="50px";document.body.style.width="375px";document.body.style.margin="0 auto"}};if(!doc.addEventListener){return}var resizeEvt="orientationchange" in win?"orientationchange":"resize";win.addEventListener(resizeEvt,reCalc,false);doc.addEventListener("DOMContentLoaded",reCalc,false)})(window);
	</script>
	<div class="err-con" v-if="isError">
		<div class="err-icon"></div>
		<p class="err-msg">加载失败</p>
		<div class="err-load" id="JS_reload">重新加载</div>
	</div>
	<script type="text/javascript">
		var errEl = document.getElementById('JS_reload');
		errEl.addEventListener('click', function() {
			location.reload();
		});
	</script>
</body>