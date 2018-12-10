import Vue from 'vue';
import Axios from 'axios';
import apiConfig from '@/config/api.config.js';

import actions from 'actions';
import store from 'store';

const instance = Axios.create({
	//baseURL: apiConfig[process.env.NODE_ENV],
	timeout: 5000
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
	return Promise.reject(error);
});

instance.interceptors.response.use(res => {
	actions.loading(store, false);
	return res;
}, error => {
	return Promise.reject(error);
});

export default instance;