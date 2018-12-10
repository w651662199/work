import Vue from 'vue';
import Axios from 'axios';
import router from '../route.js';
import apiConfig from '../config/api.config.js';

import actions from 'actions';
import store from 'store';
// Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

const instance = Axios.create({
	baseURL: $CONFIG['domain'],
	timeout: 15000
});

instance.interceptors.request.use(req => {
	if (req.hideLoading) {
		actions.loading(store, false);
	} else {
		actions.loading(store, true);
	}
	actions.error(store, 0);
	return req;
}, error => {
	actions.loading(store, false);
	console.log(error);
	Vue.prototype.$message({
		message: '操作失败，请检查网络设置或稍后再试',
		type: 'error',
		showClose: true
	});
	return Promise.reject(error);
});

instance.interceptors.response.use(res => {
	actions.loading(store, false);
	// 未登录 跳转到登陆页
	if (res.data.iserror) {
		if (res.data.code === 401) {
			window.location.href = '/home';
		} else if (res.config.method !== 'get' && res.config.url.indexOf('login') === -1 && res.config.url.indexOf('/page/publish') === -1) {
			// 非 get 接口出错，为表单提交的情况，将报错信息显示到页面上
			// Vue.prototype.$message({
			// 	message: res.data.msg,
			// 	type: 'error',
			// 	showClose: true
			// });
		}
	}
	/** else if (res.data.code !== 200) {
			if (res.config.method === 'get' && res.data.code === 403) {
				actions.error(store, 403);
			} else if (res.config.method === 'get' && res.data.code === 500) {
				actions.error(store, 500);
			} else {
				actions.error(store, 0);
			}
		}*/
	return res;
}, error => {
	actions.loading(store, false);
	console.log(error);
	Vue.prototype.$message({
		message: '操作失败，请检查网络设置或稍后再试',
		type: 'error',
		showClose: true
	});
	return Promise.reject(error);
});

export default instance;
