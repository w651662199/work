export default {
	//售卖方式
	SALE_MODE: {
		// 定价CPM
		FIX_CPM: 1,
		// 竞价CPM
		BID_CPM: 2
	},
	// 广告形式分类
	FORMAT_CATEGORY: {
		// 原生
		NATIVE: 1,
		//应用下载
		DOWNLOAD: 2,
		// 视频
		VIDEO: 3,
		// 图片
		IMAGE: 4
	},
	//投放方式
	BIDDING_MODE: {
		PDB: 1,
		PD: 2,
		RTB: 3
	},
	CAMPAIGN_STATUS: {
		//暂停
		SUSPEND: 1,
		//投放中
		NORMAL: 2,
		//未开始
		UNSTART: 3,
		//日预算到量
		RUN_OUT_OF_BUDGET: 4,
		//账户余额不足
		BLANCE_NOT_ENOUGH: 5,
		//投放结束
		FINISHED: 6
	},
	FLIGHT_STATUS: {
		//暂停
		SUSPEND: 1,
		//投放中
		NORMAL: 2,
		//每日曝光到量
		DAILY_EXPOSURE_ENOUGHT: 3
	},
	MATERIAL_APPROVE_STATUS: {
		//不通过
		REJECT: -1,
		//待审核
		APPROVING: 0,
		//通过
		APPROVED: 1
	},
	GIF_DURATION: {
		DURATION: 5
	},
	//操作系统
	OS: {
		IOS: '2',
		ANDROID: '1'
	},
	//网络
	NET: {
		WIFI: '1',
		G2: '2',
		G3: '3',
		G4: '4'
	},
	//媒体类型
	MEDIA_TYPE: {
		APP: 1,
		WEB: 2
	},
	//广告形式中约束的操作符
	OPERATOR: {
		//等于
		EQUAL: 0,
		//大于
		LARGE: 1,
		//大于等于
		LARGE_EQUAL: 2,
		//小于
		LESS: 3,
		//小于等于
		LESS_EQUAL: 4
	},
	//标签维度
	TAG_DIMENSION: {
		//sku
		SKU: 1,
		//品类
		CATEGORY: 2,
		//品牌
		BRAND: 3
	},
	//标签行为
	TAG_BEHAVIOR: {
		//浏览
		VIEW: 1,
		//加购
		ADD_CART: 2,
		//购买
		BUY: 3,
		//搜索
		SEARCH: 4
	},
	//标签行为时间
	TAG_BEHAVIOR_TIME: {
		//1天
		ONE_DAY: 1,
		//3天
		THREE_DAY: 2,
		//7天
		SEVEN_DAY: 3,
		//15天
		HALF_MONTH: 4,
		//1个月
		MONTH: 5,
		//2个月
		TWO_MONTH: 6,
		//3个月
		THREE_MONTH: 7,
		//6个月
		SIX_MONTH: 8,
		//12个月
		YEAR: 9,
		//18个月
		ONE_HALF_YEAR: 0
	},
	PLATFORM_TAG_TYPE: {
		//基础属性
		BASE: 1,
		//购物偏好
		SHOP: 2,
		//客户服务
		CUSTOMER: 3
	},
	CROWD_TYPE: {
		//与
		AND: 1,
		//或
		OR: 2,
		//非
		NOT: 3
	},
	CROWD_LOGIC: {
		//与
		AND: 1,
		//或
		OR: 2
	},
	//人群计算状态
	CROWD_RUN_STATUS: {
		//未开始
		UN_START: 0,
		//人群组运算中
		RUNNING: 1,
		//人群组运算完成，人群运算中
		CROWD_RUNNING: 2,
		//运算完成
		FINISH: 3
	},
	//品类级别
	CATEGORY_LEVEL: {
		ONE: 1,
		TWO: 2,
		THREE: 3
	},
	//报表时间筛选条件可选天数
	REPORT_DAYS: 60
};