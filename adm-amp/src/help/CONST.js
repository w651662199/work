export default {
	DRAWERPLAN: { // 新建投放计划默认值
		'name': '',
		'isContinuous': 1, // 是否连续投放
		'isUnlimited': 1, // 是否限制结束时间   0 限定  1 不限
		'startTime': Date.now(), // 开始时间
		'endTime': Date.now(), // 结束时间
		'schedule': [], // 时间段数组
		'saleMode': 3, // 计费方式
		'adLimited': 0, // 广告日是否限制预算
		'dailyAdBudget': 0, // 广告日预算
		'isRebate': 1, // 返利活动开启与否
		'rebateLimited': 1, // 返利日是否限制预算
		'dailyRebateBudget': 1000 // 返利日日预算
	},
	DRAWERUNIT: { // 新建投放单元默认值
		// 额外的字段需要手动传入  单元所属计划 ID 等
		'name': '',
		'platform': 1, // 投放平台（1-APP 2-WAP 3-PC）
		'type': 1, // 投放类型（1-商品推广 2-活动推广 ）
		'timeType': 0, // 时间定向类型（0-全时段 1-自定义）
		'time': [], // 时间定向
		'regionType': 0, // 地域定向类型（0-不限 1-自定义 ）
		'region': [], // 地域定向
		'ageType': 0, // 年龄定向类型（0-不限 1-自定义）
		'age': [], // 年龄定向
		'genderType': 0, //性别定向类型（0-不限 1-自定义）
		'gender': [], //性别
		'rebateBid': 10, // 分享返利
		'videoRebate': 10, //视频返利
		'researchRebate': 300, //调研返利
		'questionnaireTotalLimited': 1, //调查问卷收集份数 （0-不限 1-自定义 ）
		'advertisements': [],
		'surveyId': '',
		'validQuestionnaireNum': '',
		'keywords': [],
		'crowds': [], //人群定向
		'advertisementGroups': [1, 2],
		'adBid': 0,
		'wirelessAdBidRatio': 1
	},
	DRAWERIDEA: { // 新建创意默认值
		// 额外的字段需要手动传入  创意所属单元 ID 等
		'name': '',
		'productId': '',
		'promotionId': '',
		'type': 1, // 创意类型（1图片 2图文 3视频 4flash 5文字）
		'linkType': 1, // 链接类型（1商品 2店铺 3圈子 4话题 5url）
		'title': '', // 标题
		'image': [], // 图片
		'webpageId': '',
		'landingPage': '',
		'description': '', // 文案
		'relatedItems': [], // 联合推广商品
		'products': [],
		'relatedItemStrategy': 3,
		'topicId': '',
		'topicTitle': '', //话题标题
		'topicName': '', //话题名称
	},
	DRAWERPAGE: { //新建自建页
		'shopId': '', //店铺ID
		'videoId': '', //视频ID
		'itemList': [],
		'description': '', //店铺文案描述
		'useDefaultImage': 0, //视频封面图片
		'promotionType': 0, //视频推广内容
		'cardDescription': '', //分享卡描述
		'cardImage': '',
		'cardTitle': '', //分享卡标题
		'title': '', //标题
		'videoTitle': '', //视频模板标题
		'image': ''
	},
	DRAWQUESTION: { //新建调查问卷
		standQuestion: '标准题库',
		selectQueation: '单选题',
		questions: []
	},
	DRAWERTEMPLATE5: {
		'name': '',
		'title': '',
		'description': '',
		'image': '',
		'videoId': 0,
		'shopId': '',
		'platform': 1,
		'cardTitle': '',
		'cardImage': '',
		'cardDescription': '',
		'webpageTemplateId': 5,
		'webpageItems': [],
		'addSkuId': '',
		'promotionType': 1,
		'useDefaultImage': 0,
		'backgroundColor': '',
	},
	DRAWDMP: { //dmp
		'name': '', //名称
		'skus': [], //sku id
		'list': [] //列表
	},
	TIMESTAMP_2038_01_01: 2145888000000,
	PRODUCT_LINES: [{
		"productLineId": 2,
		"productLineName": "众达"
	}, {
		"productLineId": 3,
		"productLineName": "点效"
	}]
};