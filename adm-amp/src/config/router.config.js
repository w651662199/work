export default [{
	path: '/',
	redirect: '/app/index'
}, {
	path: '/app',
	component: require('../components/app/main.vue'),
	redirect: '/app/index',
	children: [{
		path: 'index', // 首页
		name: 'index',
		component: require('../components/app/index/main.vue')
	}, {
		path: 'account', // 我的账户
		name: 'account',
		component: require('../components/app/account/main.vue'),
		redirect: '/app/account/manage',
		children: [{
			name: 'manage',
			path: 'manage',
			component: require('../components/app/account/manage/main.vue'),
			redirect: '/app/account/manage/fund',
			children: [{
				name: 'fund',
				path: 'fund',
				component: require('../components/app/account/manage/fund/main.vue')
			}, {
				name: 'detail',
				path: 'detail',
				component: require('../components/app/account/manage/detail/main.vue')
			}, {
				name: 'invoice',
				path: 'invoice',
				component: require('../components/app/account/manage/invoice/invoiceList.vue')
			}]
		}, {
			name: 'expense',
			path: 'expense/:date',
			component: require('../components/app/account/manage/detail/expenseDaily.vue')
		}, {
			name: 'recharge',
			path: 'recharge',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/manage/fund/recharge.vue')
		}, {
			name: 'transoa',
			path: 'transoa',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/manage/fund/transferOa.vue')
		}, {
			name: 'transcash',
			path: 'transcash',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/manage/fund/transferCash.vue')
		}, {
			name: 'transvir',
			path: 'transvir',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/manage/fund/transferVirtual.vue')
		}, {
			path: 'certificate', // 商家资质
			name: 'certificate',
			component: require('../components/app/account/certificate/certificate.vue'),
		}, {
			path: 'newcert', // 商家资质
			name: 'newcert',
			component: require('../components/app/account/certificate/createCertificate.vue'),
		}, {
			path: 'modcert/:id', // 商家资质
			name: 'modcert',
			component: require('../components/app/account/certificate/createCertificate.vue'),
		}, {
			path: 'balance', // 余额提醒
			name: 'balance',
			component: require('../components/app/account/balance/balance.vue'),
		}, {
			path: 'contact', // 联系方式
			name: 'contact',
			component: require('../components/app/account/contact/contact.vue'),
		}, {
			path: 'newinvoice', // 开发票
			name: 'newinvoice',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/manage/invoice/createInvoice.vue'),
		}, {
			path: 'supcert', // 补充资质
			name: 'supcert',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/manage/invoice/supplementCertificate.vue'),
		}, {
			path: 'viewinvoice/:id', // 补充资质
			name: 'viewinvoice',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/manage/invoice/viewInvoice.vue'),
		}, {
			path: 'message', // 站内信
			component: require('../components/app/account/notice/message/messageList.vue'),
			name: 'message'
		}, {
			path: 'mdetail/:id', // 站内信详情
			name: 'mdetail',
			component: require('../components/app/account/notice/message/messageDetail.vue')
		}, {
			path: 'announce', // 系统公告
			component: require('../components/app/account/notice/announce/announceList.vue'),
			name: 'announce'
		}, {
			path: 'adetail/:id', // 系统公告详情
			name: 'adetail',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/notice//announce/announceDetail.vue')
		}, {
			path: 'standard', // 广告审核规范
			name: 'standard',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/standard.vue'),
		}, {
			path: 'platform', // 用户协议 1
			name: 'platform',
			meta: {
				isShowSubMenu: false
			},
			component: require('../components/app/account/platform.vue'),
		}]
	}, {
		path: 'put', // 投放管理
		component: require('../components/app/put/cpc/main.vue'),
		redirect: '/app/put/index',
		children: [{
			path: 'index', // 投放计划
			name: 'put-cpc-index',
			component: require('../components/app/put/cpc/index.vue'),
		}, {
			path: 'plan', // 投放计划
			component: require('../components/app/put/cpc/plan.vue'),
		}, {
			path: 'unit/:id', // 投放单元 params [id -> 投放单元 id]
			name: 'unit',
			component: require('../components/app/put/cpc/unit.vue'),
		}, {
			path: 'idea/:id', // 投放单元 params [id -> 投放单元 id]
			name: 'idea',
			component: require('../components/app/put/cpc/idea.vue'),
		}, {
			path: 'report/plan/campaign',
			name: 'plan-campaign',
			component: require('../components/app/report/cpc/plan-campaign.vue')
		}, {
			path: 'report/plan/flight',
			name: 'plan-flight',
			component: require('../components/app/report/cpc/plan-flight.vue')
		}, {
			path: 'report/plan/material',
			name: 'plan-material',
			component: require('../components/app/report/cpc/plan-material.vue')
		}, {
			path: 'report/effect/order',
			name: 'effect-order',
			component: require('../components/app/report/cpc/effect-order.vue')
		}, {
			path: 'report/effect/summary',
			name: 'effect-summary',
			component: require('../components/app/report/cpc/effect-summary.vue')
		}, {
			path: 'report/rebate/campaign',
			name: 'rebate-campaign',
			component: require('../components/app/report/cpc/rebate-campaign.vue')
		}, {
			path: 'report/rebate/flight',
			name: 'rebate-flight',
			component: require('../components/app/report/cpc/rebate-flight.vue')
		}, {
			path: 'report/rebate/material',
			name: 'rebate-material',
			component: require('../components/app/report/cpc/rebate-material.vue')
		}]
	}, {
		path: 'tool', // 工具
		component: require('../components/app/tools/webpage/main.vue'),
		redirect: '/app/tool/webpage',
		children: [{
			path: 'webpage', // 自建活动
			component: require('../components/app/tools/webpage/page.vue'),
		}, {
			path: 'survey', // 调查问卷
			component: require('../components/app/tools/survey/survey.vue'),
		}, {
			path: 'tag', //dmp
			component: require('../components/app/tools/dmp/tagManage/main.vue'),
		}, {
			path: 'crowd', //dmp
			component: require('../components/app/tools/dmp/crowdManage/main.vue'),
		}]
	}, {
		path: 'register', // 商家入驻,
		name: 'register',
		meta: {
			isShowSubMenu: false
		},
		component: require('../components/app/register/main.vue')
	}, {
		path: 'succeed',
		name: 'succeed',
		meta: {
			isShowSubMenu: false
		},
		component: require('../components/app/register/succeed.vue')
	}, {
		path: 'refused',
		name: 'refused',
		meta: {
			isShowSubMenu: false
		},
		component: require('../components/app/register/refused.vue')
	}, {
		path: 'bidcpc',
		component: require('../components/app/put/bidcpc/main.vue'),
		redirect: '/app/bidcpc/index',
		children: [{
			path: 'index', // 投放计划
			name: 'put-bidcpc-index',
			component: require('../components/app/put/bidcpc/index.vue'),
		}, {
			path: 'plan', // 投放计划
			component: require('../components/app/put/bidcpc/plan.vue'),
		}, {
			path: 'unit/:id', // 投放单元 params [id -> 投放单元 id]
			name: 'bidcpcUnit',
			component: require('../components/app/put/bidcpc/unit.vue'),
		}, {
			path: 'idea/:id', // 投放单元 params [id -> 投放单元 id]
			name: 'bidcpcIdea',
			component: require('../components/app/put/bidcpc/idea.vue'),
		}, {
			path: 'report/plan/campaign',
			name: 'bidcpc-plan-campaign',
			component: require('../components/app/report/bidCpc/plan-campaign.vue')
		}, {
			path: 'report/plan/flight',
			name: 'bidcpc-plan-flight',
			component: require('../components/app/report/bidCpc/plan-flight.vue')
		}, {
			path: 'report/plan/material',
			name: 'bidcpc-plan-material',
			component: require('../components/app/report/bidCpc/plan-material.vue')
		}, {
			path: 'report/plan/keywords',
			name: 'bidcpc-plan-keywords',
			component: require('../components/app/report/bidCpc/plan-keywords.vue')
		}, {
			path: 'report/effect/summary',
			name: 'bidcpc-effect-summary',
			component: require('../components/app/report/bidCpc/effect-summary.vue')
		}, {
			path: 'report/effect/order',
			name: 'bidcpc-effect-order',
			component: require('../components/app/report/bidCpc/effect-order.vue')
		}]
	}, {
		path: 'error403',
		name: 'error403',
		meta: {
			isShowSubMenu: false
		},
		component: require('../components/error/forbidden.vue')
	}]
}, {
	path: '/test-end',
	name: 'testEnd',
	component: require('../components/error/test.vue')
}, {
	path: '*',
	name: 'error',
	component: require('../components/error/notfound.vue')
}];