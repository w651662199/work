export default [{
	path: '/',
	redirect: '/app/index',
	meta: {
		permission: ''
	}
}, {
	path: '/app',
	name: 'app',
	component: require('../components/app/main.vue'),
	redirect: '/app/index',
	meta: {
		permission: ''
	},
	children: [{
		// 首页
		path: 'index',
		name: 'index',
		meta: {
			permission: ''
		},
		component: require('../components/app/index/main.vue')
	}, {
		path: 'put',
		name: 'put',
		redirect: '/app/put/group',
		component: require('../components/app/put/main.vue'),
		children: [{
			path: 'group',
			name: 'group',
			component: require('../components/app/put/group/groupList.vue')
		}, {
			path: 'campaign/:id',
			name: 'groupCampaign',
			component: require('../components/app/put/campaign/campaignList.vue')
		}, {
			path: 'campaign',
			name: 'campaign',
			component: require('../components/app/put/campaign/campaignList.vue')
		}, {
			path: 'flight/:id',
			name: 'flight',
			component: require('../components/app/put/flight/flightList.vue')
		}, {
			path: 'material/:id',
			name: 'material',
			component: require('../components/app/put/flight/flightMaterialList.vue')
		}, {
			path: 'material',
			name: 'materialList',
			component: require('../components/app/put/material/materialList.vue')
		}]
	}, {
		// 工具
		path: 'tool',
		name: 'tool',
		meta: {
			permission: ''
		},
		redirect: '/app/tool/crowd',
		component: require('../components/app/tools/main.vue'),
		children: [{
			path: 'crowd',
			name: 'crowd',
			meta: {
				permission: ''
			},
			component: require('../components/app/tools/crowd/crowdList.vue')
		}, {
			path: 'crowdEdit/:id',
			name: 'crowdEdit',
			meta: {
				permission: ''
			},
			component: require('../components/app/tools/crowd/crowdEdit.vue')
		}, {
			path: 'tag',
			name: 'tag',
			meta: {
				permission: ''
			},
			component: require('../components/app/tools/tag/tagList.vue')
		}],
	}, {
		// 报表
		path: 'report',
		name: 'report',
		meta: {
			permission: ''
		},
		redirect: '/app/report/group',
		component: require('../components/app/report/main.vue'),
		children: [{
			path: 'group',
			name: 'groupReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/group.vue')
		}, {
			path: 'campaign',
			name: 'campaignReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/campaign.vue')
		}, {
			path: 'flight',
			name: 'flightReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/flight.vue')
		}, {
			path: 'material',
			name: 'materialReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/material.vue')
		}, {
			path: 'group/hour/:slotId/:groupId/:startDate/:endDate',
			name: 'groupHourReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/groupHour.vue')
		}, {
			path: 'campaign/hour/:slotId/:campaignId/:startDate/:endDate',
			name: 'campaignHourReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/campaignHour.vue')
		}, {
			path: 'flight/hour/:slotId/:flightId/:startDate/:endDate',
			name: 'flightHourReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/flightHour.vue')
		}, {
			path: 'material/hour/:slotId/:campaignId/:flightId/:materialId/:startDate/:endDate',
			name: 'materialHourReport',
			meta: {
				permission: ''
			},
			component: require('../components/app/report/materialHour.vue')
		}],
	}, {
		path: '403',
		name: 'error403',
		component: require('../components/error/forbidden.vue')
	}]
}, {
	path: '*',
	name: 'error404',
	component: require('../components/error/notfound.vue')
}];