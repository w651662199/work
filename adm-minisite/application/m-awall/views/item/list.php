<script type="text/javascript" src="/resource/scripts/common/flexible_css.js"></script>
<script type="text/javascript" src="/resource/scripts/common/flexible.js"></script>
<script type="text/javascript" src="/resource/scripts/common/jquery.tmpl.min.js"></script>
<script type="text/javascript" src="/resource/scripts/modules/share/appInterface.js"></script>
<script type="text/javascript" src="/resource/scripts/weui/jquery-weui.min.js"></script>
<script type="text/javascript" src="/resource/scripts/common/common.js"></script>
<script type="text/javascript" src="/resource/scripts/modules/newMinisite.js"></script>
<link href="/resource/css/list.css" rel="stylesheet">
<script type="text/javascript">
	var slotId = <?php echo $itemSlotId; ?>;
    var activeId = <?php echo $activeSlotId; ?>;
</script>
<header data-role="header" class="header">
    <div class="header-back">
        <img src="/resource/images/Back_64px.png">
    </div>
    <div class="header-title">
        美媒
    </div>
</header>
<div class="main-page main-wap" data-role="page" data-iscroll="enable">
    <div class="tab-container">
        <span class="active">有腔调</span>
        <span class="">好东西</span>
    </div>
    <div class="content-container">
        <div class="page page-wap something-special">
            <div class="weui-pull-to-refresh__layer">
                <div class='weui-pull-to-refresh__arrow'></div>
                <div class='weui-pull-to-refresh__preloader'></div>
                <div class="down">下拉刷新</div>
                <div class="up">释放刷新</div>
                <div class="refresh">正在刷新</div>
            </div>
            <ul id="specialProductList" class="special-product-list">
            </ul>
            <div class="weui-loadmore" style="display: none">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            <!-- <div class="gotop" id="gotop"><i class="gotop-transition solid"> </i></div> -->
        </div>
        <div class="page page-wap something-good" data-role="content">
            <div class="weui-pull-to-refresh__layer">
                <div class='weui-pull-to-refresh__arrow'></div>
                <div class='weui-pull-to-refresh__preloader'></div>
                <div class="down">下拉刷新</div>
                <div class="up">释放刷新</div>
                <div class="refresh">正在加载</div>
            </div>
            <ul id="goodProductList" class="good-product-list">
            </ul>
            <div class="weui-loadmore" style="display: none">
                <i class="weui-loading"></i>
                <span class="weui-loadmore__tips">正在加载</span>
            </div>
            <div class="page-end">
                <span class="main-text">美媒</span>
            </div>
            <!-- <div class="gotop" id="gotop"><i class="gotop-transition solid"> </i></div> -->
        </div>
    </div>
</div>
<div class="gotop" id="gotop"><i class="gotop-transition solid"> </i></div>
<script id="goodProductListTmp" type="text/x-jquery-tmpl">
	<li class="product product-details" data-url="${product.impression_url}" data-visible>
		<a class="product-link" href="${product.click_url}">
			<div class="product-img">
				<img src="${product.promotion_image}">
			</div>
			<div class="product-info">
				<p class="product-title">${product.promotion_title}</p>
				<p class="product-info-text">${product.promotion_description}</p>
				<div class="product-action-btn">
					<div class="action-btn-con message">
						<img src="/resource/images/message.png">
						<span class="action-count">${product.promotion_comment_num}</span>
					</div>
				</div>
			</div>
		</a>
	</li>
</script>
<script id="activeAdTmp" type="text/x-jquery-tmpl">
    <li class="product special-product" data-url="${product.impression_url}" data-click="${product.click_url}" data-landing="${product.landing_url}" data-visible>
        <a class="product-link" href="${product.click_url}">
            <div class="special-product-com">
                <img src="${product.promotion_image}">
                <p class="special-product-title">${product.promotion_title}</p>
                <p class="special-product-text">${product.promotion_description}</p>
            </div>
        </a>
    </li>
</script>
<script type="text/javascript">
    $('.header-back').on('click', function() {
        history.back();
    });
</script>
