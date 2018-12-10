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
import infiniteScroll from 'vue-infinite-scroll';

Vue.use(infiniteScroll)


// element-ui
import './ui.js';

// 检测登录 记录用户信息 跳转页面
import Http from 'http';
import actions from 'actions';
import moment from 'moment';
import vueMoment from 'vue-moment';

Vue.use(vueMoment);
//find兼容性处理
Array.prototype.find = Array.prototype.find || function(fn, context) {
	if (typeof fn === "function") {
		for (var k = 0, length = this.length; k < length; k++) {
			if (fn.call(context, this[k], k, this)) {
				return this[k];
			}
		}
	}
	return undefined;
};

Http.get('api/user', {
		hideLoading: true
	})
	.then((res) => {
		if (res.data.iserror && res.data.code === 401) {
			// 未登录
			/*router.push({
				name: 'login'
			});*/
			window.location.href = '/home';
		} else {
			actions.setUserInfo(store, res.data.data);
			if (res.data.data.status === 0 || res.data.data.status === -1) {
				router.push({
					name: 'error403'
				});
			} else {
				// userInfoIndex = setInterval(function() {
				// 	Http.get('api/user', {
				// 		hideLoading: true
				// 	}).then(res => {
				// 		if (res.data.data.status === 0 || res.data.data.status === -1) {
				// 			clearInterval(userInfoIndex);
				// 			router.push({
				// 				name: 'error403'
				// 			});
				// 		};
				// 	});
				// }, 1000 * 60 * 60);
				Http.get('/api/productlines').then(res => {
					if (res.data.code === 200 && res.data.iserror === 0) {
						actions.setProductLine(store, res.data.data);
					}
				});
				if (!res.data.data.isRegistered) {
					router.push({
						name: 'register'
					});
				} else if (!res.data.data.isApproved) {
					router.push({
						name: 'succeed'
					});
				} else if (res.data.data.isApproved === -1) {
					router.push({
						name: 'refused'
					});
				} else if (res.data.data.isTest === 1 && moment().valueOf() > res.data.data.testEndTime) {
					router.push({
						name: 'testEnd'
					});
				} else {
					localStorage.removeItem(res.data.data.userId);
				}
			}
		}
		new Vue({
			el: '#app',
			store: store,
			template: '<app></app>',
			components: {
				app: App
			},
			router: router
		});
	});