import Vue from 'vue';

// directive
import './directive/index.js';

// filter
import './filter/index.js';

// app component
import App from './app.vue';

// router
import router from './route.js';

// vuex
import store from './vuex/index.js';

// import {
// 	resetRouterWithPrivilege
// } from 'utils/common';
// import routerConfig from './config/router.config.js';

// element-ui
import './ui.js';

// 检测登录 记录用户信息 跳转页面
import Http from 'http';
import actions from 'actions';
import vueMoment from 'vue-moment';

import func from './utils/func';
Vue.use(func);


Vue.use(vueMoment);

// Http.get('/api/auth/account', {
// 	hideLoading: true
// }).then((res) => {
// const router = new VueRouter();
// actions.setAccountInfo(store, res.data.data);
// resetRouterWithPrivilege(routerConfig);
// router.addRoutes(routerConfig);
new Vue({
	el: '#app',
	store: store,
	template: '<app></app>',
	components: {
		app: App
	},
	router: router
});
// });