import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

import actions from 'actions';
import store from './vuex/index.js';

// router
import routerConfig from './config/router.config.js';

const router = new VueRouter({
	routes: routerConfig
	// routes: []
});
router.beforeEach((to, from, next) => {
	let privileges = store.state.accountInfo.privileges;
	let metaPermission = to.meta.permission;
	if (metaPermission === '') {
		// if (to.name === "index") {
		// 	document.body.style['background-image'] = 'none';
		// } else {
		// 	document.body.style['background-image'] = '';
		// }
		next();
	} else {
		/*
		let hasPrivilege = privileges.find((privilege) => {
			return privilege.permission === metaPermission && privilege.isDisplay === 1;
		});
		if (hasPrivilege || to.name === 'error404' || to.name === 'error403' || to.name === 'login') {
			if (to.name.indexOf('error') > -1) {
				document.body.style['background-image'] = 'none';
			} else {
				document.body.style['background-image'] = '';
			}
			next();
		} else {
			next({
				name: 'error403'
			});
			// next(false);
			// actions.error(store, 403);
		}*/
		next();
	}
});

export default router;