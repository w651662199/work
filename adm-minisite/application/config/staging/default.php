<?php
return array (
	'globalConfigs' => array (
		'adrequestUrl' => 'https://flight-pre.gomeplus.com/adrequest',
		'adrequestIdUrl' => 'https://flight-pre.gomeplus.com/rebate',
		'shareUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/share',
		'shareImpressionUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/shareImpression',
		'rebateBudgetUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/rebateBudget',
		'middlePageImpression' => 'http://ad-shareserver.pre.ds.gome.com.cn/middlePageImpression',

		'pcHost' => 'http://awall.pre.gomeplus.com/',
		'wapHost' => 'http://m-awall.pre.gomeplus.com/',
		'h5Host' => 'http://h5-awall.pre.gomeplus.com/',

		'rebateUrl' => 'http://h5-awall.pre.gomeplus.com/item/rebate',
		'protocolUrl' => 'http://h5-awall.pre.gomeplus.com/item/protocol',

		'gomeItemHost' => 'https://item.m.gomeplus.com/',
		'gomeHost' => 'https://m.gomeplus.com/',
	),

	'configs' => array (
		'domain' => 'http://discovery.pre.ds.gome.com.cn/',
		'mdomain' => 'http://m-discovery.pre.ds.gome.com.cn/',
		'awalldomain' => 'http://awall.pre.ds.gome.com.cn',
		'mmBoardDomain' => 'http://m-awall.stage.ds.gome.com.cn',
		'mmbDomain' => 'http://meimeibang.gome.com.cn',
		'shareServerDomain' => 'http://ad-shareserver.pre.ds.gome.com.cn',
		// 广告请求接口（余招财）
		'adrequestUrl' => 'http://ad-flitght.pre.ds.gome.com.cn/flight',
		// 查询返利预算状态&&查询三个返利标签的价格接口（徒康正）
		'rebateBudgetUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/rebateBudget',
		// 点赞/点赞状态接口（徒康正）
		'pariseUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/parise',
		// 获取点赞状态接口（徒康正）
		'pariseInfoUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/pariseInfo',
		// 分享数接口（徒康正）
		'shareCountUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/discoveryShare',
		// 获取列表页点赞数/点赞状态、分享数接口（徒康正）
		'batchPraiseShareUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/pariseShareBatch',
		// 分享返利接口（徒康正）
		'shareRebateUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/shareRebate',
		// 视频播放返利接口（徒康正）
		'videoShareUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/video',
		// 问卷调查返利/问卷调查数接口（徒康正）
		'questionRebateUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/questionRebate',
		// 问卷调查浏览数接口（徒康正）
		'questionViewUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/questionView',
		// 中间页曝光接口（徒康正）
		'middlePageImpressionUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/middlePageImpression',
		// 根据调查问卷返利数目和日预算显示调查问卷入口接口（徒康正）
		'questionInvestAppearUrl' => 'http://ad-shareserver.pre.ds.gome.com.cn/questionInvestAppear',

		// 问卷页面地址
		'surveyUrl' => 'http://m-discovery.pre.ds.gome.com.cn/survey/',

		// 视频计数接口（熊仁海）
		'setVideoCountUrl' => 'http://count-v.pre.video.api/set/video/',
		'getVideoCountUrl' => 'http://count-v.pre.video.api/get/video/',

		//用户任务接口域名
		'missionDoMain' => 'http://10.125.192.169:8089/',
		//用户任务入口地址
		'missionUrl' => 'http://discovery.pre.ds.gome.com.cn/mission',
		// 视频播放环境
		'env' => 'pre',
	),

	'slotIds' => array (
		//美媒榜-精选
		'slotId' => 20011,
		'wapSlotId' => 20012,
		// 美媒--好东西（内嵌）
		'h5ItemSlotId' => 10090,
		// 美媒--好东西（wap）
		'wapItemSlotId' => 10091,
		// 美媒--有腔调（内嵌）
		'activeH5' => 10093,
		// 美媒--有腔调（wap）
		'activeWap' => 10094,

		// 探索频道--发现
		'h5DiscoveryTopicId' => 10250,
		'wapDiscoveryTopicId' => 10836,
		// 探索频道--好店
		'h5DiscoveryShopId' => 10251,
		'wapDiscoveryShopId' => 10837,
		// 探索频道--清单
		'h5DiscoveryItemId' => 10252,
		'wapDiscoveryItemId' => 10838,
		// 探索频道--视频
		'h5DiscoveryVideoId' => 10253,
		'wapDiscoveryVideoId' => 10840,
		// 探索频道--好物
		'h5DiscoveryProductId' => 10326,
		'wapDiscoveryProductId' => 10839,

		//活动页面--国美会员亲友节
		'slidSlotId' => array(10617, 10618, 10619, 10620),
		'topicSlotId' => array(10336, 10337),
		'likeSlotId' => 10335,
		'webpageSlotId' => 10334,
		'goodSlotId' => 10333,
		'webpageCount' => 5,
		'goodCount' => 5,

		//PC端活动页面
		'pcSlidSlotId' => array(10521,10522,10523,10524),
		'pcTopSlotId' => array(10525),
		'pcListSlotId' => 10802
	),

	'advertisementIds' => array (
		'h5ItemAdvertisementId' => 10171,
		'wapItemAdvertisementId' => 10172,
		//'h5WebpageAdvertisementId' => 10118,
		//'wapWebpageAdvertisementId' => 10119,
		'h5WebpageAdvertisementId' => 10173,
		'wapWebpageAdvertisementId' => 10174,
	),

	'wx' => array(
		'appid' => 'wx77edddc93a91176f',
		'gj_appid' => 'wx9f20920141def6e6',
		'app_secret' => 'a136798d345d6ad094e91b4679ecf8fa',
		'gj_app_secret' => 'da5a625b0c506ec9e436fff86ceda64d',
	),

	'entry' => array(
		'h5' => array(
			'imageUrl' => 'https://i5.meixincdn.com/v1/img/T1QvdTBTZv1R4cSCrK.png',
			'entryUrl' => 'http://h5-awall.pre.gomeplus.com/',
		),
		'wap' => array(
			'imageUrl' => 'https://i5.meixincdn.com/v1/img/T1QvdTBTZv1R4cSCrK.png',
			'entryUrl' => 'http://m-awall.pre.gomeplus.com/',
		)
	),

	'sms' => array(
		'userName' => 15313729295,
		'password' => '3040D5ACE3A9C2EE25C46F42FB9C',
		'type' => 'pt',
		'smsUrl' => 'http://web.cr6868.com/asmx/smsservice.aspx',
		'title' => '免费充电',
		'landingPage' => 'http://m-awall.pre.gomeplus.com/battery/index',
		'testLandingPage' => 'http://m-awall.pre.gomeplus.com/test/index',
	)
);
