import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import actions from 'actions';
import store from './vuex/index.js';

// router
import routerConfig from './config/router.config.js';

import {
	isEmptyObj
} from 'utils/common.js';

const router = new VueRouter({
	routes: routerConfig
});

router.beforeEach((to, from, next) => {
	let userInfo = store.state.userInfo;
	if (!isEmptyObj(userInfo)) {
		if (from.name === 'testEnd') {
			next(false);
		} else {
			if (userInfo.isRegistered === 1) { //入驻
				if (userInfo.isApproved === 1) {
					if (['register', 'succeed', 'refused'].indexOf(to.name) == -1) {
						document.body.style['background-image'] = to.meta.hasOwnProperty('isShowSubMenu') && !to.meta.isShowSubMenu ? 'none' : '';
						next();
					} else {
						next(false);
					}
				} else if (userInfo.isApproved === -1) {
					if (to.name == 'refused' || to.name === 'register') {
						document.body.style['background-image'] = to.meta.hasOwnProperty('isShowSubMenu') && !to.meta.isShowSubMenu ? 'none' : '';
						next();
					} else {
						next(false);
					}
				} else {
					if (to.name == 'succeed') {
						document.body.style['background-image'] = to.meta.hasOwnProperty('isShowSubMenu') && !to.meta.isShowSubMenu ? 'none' : '';
						next();
					} else {
						next(false);
					}
				}
			} else {
				if (to.name !== 'register' && to.name !== 'agreement' && to.name !== 'succeed') {
					next(false);
				} else {
					document.body.style['background-image'] = to.meta.hasOwnProperty('isShowSubMenu') && !to.meta.isShowSubMenu ? 'none' : '';
					next();
				}
			}
		}
	} else {
		document.body.style['background-image'] = to.meta.hasOwnProperty('isShowSubMenu') && !to.meta.isShowSubMenu ? 'none' : '';
		next();
	}
});

export default router;