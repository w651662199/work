export const REGEXP = {
	telNumber:/^1\d{10}$/g,
	userName:/[\u4e00-\u9fa5_a-zA-Z_]{1,10}/g,
	email:/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/g,
	containSpeCharacter:/[`~!@#$^&*()=|\d|{}':;',\[\].<>/?~！@#￥……&*（）——|{}【】‘；：”“’。，、？]/g
};
export const ERRORMESSAGE = {
	commonMessage:{
		nameExisted:'该名称已存在',
		nameMaxLength:'最大长度不超过30个汉字'
	},
	drawerPlan:{
		planNameRequired:'请输入投放计划名称',
		planNameMaxLength:'最大长度不超过30个汉字',
		planEndTimeRequired:'请选择结束时间',
		noContinuousUnSelected:'请选择投放时间',
		dailyAdBudgetRequired:'请填写广告日预算',
		dailyAdBudgetMax:'最大值不超过99,999,999.00',
		dailyRebateBudgetRequired:'请填写返利日预算',
		dailyRebateBudgetMax:'最大值不超过99,999,999.00'
	},
	drawerUnit:{
		unitNameRequired:'请输入投放单元名称',
		unitNameMaxLength:'最大长度不超过30个汉字',
		rebateOfferRequired:'请输入返利出价',
		rebateOfferMinValue:'返利出价最低为0,01元/次',
		rebateOfferMaxValue:'返利出价最高不超过100元/次',
		deliveryAreaRequired:'投放地域不能为空',
		deliveryTimeRequired:'投放时间段不能为空',
	},
	drawerIdea:{
		ideaNameRequired:'请输入创意名称',
		ideaNameMaxLength:'最大长度不超过30个汉字',
		goodsNumberRequired:'请输入商品编号',
		shopGoodsNumber:'请输入本店铺商品编号',
		authorizeShopGoodsNumber:'请输入已授权的商品编号',
		adTitleRequired:'请输入广告标题',
		adTitleMaxLength:'最大长度不超过16个汉字',
		ideaPictureReequired:'请上传创意图片',
		adDocumentRequired:'请输入广告文案',
		adDocumentMaxLength:'最大长度不超过80个汉字',
		sameGoodsNumber:'请输入不同的商品编号'

	},
	ContactWay:{
		nameRequired:'请输入联系人名称',
		nameMaxLength:'最大长度不超过10个汉字',
		nameContainChar:'仅限输入字母和汉字',
		cellPhoneNumberRequired:'请输入手机号',
		cellPhoneNumberInvalid:'请输入有效手机号',
		emailRequired:'请输入邮箱',
		emailInvalid:'请输入有效邮箱'
	},
	Balance:{
		balanceMoneyRequired:'请输入提醒金额',
		balanceMoneyMaxValue:'提醒金额最高不超过1000元'
	},
	Certificate: {
		qualificationNameRequired:'请输入资质名称',
		qualificationMaxLength:'最大长度不超过30个汉字',
		qualificationFileRequired:'请上传资质文件',
		pictureMaxSize:'单张图片最大不超过500K',
		pictureType:'图片仅支持JPG、PNG格式',
		qualificationValidStartTime:'请选择起始日期',
		qualificationValidEndTime:'请选择结束日期',
	}
};

export const TEXT_MESSAGE = {
	commonMessage: {
		longTermEffective: '长期有效',
	},
};