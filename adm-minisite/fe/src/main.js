// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';

import 'mint-ui/lib/style.css';
import App from './App';
import FastClick from 'fastclick';
import store from './vuex/index.js';

import 'swiper/dist/css/swiper.css';
import {Lazyload} from 'mint-ui';
Vue.use(Lazyload);

Vue.config.productionTip = false;

if ('addEventListener' in document) {
	document.addEventListener('DOMContentLoaded', function() {
		FastClick.attach(document.body);
	}, false);
}

/* eslint-disable no-new */
new Vue({
	el: '#app',
	store: store,
	template: '<App/>',
	components: { App }
});
