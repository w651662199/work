<?php
return array (
	'globalConfigs' => array (
		'adrequestUrl' => 'https://flight.gome.com.cn/flight',
		'adrequestIdUrl' => 'https://flight.gome.com.cn/rebate',
		'shareUrl' => 'https://shareserver.gome.com.cn/share',
		'shareImpressionUrl' => 'https://shareserver.gome.com.cn/shareImpression',
		'rebateBudgetUrl' => 'https://shareserver.gome.com.cn/rebateBudget',
		'middlePageImpression' => 'https://shareserver.gome.com.cn/middlePageImpression',

		'pcHost' => 'https://awall.gome.com.cn/',
		'wapHost' => 'https://m-awall.gome.com.cn/',
		'h5Host' => 'https://h5-awall.gome.com.cn/',

		'rebateUrl' => 'https://h5-awall.gome.com.cn/item/rebate',
		'protocolUrl' => 'https://h5-awall.gome.com.cn/item/protocol',

		'gomeItemHost' => 'https://item.m.gomeplus.com/',
		'gomeHost' => 'https://m.gomeplus.com/',

	),

	'configs' => array (
		'domain' => 'https://discovery.gome.com.cn/',
		'mdomain' => 'https://m-discovery.gome.com.cn/',
		'mmBoardDomain' => 'https://mm.gome.com.cn',
		'mmbDomain' => 'http://meimeibang.gome.com.cn',
		'shareServerDomain' => 'https://shareserver.gome.com.cn',

		// 广告请求接口（余招财）
		'adrequestUrl' => 'https://flight.gome.com.cn/flight',
		// 查询返利预算状态&&查询三个返利标签的价格接口（徒康正）
		'rebateBudgetUrl' => 'https://shareserver.gome.com.cn/rebateBudget',
		// 点赞/点赞状态接口（徒康正）
		'pariseUrl' => 'https://shareserver.gome.com.cn/parise',
		// 获取点赞状态接口（徒康正）
		'pariseInfoUrl' => 'https://shareserver.gome.com.cn/pariseInfo',
		// 分享数接口（徒康正）
		'shareCountUrl' => 'https://shareserver.gome.com.cn/discoveryShare',
		// 获取列表页点赞数/点赞状态、分享数接口（徒康正）
		'batchPraiseShareUrl' => 'https://shareserver.gome.com.cn/pariseShareBatch',
		// 分享返利接口（徒康正）
		'shareRebateUrl' => 'https://shareserver.gome.com.cn/shareRebate',
		// 视频播放返利接口（徒康正）
		'videoShareUrl' => 'https://shareserver.gome.com.cn/video',
		// 问卷调查返利/问卷调查数接口（徒康正）
		'questionRebateUrl' => 'https://shareserver.gome.com.cn/questionRebate',
		// 问卷调查浏览数接口（徒康正）
		'questionViewUrl' => 'https://shareserver.gome.com.cn/questionView',
		// 中间页曝光接口（徒康正）
		'middlePageImpressionUrl' => 'https://shareserver.gome.com.cn/middlePageImpression',
		// 根据调查问卷返利数目和日预算显示调查问卷入口接口（徒康正）
		'questionInvestAppearUrl' => 'https://shareserver.gome.com.cn/questionInvestAppear',

		// 问卷页面地址
		'surveyUrl' => 'https://m-discovery.gome.com.cn/survey/',

		// 视频计数接口（熊仁海）
		'setVideoCountUrl' => 'https://count-v.gomeplus.com/set/video/',
		'getVideoCountUrl' => 'https://count-v.gomeplus.com/get/video/',

		//用户任务接口域名
		'missionDoMain' => 'https://missionserver.gome.com.cn',
		//用户任务入口地址
		'missionUrl' => 'https://m-discovery.gome.com.cn/mission',
		// 视频播放环境
		'env' => 'dist',
	),

	'slotIds' => array (
		//美媒榜-精选
		'slotId' => 10142,
		'wapSlotId' => 10141,
		// 美媒--好东西（内嵌）
		'h5ItemSlotId' => 10040,
		// 美媒--好东西（wap）
		'wapItemSlotId' => 10041,
		// 美媒--有腔调（内嵌）
		'activeH5' => 10042,
		// 美媒--有腔调（wap）
		'activeWap' => 10043,

		// 探索频道--发现
		'h5DiscoveryTopicId' => 10070,
		'wapDiscoveryTopicId' => 10071,
		// 探索频道--好店
		'h5DiscoveryShopId' => 10064,
		'wapDiscoveryShopId' => 10065,
		// 探索频道--清单
		'h5DiscoveryItemId' => 10068,
		'wapDiscoveryItemId' => 10069,
		// 探索频道--视频
		'h5DiscoveryVideoId' => 10066,
		'wapDiscoveryVideoId' => 10067,
		// 探索频道--好物
		'h5DiscoveryProductId' => 10083,
		'wapDiscoveryProductId' => 10084,

		//活动页面--国美会员亲友节
		'slidSlotId' => array(10093, 10094, 10095, 10096),
		'topicSlotId' => array(10097, 10098),
		'likeSlotId' => 10099,
		'webpageSlotId' => 10100,
		'goodSlotId' => 10101,
		'webpageCount' => 5,
		'goodCount' => 5,

		//PC端活动页面
		'pcSlidSlotId' => array(10104,10105,10106,10107),
		'pcTopSlotId' => array(10108),
		'pcListSlotId' => 10109
	),

	'advertisementIds' => array (
		'h5ItemAdvertisementId' => 10038,
		'wapItemAdvertisementId' => 10039,
		'h5WebpageAdvertisementId' => 10040,
		'wapWebpageAdvertisementId' => 10041,
	),

	'wx' => array(
		'appid' => 'wx77edddc93a91176f',
		'gj_appid' => 'wx9f20920141def6e6',
		'app_secret' => 'a136798d345d6ad094e91b4679ecf8fa',
		'gj_app_secret' => 'da5a625b0c506ec9e436fff86ceda64d',
	),

	'entry' => array(
		'h5' => array(
			'imageUrl' => 'https://i8.meixincdn.com/v1/img/T1IPWTBCbv1R4cSCrK.png',
			'entryUrl' => 'https://h5-awall.gome.com.cn/',
		),
		'wap' => array(
			'imageUrl' => 'https://i8.meixincdn.com/v1/img/T1IPWTBCbv1R4cSCrK.png',
			'entryUrl' => 'https://m-awall.gome.com.cn/',
		)
	),

	'sms' => array(
		'userName' => 15313729295,
		'password' => '3040D5ACE3A9C2EE25C46F42FB9C',
		'type' => 'pt',
		'smsUrl' => 'http://web.cr6868.com/asmx/smsservice.aspx',
		'title' => '免费充电',
		'landingPage' => 'https://m-awall.gome.com.cn/battery/index',
		'testLandingPage' => 'https://m-awall.gome.com.cn/test/index',
	)
);
